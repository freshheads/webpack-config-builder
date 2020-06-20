import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { warn } from '../../utility/messageHelper';

export default class SourcemapAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherDevtoolIsApplied(webpackConfig);

        const isDev = builderConfig.env !== Environment.Production;

        webpackConfig.devtool = isDev ? 'inline-source-map' : 'source-map';

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
