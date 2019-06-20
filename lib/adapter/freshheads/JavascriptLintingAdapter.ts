import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { Config } from '@jest/types';
import path from 'path';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';

export type Config = {
    configurationPath: string;
};

export const DEFAULT_CONFIG: Config = {
    configurationPath: path.resolve(process.cwd(), '.eslintrc'),
};

export default class JavascriptLintingAdapter implements Adapter {
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
        if (builderConfig.env === Environment.Production) {
            next();

            return;
        }

        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const rule: RuleSetRule = {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
                eslintPath: this.config.configurationPath,
            },
            enforce: 'pre',
        };

        webpackConfig.module.rules.push(rule);

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
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
