import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import deepmerge = require('deepmerge');

export type OptimizationOptions = Configuration['optimization'];

export default class OptimizationAdapter implements Adapter {
    private config: OptimizationOptions;

    constructor(config: OptimizationOptions) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const existingConfig = webpackConfig.optimization || {};

        webpackConfig.optimization = deepmerge<OptimizationOptions>(
            existingConfig,
            this.config,
            {
                arrayMerge: (_destinationArray, sourceArray) => sourceArray,
            }
        );

        next();
    }
}
