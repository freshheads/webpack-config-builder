import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import { BuilderConfig } from '../../Builder';

export default class DefaultStatsWriterPluginAdapter implements Adapter {
    public apply(
        webpackConfig: Configuration,
        buildConfig: BuilderConfig,
        next: NextCallback
    ) {
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
