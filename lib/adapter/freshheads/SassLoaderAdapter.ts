import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
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
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAllRequiredModulesAreInstalled();

        // add implementation here instead of directly in DEFAULT_CONFIG.
        // If added in DEFAULT_CONFIG the require tries to import sass even though sass is disabled.
        // This causes problems when sass isn't installed.
        this.config.sassLoaderOptions.implementation = require('sass'); // prefer `dart-sass` instead of `node-sass` in case both are installed

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
            'sass-loader': '8.0.0',
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
