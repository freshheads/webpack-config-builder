import { Adapter, NextCallback } from './Adapter';
import { Configuration, ModuleOptions } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export default class ModuleAdapter implements Adapter {
    private config: ModuleOptions;

    constructor(config: ModuleOptions) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.module = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.module) {
            warn(
                'A webpack module configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
