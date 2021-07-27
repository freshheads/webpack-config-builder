import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration } from 'webpack';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class JavascriptJQueryAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            validateIfRequiredModuleIsInstalled(
                'JavascriptJQueryAdapter',
                'jquery',
                '3.5.1'
            );
        }

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const ProvidePlugin = require('webpack').ProvidePlugin;

        webpackConfig.plugins.push(
            new ProvidePlugin({
                jQuery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
            })
        );

        next();
    }
}
