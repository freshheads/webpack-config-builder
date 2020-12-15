import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export type Mode = Configuration['mode'];

export default class ModeAdapter implements Adapter {
    private mode: Mode;

    constructor(mode: Mode) {
        this.mode = mode;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.mode = this.mode;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.mode) {
            warn(
                'A webpack mode is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
