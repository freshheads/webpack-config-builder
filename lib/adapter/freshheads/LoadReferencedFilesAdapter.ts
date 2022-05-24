import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import { BuilderConfig } from '../../Builder';

export type Config = {
    additionalAssetRules: RuleSetRule[];
};

export const DEFAULT_CONFIG: Config = {
    additionalAssetRules: [],
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
        const rules: RuleSetRule = {
            oneOf: [
                ...this.config.additionalAssetRules,
                {
                    test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.jpe?g$|\.png$|\.gif$|\.webp$|\.avif$/,
                    type: 'asset/resource',
                },
            ],
        };

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        if (typeof webpackConfig.module.rules === 'undefined') {
            webpackConfig.module.rules = [];
        }

        webpackConfig.module.rules.push(rules);

        next();
    }
}
