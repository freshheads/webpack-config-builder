import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { OptimizationAdapter } from '../..';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class JavascriptMinimizationAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        validateIfRequiredModuleIsInstalled(
            'JavascriptMinimizationAdapter',
            'terser-webpack-plugin',
            '2.2.1'
        );

        if (builderConfig.env !== Environment.Production) {
            next();

            return;
        }

        // By default webpack has Terser 1.x as production minimizer
        // We replace this with a newer version and add additional settings
        const TerserPlugin = require('terser-webpack-plugin');

        new OptimizationAdapter({
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    sourceMap: true,
                }),
            ],
        }).apply(webpackConfig, builderConfig, next);
    }
}
