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

        if (builderConfig.sourceMap) {
            webpackConfig.devtool = builderConfig.env === Environment.Production ? 'source-map' : 'eval-source-map';
        }

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
