import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration, RuleSetRule } from 'webpack';
import path from 'path';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { iterateObjectValues } from '../../utility/iterationHelper';

export type Config = {
    include: string[];
    loaderOptions: {
        cacheDirectory: boolean;
        [key: string]: any;
    };
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
    loaderOptions: {
        cacheDirectory: true, // For performance @see https://github.com/babel/babel-loader#babel-loader-is-slow
    },
};

export default class BabelLoaderAdapter implements Adapter {
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
            this.validateAllRequiredModulesAreInstalled();
        }

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        if (typeof webpackConfig.module.rules === 'undefined') {
            webpackConfig.module.rules = [];
        }

        const rule: RuleSetRule = {
            test: /\.(ts|js)x?$/,
            include: this.config.include,
            use: [
                {
                    loader: 'babel-loader',
                    options: this.config.loaderOptions,
                },
            ],
        };

        webpackConfig.module.rules.push(rule);

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules = {
            'babel-loader': '8.1.0',
            '@babel/preset-env': '7.13.0',
        };

        iterateObjectValues(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'BabelLoaderAdapter',
                module,
                minVersion
            );
        });
    }
}
