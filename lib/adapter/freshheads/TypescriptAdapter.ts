import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import { iterateObjectValues } from '../../utility/iterationHelper';

/**
 * This adapter will only make webpack check the typescript extensions and validate if babel plugin is installed
 * Babel will be able to strip typescript and transform to javascript
 * When you want to add type checking this should be done outside of webpack
 */
export default class TypescriptAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            this.validateAllRequiredModulesAreInstalled();
        }

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
        const requiredModules = {
            'babel-loader': '8.1.0',
            '@babel/preset-typescript': '7.10.0',
            typescript: '3.9.0',
        };

        iterateObjectValues<string>(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'TypescriptAdapter',
                module,
                minVersion
            );
        });
    }
}
