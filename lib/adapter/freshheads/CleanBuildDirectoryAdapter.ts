import { Adapter, NextCallback } from '../Adapter';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

// Internal types have issues with webpack 5 so we are skiping this adapter while in beta
// this plugin will be obsolete as they are integrating it in webpack: https://github.com/webpack/webpack/issues/12221
// at that point this adapter can be changed to use webpack clean implementation
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
