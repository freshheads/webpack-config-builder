import { Configuration, RuleSetRule, RuleSetUseItem, Plugin } from 'webpack';
import deepmerge from 'deepmerge';
import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { Builder } from '../..';
import path from 'path';

export type Config = {
    cssLoaderOptions: { [key: string]: any };
    sassLoaderOptions: { [key: string]: any };
    linting: {
        enabled: boolean;
        configurationPath: string;
    };
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
    },
    sassLoaderOptions: {
        sourceMap: true,
    },
    linting: {
        enabled: true,
        configurationPath: path.resolve(process.cwd(), '.stylelintrc'),
    },
};

export default class SassAdapter implements Adapter {
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

        webpackConfig.module.rules.push(this.createLoaderRule(isProduction));

        if (this.config.linting.enabled && !isProduction) {
            this.validateAllLintingModulesAreInstalled();

            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            webpackConfig.plugins.push(this.createLintingPlugin());
        }

        next();

        if (!this.checkMiniCssExtractPluginIsInWebpackConfig(webpackConfig)) {
            const internalBuilder = new Builder(builderConfig, webpackConfig);
            internalBuilder.add(new ExtractCssPluginAdapter());

            internalBuilder.build();
        }
    }

    private createLintingPlugin(): Plugin {
        const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

        return new StylelintBarePlugin({
            configFile: this.config.linting.configurationPath,
            files: path.resolve(process.cwd(), 'src/scss/**/*.s?(c|a)ss'),
        });
    }

    private createLoaderRule(isProduction: boolean): RuleSetRule {
        return {
            test: /\.scss$/,
            use: [
                {
                    loader: require('mini-css-extract-plugin').loader,
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

    private validateAllLintingModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('stylelint')) {
            throw new Error(
                "Expecting module 'stylelint' to be installed as it is required for this adapter to work"
            );
        }
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
}
