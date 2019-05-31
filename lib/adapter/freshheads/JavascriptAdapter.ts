import { Adapter, NextCallback } from '../Adapter';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig } from '../../Builder';
import { Configuration, RuleSetRule, RuleSetCondition } from 'webpack';
import path from 'path';
import deepmerge = require('deepmerge');
import webpack = require('webpack');

export type Config = {
    include: RuleSetCondition;
    babelConfigurationFilePath: string;
    linting: {
        enabled: boolean;
        configurationPath: string;
    };
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
    babelConfigurationFilePath: path.resolve(process.cwd(), 'babel.config.js'),
    linting: {
        enabled: true,
        configurationPath: path.resolve(process.cwd(), '.eslintrc'),
    },
};

export default class JavascriptAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge(DEFAULT_CONFIG, config, {
            arrayMerge: (destinationArray, sourceArray) => sourceArray,
        });
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

        webpackConfig.module.rules.push(this.createFileLoaderRule());

        if (this.config.linting.enabled) {
            webpackConfig.module.rules.push(this.createLintingRule());
        }

        next();
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

    private createFileLoaderRule(): RuleSetRule {
        return {
            test: /\.jsx?$/,
            include: this.config.include,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        // For performance @see https://github.com/babel/babel-loader#babel-loader-is-slow
                        cacheDirectory: true,

                        configFile: this.config.babelConfigurationFilePath,
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

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules = ['babel-loader', '@babel/preset-env'];

        requiredModules.forEach(module => {
            if (!checkIfModuleIsInstalled(module)) {
                throw new Error(
                    `The '${module}' needs to be installed for this adapter to work`
                );
            }
        });
    }
}
