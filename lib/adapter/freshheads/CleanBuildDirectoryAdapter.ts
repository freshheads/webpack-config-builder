import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig } from '../../Builder';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default class CleanBuildDirectoryAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const pluginInstance: Plugin = new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        });

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
