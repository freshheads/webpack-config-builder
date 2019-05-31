import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig, Environment } from '../../Builder';
import { Configuration } from 'webpack';
import { warn } from '../../utility/messageHelper';

export default class OutputAdapter implements Adapter {
    private path: string;
    private publicPath: string;

    constructor(path: string, publicPath: string) {
        this.path = path;
        this.publicPath = publicPath;
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        this.validateNoOtherOutputIsSet(webpackConfig);

        const isDev = builderConfig.env !== Environment.Production;

        webpackConfig.output = {
            // Absolute path to the output directory
            path: this.path,

            // Public url to the output directory in the browser
            publicPath: this.publicPath,

            // Format of output bundle (uses hashes in non-development)
            // environment to bust browser caches
            filename: isDev ? '[name].js' : '[name].[hash].js',

            // Format of output bundle chunks (when output was split up)
            chunkFilename: isDev ? '[name].[id].js' : '[name].[hash].[id].js',
        };

        next();
    }

    private validateNoOtherOutputIsSet(webpackConfig: Configuration) {
        if (webpackConfig.output) {
            warn('A webpack output is already set. If set again, it will replace the previous one.');
        }
    }
}
