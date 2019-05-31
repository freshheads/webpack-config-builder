import { Output, Configuration } from 'webpack';
import { Adapter, NextCallback } from './Adapter';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export default class OutputAdapter implements Adapter {
    private config: Output;

    constructor(config: Output) {
        this.config = config;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherOutputIsSet(webpackConfig);

        webpackConfig.output = this.config;

        next();
    }

    private validateNoOtherOutputIsSet(webpackConfig: Configuration) {
        if (webpackConfig.output) {
            warn('A webpack output is already set. If set again, it will replace the previous one.');
        }
    }
}
