import { Adapter, NextCallback } from '../Adapter';
import { Plugin, Configuration } from 'webpack';
import path from 'path';
import StylelintBarePlugin from 'stylelint-bare-webpack-plugin';
import { BuilderConfig, Environment } from '../../Builder';
import { checkIfModuleIsInstalled } from '../../utility/moduleHelper';
import { warn } from '../../utility/messageHelper';

export type Config = {
    rcPath: string;
};

export const DEFAULT_CONFIG = {
    rcPath: path.resolve(process.cwd(), '.stylelintrc'),
};

export default class DefaultStylelintPluginAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = {
            ...config,
            ...DEFAULT_CONFIG,
        };
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateAdjustmentIsRelevantForCurrentEnvironment(builderConfig);
        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        const cwd = process.cwd();

        const plugin: Plugin = new StylelintBarePlugin({
            configFile: this.config.rcPath,
            files: path.resolve(cwd, 'src/scss/**/*.s?(c|a)ss'),
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

    private validateAdjustmentIsRelevantForCurrentEnvironment(
        builderConfig: BuilderConfig
    ) {
        if (builderConfig.env === Environment.Production) {
            warn('Application of this adapter does not make sense in a production context');
        }
    }
}
