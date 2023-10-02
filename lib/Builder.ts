import { Adapter } from './adapter/Adapter';
import { Configuration } from 'webpack';

// @todo make generic, to be able to use more enviroments
export enum Environment {
    Dev = 'development',
    Production = 'production',
}

export type BuilderConfig = {
    env: Environment;
    sourceMap: boolean;
};

const DEFAULT_BUILDER_CONFIG = {
    env: Environment.Production,
    sourceMap: true, // @todo: Make default false in next major release.
};

export default class Builder {
    private initialState: Configuration;
    private config: BuilderConfig;
    private adapters: Adapter[] = [];

    constructor(
        config: Partial<BuilderConfig> = {},
        initialState: Configuration = {}
    ) {
        this.config = {
            ...DEFAULT_BUILDER_CONFIG,
            ...config,
        };
        this.initialState = initialState;
    }

    public add(adapter: Adapter): Builder {
        this.adapters.push(adapter);

        return this;
    }

    private applyAdapter(
        webpackConfig: Configuration,
        currentAdapter: Adapter,
        currentIndex: number = 0
    ) {
        const nextIndex = currentIndex + 1;
        const nextAdapter = this.adapters[nextIndex] || null;

        currentAdapter.apply(webpackConfig, this.config, () => {
            if (nextAdapter) {
                this.applyAdapter(webpackConfig, nextAdapter, nextIndex);
            }
        });
    }

    public build(): Configuration {
        const config = this.initialState;

        if (this.adapters.length === 0) {
            return config;
        }

        this.applyAdapter(config, this.adapters[0], 0);

        return config;
    }
}
