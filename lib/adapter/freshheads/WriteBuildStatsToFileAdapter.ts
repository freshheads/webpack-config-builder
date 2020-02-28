import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';

export default class WriteBuildStatsToFileAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        _buildConfig: BuilderConfig,
        next: NextCallback
    ) {
        validateIfRequiredModuleIsInstalled(
            'WriteBuildStatsToFileAdapter',
            'webpack-stats-plugin',
            '0.3.1'
        );

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
