import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig } from '../../Builder';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default class DefaultCleanPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const pluginInstance: Plugin = new CleanWebpackPlugin();

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
