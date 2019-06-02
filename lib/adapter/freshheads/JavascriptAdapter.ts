import { Adapter, NextCallback } from '../Adapter';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import {
    Configuration,
    RuleSetRule,
    RuleSetCondition,
    ProvidePlugin,
} from 'webpack';
import path from 'path';
import deepmerge from 'deepmerge';
import { Builder } from '../..';
import BabelLoaderAdapter, {
    Config as BabelLoaderConfig,
    DEFAULT_CONFIG as DEFAULT_BABEL_LOADER_CONFIG,
} from './BabelLoaderAdapter';

export type Config = {
    babelConfig: BabelLoaderConfig;
    linting: {
        enabled: boolean;
        configurationPath: string;
    };
    jQuery: {
        enabled: boolean;
    };
};

export const DEFAULT_CONFIG: Config = {
    babelConfig: DEFAULT_BABEL_LOADER_CONFIG,
    linting: {
        enabled: true,
        configurationPath: path.resolve(process.cwd(), '.eslintrc'),
    },
    jQuery: {
        enabled: false,
    },
};

export default class JavascriptAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config, {
            arrayMerge: (destinationArray, sourceArray) => sourceArray,
        });
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const builder = new Builder(builderConfig, webpackConfig);

        builder.add(new BabelLoaderAdapter(this.config.babelConfig));

        builder.build();

        // @todo add below to adapters and call them instead of manual implementation (DRY)

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const isProduction = builderConfig.env === Environment.Production;

        if (this.config.linting.enabled && !isProduction) {
            webpackConfig.module.rules.push(this.createLintingRule());
        }

        if (isProduction) {
            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            const UglifyjsPlugin = require('uglifyjs-webpack-plugin');

            webpackConfig.plugins.push(
                new UglifyjsPlugin({
                    sourceMap: true,
                })
            );
        }

        if (this.config.jQuery.enabled) {
            if (!checkIfModuleIsInstalled('jquery')) {
                throw new Error(
                    "The 'jquery' module needs to be installed for webpack to be able to provide it"
                );
            }

            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            webpackConfig.plugins.push(this.createJqueryProvidePlugin());
        }

        next();
    }

    private createJqueryProvidePlugin(): ProvidePlugin {
        return new ProvidePlugin({
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        });
    }

    private createLintingRule(): RuleSetRule {
        this.validateAllLinitingModulesAreInstalled();

        return {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        configFile: this.config.linting.configurationPath,
                    },
                },
            ],
        };
    }

    private validateAllLinitingModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('eslint')) {
            throw new Error(
                "The 'eslint'-module needs to be installed for this adapter to work"
            );
        }

        if (!checkIfModuleIsInstalled('eslint-loader')) {
            throw new Error(
                "The 'eslint-loader'-module needs to be installed for this adapter to work"
            );
        }
    }
}
