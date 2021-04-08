import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig, Environment } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class WriteBuildStatsToFileAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        if (builderConfig.env === Environment.Dev) {
            validateIfRequiredModuleIsInstalled(
                'WriteBuildStatsToFileAdapter',
                'webpack-stats-plugin',
                '1.0.0'
            );
        }

        const { StatsWriterPlugin } = require('webpack-stats-plugin');

        const plugin = new StatsWriterPlugin({
            fields: ['hash', 'assetsByChunkName', 'assets'],
        });

        if (typeof webpackConfig.plugins === 'undefined') {
            webpackConfig.plugins = [];
        }

        webpackConfig.plugins.push(plugin);

        next();
    }
}
