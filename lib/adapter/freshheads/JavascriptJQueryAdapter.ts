import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
import { Configuration } from 'webpack';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';

export default class JavascriptJQueryAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateRequiredModulesAreInstalled();

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

    private validateRequiredModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('jquery')) {
            throw new Error(
                "The 'jquery' module needs to be installed for webpack to be able to provide it"
            );
        }
    }
}
