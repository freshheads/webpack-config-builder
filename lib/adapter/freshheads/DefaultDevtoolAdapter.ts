import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';

export default class DefaultDevtoolAdapter implements Adapter {
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
            throw new Error(
                'A webpack devtool is already set. If set again, it will replace the previous one.'
            );
        }
    }
}
