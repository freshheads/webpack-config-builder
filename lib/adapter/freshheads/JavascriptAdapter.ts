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
import JavascriptLintingAdapter, {
    Config as LintingConfig,
    DEFAULT_CONFIG as DEFAULT_LINTING_CONFIG,
} from './JavascriptLintingAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    babelConfig: BabelLoaderConfig;
    linting: EnabledConfig & LintingConfig;
    jQuery: {
        enabled: boolean;
    };
};

export const DEFAULT_CONFIG: Config = {
    babelConfig: DEFAULT_BABEL_LOADER_CONFIG,
    linting: {
        enabled: true,
        ...DEFAULT_LINTING_CONFIG,
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

        if (this.config.linting.enabled) {
            builder.add(new JavascriptLintingAdapter(this.config.linting));
        }

        builder.build();

        // @todo add below to adapters and call them instead of manual implementation (DRY)

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const isProduction = builderConfig.env === Environment.Production;

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
}
