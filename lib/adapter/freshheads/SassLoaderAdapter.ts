import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import deepmerge from 'deepmerge';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { checkPluginInstanceIsInWebpackConfig } from '../../utility/webpackConfigHelper';
import { iterateObjectValues } from '../../utility/iterationHelper';

export type Config = {
    cssLoaderOptions: {
        sourceMap: boolean;
        [key: string]: any;
    };
    sassLoaderOptions: {
        sourceMap: boolean;
        [key: string]: any;
    };
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
        modules: {
            auto: true, // enable css modules for filenames that contain .module.scss
        },
    },
    sassLoaderOptions: {
        sourceMap: true,
    },
};

export default class SassLoaderAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config);
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAllRequiredModulesAreInstalled();
        // add implementation here instead of directly in DEFAULT_CONFIG.
        // If added in DEFAULT_CONFIG the require tries to import sass even though sass is disabled.
        // This causes problems when sass isn't installed.
        this.config.sassLoaderOptions.implementation = require('sass'); // prefer `dart-sass` instead of `node-sass` in case both are installed

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = { rules: [] };
        }

        const isProduction = builderConfig.env === Environment.Production;

        webpackConfig.module.rules.push(this.createRule(isProduction));

        next();

        if (!this.checkMiniCssExtractPluginIsInWebpackConfig(webpackConfig)) {
            new ExtractCssPluginAdapter().apply(
                webpackConfig,
                builderConfig,
                () => {}
            );
        }
    }

    private checkMiniCssExtractPluginIsInWebpackConfig(
        webpackConfig: Configuration
    ): boolean {
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');

        return checkPluginInstanceIsInWebpackConfig(
            MiniCssExtractPlugin,
            webpackConfig
        );
    }

    private createRule(isProduction: boolean): RuleSetRule {
        const {
            loader: miniCssExtractPluginLoader,
        } = require('mini-css-extract-plugin');

        return {
            test: /\.scss$/,
            use: [
                {
                    loader: miniCssExtractPluginLoader,
                },
                {
                    loader: 'css-loader',
                    options: this.config.cssLoaderOptions,
                },
                this.createPostCssLoaderUse(isProduction),
                {
                    loader: 'resolve-url-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'sass-loader',
                    options: this.config.sassLoaderOptions,
                },
            ],
        };
    }

    private createPostCssLoaderUse(isProduction: boolean): RuleSetUseItem {
        return {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: () => {
                    const autoprefixer = require('autoprefixer');

                    const plugins = [
                        autoprefixer({
                            remove: false,
                        }),
                    ];

                    if (isProduction) {
                        const cssNano = require('cssnano');

                        plugins.push(cssNano);
                    }

                    return plugins;
                },
            },
        };
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            'mini-css-extract-plugin': '0.9.0',
            autoprefixer: '9.7.0',
            'sass-loader': '8.0.0',
            'resolve-url-loader': '3.1.0',
            'css-loader': '3.2.0',
            'postcss-loader': '3.0.0',
            cssnano: '4.1.10',
            sass: '1.26.0',
            fibers: '4.0.2',
        };

        iterateObjectValues<string>(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'SassLoaderAdapter',
                module,
                minVersion
            );
        });
    }
}
