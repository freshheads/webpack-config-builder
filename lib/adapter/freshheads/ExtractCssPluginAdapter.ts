import { Adapter, NextCallback } from '../Adapter';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { checkPluginInstanceIsInWebpackConfig } from '../../utility/webpackConfigHelper';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class ExtractCssPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            validateIfRequiredModuleIsInstalled(
                'ExtractCssPluginAdapter',
                'mini-css-extract-plugin',
                '2.0.0'
            );
        }

        const MiniCssExtractPlugin = require('mini-css-extract-plugin');

        if (
            checkPluginInstanceIsInWebpackConfig(
                MiniCssExtractPlugin,
                webpackConfig
            )
        ) {
            next();

            return;
        }

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const isProduction = builderConfig.env === Environment.Production;

        const plugin: WebpackPluginInstance = new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
        });

        webpackConfig.plugins.push(plugin);

        next();
    }
}
