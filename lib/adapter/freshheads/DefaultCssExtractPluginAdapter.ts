import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default class DefaultCssExtractPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const isProduction = builderConfig.env === Environment.Production;

        const plugin: Plugin = new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: '[name].css',
        });

        webpackConfig.plugins.push(plugin);

        next();
    }
}
