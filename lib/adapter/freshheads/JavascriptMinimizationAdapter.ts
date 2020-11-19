import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { OptimizationAdapter } from '../..';

export default class JavascriptMinimizationAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env !== Environment.Production) {
            next();

            return;
        }

        // Webpack 5.x comes with terser-webpack-plugin so we should be able to require it
        const TerserPlugin = require('terser-webpack-plugin');

        new OptimizationAdapter({
            minimize: true,
            minimizer: [
                new TerserPlugin(),
            ],
        }).apply(webpackConfig, builderConfig, next);
    }
}
