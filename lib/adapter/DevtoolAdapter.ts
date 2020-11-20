import { Adapter, NextCallback } from './Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';
import { warn } from '../utility/messageHelper';

type DevTool = Configuration["devtool"];

export default class DevtoolAdapter implements Adapter {
    private tool: DevTool;

    constructor(tool: DevTool = 'inline-source-map') {
        this.tool = tool;
    }

    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherDevtoolIsApplied(webpackConfig);

        webpackConfig.devtool = this.tool;

        next();
    }

    private validateNoOtherDevtoolIsApplied(webpackConfig: Configuration) {
        if (webpackConfig.devtool) {
            warn(
                'A webpack devtool is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
