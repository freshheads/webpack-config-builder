import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Plugin } from 'webpack';
import { BuilderConfig } from '../../Builder';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

export type Config = {
    images: boolean;
};

export const DEFAULT_CONFIG: Config = {
    images: false,
};

export default class DefaultCopyPluginAdapter implements Adapter {
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
        const patterns = [];
        const isProduction = builderConfig.env === 'production';

        if (this.config.images) {
            patterns.push({
                from: {
                    glob: path.resolve(process.cwd(), 'src/images/**/*'),
                },
                context: process.cwd(),

                // @todo check why thie prefix is app/ below, and if we can change this to something else
                to: isProduction
                    ? 'app/[path][name].[hash].[ext]'
                    : 'app/[path][name].[ext]',
                toType: 'template',
            });
        }

        if (patterns.length > 0) {
            if (typeof webpackConfig.plugins === 'undefined') {
                webpackConfig.plugins = [];
            }

            const options = {
                copyUnmodified: true,
            };

            const pluginInstance: Plugin = new CopyWebpackPlugin(
                // @ts-ignore -> mutes trange error about 'toType' not being allowd -> @todo fix this some way?
                patterns,
                options
            );

            webpackConfig.plugins.push(pluginInstance);
        }

        next();
    }
}
