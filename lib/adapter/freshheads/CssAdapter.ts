import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import deepmerge from 'deepmerge';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { Builder } from '../..';
import { iterateObjectValues } from '../../utility/iterationHelper';

export type Config = {
    cssLoaderOptions: { [key: string]: any };
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
    },
};

export default class CssAdapter implements Adapter {
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
            webpackConfig.module = {
                rules: [],
            };
        }

        const isProduction = builderConfig.env === Environment.Production;

        const rule: RuleSetRule = {
            test: /\.css$/,
            use: [
                {
                    loader: require('mini-css-extract-plugin').loader,
                },
                {
                    loader: 'css-loader',
                    options: this.config.cssLoaderOptions,
                },
                {
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
                },
            ],
        };

        webpackConfig.module.rules.push(rule);

        next();

        if (!this.checkMiniCssExtractPluginIsInWebpackConfig(webpackConfig)) {
            const internalBuilder = new Builder(builderConfig, webpackConfig);
            internalBuilder.add(new ExtractCssPluginAdapter());

            internalBuilder.build();
        }
    }

    private checkMiniCssExtractPluginIsInWebpackConfig(
        webpackConfig: Configuration
    ): boolean {
        if (typeof webpackConfig.plugins === 'undefined') {
            return false;
        }

        const MiniCssExtractPlugin = require('mini-css-extract-plugin');

        const plugins = webpackConfig.plugins;

        return (
            plugins.findIndex(
                plugin => plugin instanceof MiniCssExtractPlugin
            ) !== -1
        );
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            'mini-css-extract-plugin': '0.8.0',
            autoprefixer: '9.7.0',
            'css-loader': '3.2.0',
            'postcss-loader': '3.0.0',
            cssnano: '4.1.10',
        };

        iterateObjectValues<string>(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'CssAdapter',
                module,
                minVersion
            );
        });
    }
}
