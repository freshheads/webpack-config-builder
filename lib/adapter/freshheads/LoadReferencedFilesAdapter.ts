import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export type Config = {
    test: string | RegExp;
};

export const DEFAULT_CONFIG: Config = {
    test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.jpe?g$|\.png$|\.gif$/,
};

export default class LoadReferencedFilesAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            validateIfRequiredModuleIsInstalled(
                'LoadReferencedFilesAdapter',
                'file-loader',
                '6.0.0'
            );
        }

        const rule: RuleSetRule = {
            test: this.config.test,
            loader: 'file-loader',
            options: {
                name: '[name].[contenthash].[ext]',
            },
        };

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        webpackConfig.module.rules.push(rule);

        next();
    }
}
