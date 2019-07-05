import { Adapter, NextCallback } from './Adapter';
import { Configuration, Options } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export default class WatchOptionsAdapter implements Adapter {
    private config: Options.WatchOptions;

    constructor(config: Options.WatchOptions) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.watchOptions = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.watchOptions) {
            warn(
                'A webpack watchOptions configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
