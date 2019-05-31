import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import Builder, { BuilderConfig } from '../../Builder';
import MakeJQueryGloballyAvailableAdapter from './MakeJQueryGloballyAvailableAdapter';
import CopyFilesToBuildDirAdapter, {
    Config as CopyConfig,
    DEFAULT_CONFIG as DEFAULT_COPY_CONFIG,
} from './CopyFilesToBuildDirAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    clean: EnabledConfig;
    statsWriter: EnabledConfig;
    define: EnabledConfig;
    provide: EnabledConfig;
    copy: EnabledConfig & CopyConfig;
};

const DEFAULT_CONFIG: Config = {
    clean: {
        enabled: true,
    },
    statsWriter: {
        enabled: true,
    },
    define: {
        enabled: true,
    },
    provide: {
        enabled: true,
    },
    copy: {
        enabled: true,
        ...DEFAULT_COPY_CONFIG,
    },
};

export default class DefaultPluginsAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
    }

    apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const builder = new Builder(builderConfig, webpackConfig);

        if (this.config.provide.enabled) {
            builder.add(new MakeJQueryGloballyAvailableAdapter());
        }

        if (this.config.copy.enabled) {
            builder.add(new CopyFilesToBuildDirAdapter(this.config.copy));
        }

        builder.build();

        next();
    }
}
