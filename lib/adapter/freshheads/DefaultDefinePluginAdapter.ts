import { Adapter, NextCallback } from '../Adapter';
import { DefinePlugin, Configuration, Plugin } from 'webpack';
import { BuilderConfig } from '../../Builder';

export default class DefaultDefinePluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const pluginInstance: Plugin = new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(builderConfig.env),
        });

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
