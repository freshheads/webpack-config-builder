import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration, RuleSetRule } from 'webpack';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import deepmerge from 'deepmerge';
import { iterateObjectValues } from '../../utility/iterationHelper';

export type Config = {
    enabled: boolean;
    sassLoaderOptions: {
        sourceMap: boolean;
        [key: string]: any;
    };
};

export const DEFAULT_CONFIG: Config = {
    enabled: true,
    sassLoaderOptions: {
        sourceMap: true,
    },
};

export default class SassLoaderAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config);
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
            webpackConfig.module = { rules: [] };
        }

        webpackConfig.module.rules.push(this.createRule());

        next();
    }

    private createRule(): RuleSetRule {
        return {
            test: /\.scss$/,
            use: [
                {
                    loader: 'resolve-url-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'sass-loader',
                    options: this.config.sassLoaderOptions,
                },
            ],
        };
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            'sass-loader': '10.0.0',
            'resolve-url-loader': '3.1.0',
            sass: '1.26.0',
            fibers: '5.0.0',
        };

        iterateObjectValues<string>(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'SassLoaderAdapter',
                module,
                minVersion
            );
        });
    }
}
