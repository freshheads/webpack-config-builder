import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig } from '../../Builder';

/**
 * This adapter will only make webpack check the typescript extensions and validate if babel plugin is installed
 * Babel will be able to strip typescript and transform to javascript
 * When you want to add type checking this should be done outside of webpack
 */
export default class TypescriptAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        _builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAllRequiredModulesAreInstalled();

        this.ensureTypescriptFilesAreResolvedRegularJavascriptFiles(
            webpackConfig
        );

        next();
    }

    private ensureTypescriptFilesAreResolvedRegularJavascriptFiles(
        webpackConfig: Configuration
    ) {
        if (typeof webpackConfig.resolve === 'undefined') {
            webpackConfig.resolve = {};
        }

        if (typeof webpackConfig.resolve.extensions === 'undefined') {
            webpackConfig.resolve.extensions = [];
        }

        const extensionsToAdd = ['.tsx', '.ts'];

        for (let i = 0, l = extensionsToAdd.length; i < l; i++) {
            const extensionToAdd = extensionsToAdd[i];

            webpackConfig.resolve.extensions.unshift(extensionToAdd);
        }
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules = ['babel-loader', '@babel/preset-typescript'];

        requiredModules.forEach(module => {
            if (!checkIfModuleIsInstalled(module)) {
                throw new Error(
                    `The '${module}' needs to be installed for this adapter to work`
                );
            }
        });
    }
}
