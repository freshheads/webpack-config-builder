import { Adapter, NextCallback } from './Adapter';
import { Configuration, Entry } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export default class EntryAdapter implements Adapter {
    private entry: Entry;

    constructor(entry: Entry) {
        this.entry = entry;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.entry = this.entry;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.entry) {
            warn(
                'A webpack entry is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
