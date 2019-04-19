import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';

// @todo webpack typescript configuration does not supply a type for this. Create a PR for to be able to re-use it.
export type Mode = 'development' | 'production' | 'none';

export default class ModeAdapter implements Adapter {
    private mode: Mode;

    constructor(mode: Mode) {
        this.mode = mode;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.mode = this.mode;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.mode) {
            throw new Error(
                'A webpack mode is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
