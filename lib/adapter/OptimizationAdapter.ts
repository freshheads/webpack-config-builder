import { Adapter, NextCallback } from './Adapter';
import { Configuration, Options } from 'webpack';
import { BuilderConfig } from '../Builder';

export default class OptimizationAdapter implements Adapter {
    private config: Options.Optimization;

    constructor(config: Options.Optimization) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.optimization = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.optimization) {
            throw new Error(
                'A webpack optimization configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
