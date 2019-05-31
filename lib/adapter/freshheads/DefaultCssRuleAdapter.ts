import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import deepmerge from 'deepmerge';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { Builder } from '../..';

export type Config = {
    cssLoaderOptions: { [key: string]: any };
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
    },
};

export default class DefaultCssRuleAdapter implements Adapter {
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

        const plugins = webpackConfig.plugins;

        return (
            plugins.findIndex(
                plugin => plugin instanceof MiniCssExtractPlugin
            ) !== -1
        );
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules = [
            'mini-css-extract-plugin',
            'autoprefixer',
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
