import { Adapter, NextCallback } from './Adapter';
import { Configuration, Options } from 'webpack';
import { BuilderConfig } from '../Builder';

export default class DevtoolAdapter implements Adapter {
    private tool: Options.Devtool;

    constructor(tool: Options.Devtool = 'inline-source-map') {
        this.tool = tool;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherDevtoolIsApplied(webpackConfig);

        webpackConfig.devtool = this.tool;

        next();
    }

    private validateNoOtherDevtoolIsApplied(webpackConfig: Configuration) {
        if (webpackConfig.devtool) {
            throw new Error(
                'A webpack devtool is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
