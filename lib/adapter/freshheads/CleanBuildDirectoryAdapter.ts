import { Adapter, NextCallback } from '../Adapter';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class CleanBuildDirectoryAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        validateIfRequiredModuleIsInstalled(
            'CleanBuildDirectoryAdapter',
            'clean-webpack-plugin',
            '3.0.0'
        );

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const { CleanWebpackPlugin } = require('clean-webpack-plugin');

        const pluginInstance: WebpackPluginInstance = new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        });

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
