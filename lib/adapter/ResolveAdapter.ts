import { Adapter, NextCallback } from './Adapter';
import { Resolve, Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export default class ResolveAdapter implements Adapter {
    private config: Resolve;

    constructor(config: Resolve) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.resolve = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.resolve) {
            warn(
                'A webpack resolve configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
