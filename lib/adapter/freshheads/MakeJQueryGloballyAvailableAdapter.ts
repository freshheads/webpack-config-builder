import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin, ProvidePlugin } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';

export default class MakeJQueryGloballyAvailableAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const plugin: Plugin = new ProvidePlugin({
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        });

        webpackConfig.plugins.push(plugin);

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('jquery')) {
            throw new Error(
                "The 'jquery' module needs to be installed for webpack to be able to provide it"
            );
        }
    }
}
