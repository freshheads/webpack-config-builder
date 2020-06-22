import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import { BuilderConfig } from '../../Builder';
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
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        validateIfRequiredModuleIsInstalled(
            'LoadReferencedFilesAdapter',
            'file-loader',
            '6.0.0'
        );

        const rule: RuleSetRule = {
            test: this.config.test,
            use: 'file-loader',
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
