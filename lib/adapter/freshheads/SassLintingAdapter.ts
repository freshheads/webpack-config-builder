import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration, Plugin } from 'webpack';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import path from 'path';

export type Config = {
    configurationPath: string;
};

export const DEFAULT_CONFIG: Config = {
    configurationPath: path.resolve(process.cwd(), '.stylelintrc'),
};

export default class SassLintingAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Production) {
            next();

            return;
        }

        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

        const plugin: Plugin = new StylelintBarePlugin({
            configFile: this.config.configurationPath,
            files: path.resolve(process.cwd(), 'src/scss/**/*.s?(c|a)ss'),
        });

        webpackConfig.plugins.push(plugin);

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        if (!checkIfModuleIsInstalled('stylelint')) {
            throw new Error(
                "Expecting module 'stylelint' to be installed as it is required for this adapter to work"
            );
        }
    }
}
