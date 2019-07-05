import { Adapter, NextCallback } from './Adapter';
import { Configuration, Options } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

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
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.optimization = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.optimization) {
            warn(
                'A webpack optimization configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
