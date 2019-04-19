import { Adapter, NextCallback } from './Adapter';
import { Configuration, WatchOptions } from 'webpack';
import { BuilderConfig } from '../Builder';

export default class WatchOptionsAdapter implements Adapter {
    private config: WatchOptions;

    constructor(config: WatchOptions) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.watchOptions = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.watchOptions) {
            throw new Error(
                'A webpack watchOptions configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
