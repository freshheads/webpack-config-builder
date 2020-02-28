import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig } from '../../Builder';
import path from 'path';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

// @todo use types from @types/copy-webpack-plugin instead (cannot export CopyPattern right now)
type CopyPattern = {
    from: {
        glob: string;
    };
    context?: string;
    to?: string;
    toType?: 'file' | 'dir' | 'template';
};

export type Config = {
    images: boolean;
    additionalPatterns: CopyPattern[];
};

export const DEFAULT_CONFIG: Config = {
    images: false,
    additionalPatterns: [],
};

export default class CopyFilesToBuildDirAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config>) {
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
        const patterns: CopyPattern[] = [];

        if (this.config.images) {
            patterns.push({
                from: {
                    glob: '**/*',
                },
                context: path.resolve(process.cwd(), 'src/images/'), // context reference for path placeholder and from glob
                to: 'images/[path][name].[contenthash].[ext]', // contenthash is required even on dev env as required by webpack_assets extension
            });
        }

        patterns.push(...this.config.additionalPatterns);

        if (patterns.length > 0) {
            validateIfRequiredModuleIsInstalled(
                'CopyFilesToBuildDirAdapter',
                'copy-webpack-plugin',
                '5.0.2'
            );

            const CopyWebpackPlugin = require('copy-webpack-plugin');

            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            const options = {
                copyUnmodified: true,
            };

            const pluginInstance: Plugin = new CopyWebpackPlugin(
                // @ts-ignore -> mutes strange error about 'toType' not being allowed -> @todo fix this somehow?
                patterns,
                options
            );

            webpackConfig.plugins.push(pluginInstance);
        }

        next();
    }
}
