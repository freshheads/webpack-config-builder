import { Adapter, NextCallback } from './Adapter';
import { Configuration, Options } from 'webpack';
import { BuilderConfig } from '../Builder';
import deepmerge = require('deepmerge');

export default class OptimizationAdapter implements Adapter {
    private config: Options.Optimization;

    constructor(config: Options.Optimization) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const existingConfig = webpackConfig.optimization || {};

        webpackConfig.optimization = deepmerge<Options.Optimization>(
            existingConfig,
            this.config,
            {
                arrayMerge: (_destinationArray, sourceArray) => sourceArray,
            }
        );

        next();
    }
}
