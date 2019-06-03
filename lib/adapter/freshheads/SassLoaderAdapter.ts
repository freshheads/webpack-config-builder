import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import deepmerge from 'deepmerge';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { checkPluginInstanceIsInWebpackConfig } from '../../utility/webpackConfigHelper';

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
        const requiredModules = [
            'mini-css-extract-plugin',
            'autoprefixer',
            'sass-loader',
            'resolve-url-loader',
            'css-loader',
            'postcss-loader',
        ];

        requiredModules.forEach(module => {
            if (!checkIfModuleIsInstalled(module)) {
                throw new Error(
                    `The '${module}' needs to be installed for this adapter to work`
                );
            }
        });
    }
}
