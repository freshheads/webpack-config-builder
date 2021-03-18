import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { OptimizationAdapter } from '../..';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class MinimizationAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        validateIfRequiredModuleIsInstalled(
            'MinimizationAdapter',
            'css-minimizer-webpack-plugin',
            '1.2.0'
        );

        // Minimizer will only be run in production mode so we don't need to check it
        const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

        // For webpack@5 you can use the `...` syntax to extend existing minimizer (i.e. `terser-webpack-plugin`)
        // So Javascript will be minimized by default
        new OptimizationAdapter({
            minimizer: [
                `...`,
                new CssMinimizerPlugin({
                    sourceMap: true,
                }),
            ],
        }).apply(webpackConfig, builderConfig, next);
    }
}
