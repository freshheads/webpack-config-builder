import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetCondition, RuleSetRule } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import path from 'path';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import deepmerge from 'deepmerge';

export type Config = {
    include: RuleSetCondition;
    linting: {
        enabled: boolean;
        configurationPath: string;
    };
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
    linting: {
        enabled: true,
        configurationPath: path.resolve(process.cwd(), 'tslint.json'),
    },
};

export default class TypescriptAdapter implements Adapter {
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
        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        webpackConfig.module.rules.push(this.createLoadingRule());

        if (
            this.config.linting.enabled &&
            builderConfig.env !== Environment.Production
        ) {
            webpackConfig.module.rules.push(this.createLintingRule());
        }

        next();

        this.ensureTypescriptFilesAreResolvedRegularJavascriptFiles(
            webpackConfig
        );
    }

    private ensureTypescriptFilesAreResolvedRegularJavascriptFiles(
        webpackConfig: Configuration
    ) {
        if (
            typeof webpackConfig.resolve === 'undefined' ||
            typeof webpackConfig.resolve.extensions === 'undefined'
        ) {
            // fallback on default Webpack extension resolving. Only mess with that
            // if it is done intentionally.

            return;
        }

        const extensionsToAdd = ['.tsx', '.ts'];

        for (let i = 0, l = extensionsToAdd.length; i < l; i++) {
            const extensionToAdd = extensionsToAdd[i];

            webpackConfig.resolve.extensions.unshift(extensionToAdd);
        }
    }

    private createLintingRule(): RuleSetRule {
        this.validateAllRequiredLintingModulesAreInstalled();

        return {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: [
                {
                    loader: 'tslint-loader',
                    options: {
                        configFile: this.config.linting.configurationPath,
                    },
                },
            ],
        };
    }

    private createLoadingRule(): RuleSetRule {
        return {
            test: /\.tsx?$/,
            include: this.config.include,
            use: [
                {
                    loader: 'ts-loader',
                },
            ],
        };
    }

    private validateAllRequiredLintingModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('tslint-loader')) {
            throw new Error(
                "The 'tslint-loader'-module needs to be installed for this adapter to work"
            );
        }
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules = ['ts-loader'];

        requiredModules.forEach(module => {
            if (!checkIfModuleIsInstalled(module)) {
                throw new Error(
                    `The '${module}' needs to be installed for this adapter to work`
                );
            }
        });
    }
}
