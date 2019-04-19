import { Adapter, NextCallback } from '../Adapter';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig } from '../../Builder';
import { Configuration, RuleSetRule, RuleSetCondition } from 'webpack';
import path from 'path';

export type Config = {
    include: RuleSetCondition;
    babelConfigurationFilePath: string;
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
    babelConfigurationFilePath: path.resolve(process.cwd(), 'babel.config.js'),
};

export default class DefaultJavascriptRuleAdapter implements Adapter {
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

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const rule: RuleSetRule = {
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

        webpackConfig.module.rules.push(rule);

        next();
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
