import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetCondition, RuleSetRule } from 'webpack';
import { BuilderConfig } from '../../Builder';
import path from 'path';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';

export type Config = {
    include: RuleSetCondition;
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
};

export default class TypescriptAdapter implements Adapter {
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
            test: /\.tsx?$/,
            include: this.config.include,
            use: [
                {
                    loader: 'ts-loader',
                },
            ],
        };

        webpackConfig.module.rules.push(rule);

        next();
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
