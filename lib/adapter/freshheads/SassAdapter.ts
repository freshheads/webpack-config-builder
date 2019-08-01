import { Configuration } from 'webpack';
import deepmerge from 'deepmerge';
import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
import SassLoaderAdapter, {
    Config as LoaderConfig,
    DEFAULT_CONFIG as DEFAULT_LOADER_CONFIG,
} from './SassLoaderAdapter';
import Builder from '../../Builder';

export type Config = {
    loader: LoaderConfig;
};

export const DEFAULT_CONFIG: Config = {
    loader: DEFAULT_LOADER_CONFIG,
};

export default class SassAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config);
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const builder = new Builder(builderConfig, webpackConfig);

        builder.add(new SassLoaderAdapter(this.config.loader));

        builder.build();

        next();
    }
}
