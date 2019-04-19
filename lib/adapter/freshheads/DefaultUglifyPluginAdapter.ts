import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import UglifyjsPlugin from 'uglifyjs-webpack-plugin';

export default class DefaultUglifyPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAdjustmentMakesSenseForTheCurrentEnvironment(
            builderConfig
        );

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const plugin: Plugin = new UglifyjsPlugin({
            sourceMap: true,
        });

        webpackConfig.plugins.push(plugin);

        next();
    }

    private validateAdjustmentMakesSenseForTheCurrentEnvironment(
        builderConfig: BuilderConfig
    ) {
        if (builderConfig.env !== Environment.Production) {
            throw new Error(
                "This plugin doesn't make any sence for non-production environments"
            );
        }
    }
}
