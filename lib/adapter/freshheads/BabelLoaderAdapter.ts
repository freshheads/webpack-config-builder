import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
import { Configuration, RuleSetRule } from 'webpack';
import path from 'path';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { iterateObjectValues } from '../../utility/iterationHelper';

export type Config = {
    include: string[];
    babelConfigurationFilePath: string;
};

export const DEFAULT_CONFIG: Config = {
    include: [path.resolve(process.cwd(), 'src/js')],
    babelConfigurationFilePath: path.resolve(process.cwd(), 'babel.config.js'),
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
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const rule: RuleSetRule = {
            test: /\.(ts|js)x?$/,
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
        const requiredModules = {
            'babel-loader': '8.0.0',
            '@babel/preset-env': '7.8.0',
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
