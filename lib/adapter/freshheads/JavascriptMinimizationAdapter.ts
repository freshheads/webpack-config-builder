import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';

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

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const UglifyjsPlugin = require('uglifyjs-webpack-plugin');

        webpackConfig.plugins.push(
            new UglifyjsPlugin({
                sourceMap: true,
            })
        );

        next();
    }
}
