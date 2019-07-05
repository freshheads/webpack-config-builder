import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

// @todo cannot extract this from `@types/webpack`. Should be able to do so. Maybe add a PR there and update it here afterwards
export type TargetType =
    | 'web'
    | 'webworker'
    | 'node'
    | 'async-node'
    | 'node-webkit'
    | 'atom'
    | 'electron'
    | 'electron-renderer'
    | 'electron-main'
    | ((compiler?: any) => void);

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
