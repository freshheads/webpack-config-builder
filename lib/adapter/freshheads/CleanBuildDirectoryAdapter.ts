import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class CleanBuildDirectoryAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            validateIfRequiredModuleIsInstalled(
                'CleanBuildDirectoryAdapter',
                'clean-webpack-plugin',
                '2.0.1'
            );
        }

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const CleanWebpackPlugin = require('clean-webpack-plugin');

        const pluginInstance: Plugin = new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        });

        webpackConfig.plugins.push(pluginInstance);

        next();
    }
}
