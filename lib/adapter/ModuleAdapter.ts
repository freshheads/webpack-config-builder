import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import webpack = require('webpack');

export default class ModuleAdapter implements Adapter {
    private config: webpack.Module;

    constructor(config: webpack.Module) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.module = this.config;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.module) {
            throw new Error(
                'A webpack module configuration is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
