import { Adapter, NextCallback } from '../Adapter';
import path from 'path';
import { BuilderConfig } from '../../Builder';
import { Configuration, RuleSetRule } from 'webpack';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';

export type Config = {
    configurationPath: string;
};

export const DEFAULT_CONFIG: Config = {
    configurationPath: path.resolve(process.cwd(), '.eslintrc'),
};

export default class DefaultESLintRuleAdapter implements Adapter {
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
        this.validateAllRequiredModulesAreInstalled();

        const rule: RuleSetRule = {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        configFile: this.config.configurationPath,
                    },
                },
            ],
        };

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        webpackConfig.module.rules.push(rule);

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('eslint-loader')) {
            throw new Error(
                "The 'eslint-loader'-module needs to be installed for this adapter to work"
            );
        }
    }
}
