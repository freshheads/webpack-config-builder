import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import { BuilderConfig } from '../../Builder';

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
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const rule: RuleSetRule = {
            test: this.config.test,
            type: 'asset/resource',
            generator: {
                // name must be included so assets can be used by webpack_asset twig extension
                filename: '[name].[hash][ext][query]',
            },
        };

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        if (typeof webpackConfig.module.rules === 'undefined') {
            webpackConfig.module.rules = [];
        }

        webpackConfig.module.rules.push(rule);

        next();
    }
}
