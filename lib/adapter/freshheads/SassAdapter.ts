import { Configuration } from 'webpack';
import deepmerge from 'deepmerge';
import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
import SassLintingAdapter, {
    Config as LintingConfig,
    DEFAULT_CONFIG as DEFAULT_LINTING_CONFIG,
} from './SassLintingAdapter';
import SassLoaderAdapter, {
    Config as LoaderConfig,
    DEFAULT_CONFIG as DEFAULT_LOADER_CONFIG,
} from './SassLoaderAdapter';
import Builder from '../../Builder';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    loader: LoaderConfig;
    linting: EnabledConfig & LintingConfig;
};

export const DEFAULT_CONFIG: Config = {
    loader: DEFAULT_LOADER_CONFIG,
    linting: {
        enabled: true,
        ...DEFAULT_LINTING_CONFIG,
    },
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

        if (this.config.linting.enabled) {
            builder.add(new SassLintingAdapter(this.config.linting));
        }

        builder.build();

        next();
    }
}
