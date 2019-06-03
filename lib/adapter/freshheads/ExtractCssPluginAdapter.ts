import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { checkPluginInstanceIsInWebpackConfig } from '../../utility/webpackConfigHelper';

export default class ExtractCssPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
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

        const plugin: Plugin = new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: '[name].css',
        });

        webpackConfig.plugins.push(plugin);

        next();
    }
}
