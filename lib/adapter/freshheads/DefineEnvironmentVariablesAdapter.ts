import { Adapter, NextCallback } from '../Adapter';
import { DefinePlugin, Configuration, WebpackPluginInstance } from 'webpack';
import { BuilderConfig } from '../../Builder';

export default class DefineEnvironmentVariablesAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const pluginInstance: WebpackPluginInstance = new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(builderConfig.env),
        });

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
