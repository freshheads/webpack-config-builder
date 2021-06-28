import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

export type TargetType = Configuration['target'];

export default class TargetAdapter implements Adapter {
    private target: TargetType;

    constructor(target: TargetType) {
        this.target = target;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherEntryIsSet(webpackConfig);

        webpackConfig.target = this.target;

        next();
    }

    private validateNoOtherEntryIsSet(webpackConfig: Configuration) {
        if (webpackConfig.target) {
            warn(
                'A webpack target is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
