import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import Builder, { BuilderConfig, Environment } from '../../Builder';
import DefaultCleanPluginAdapter from './DefaultCleanPluginAdapter';
import DefaultStatsWriterPluginAdapter from './DefaultStatsWriterPluginAdapter';
import DefaultDefinePluginAdapter from './DefaultDefinePluginAdapter';
import DefaultProvidePluginAdapter from './DefaultProvidePluginAdapter';
import DefaultCopyPluginAdapter, {
    Config as CopyConfig,
    DEFAULT_CONFIG as DEFAULT_COPY_CONFIG,
} from './DefaultCopyPluginAdapter';
import DefaultUglifyPluginAdapter from './DefaultUglifyPluginAdapter';
import DefaultStylelintPluginAdapter, {
    Config as StylelintConfig,
    DEFAULT_CONFIG as DEFAULT_STYLELINT_CONFIG,
} from './DefaultStylelintPluginAdapter';

type EnabledConfig = {
    enabled: true;
};

export type Config = {
    clean: EnabledConfig;
    statsWriter: EnabledConfig;
    define: EnabledConfig;
    provide: EnabledConfig;
    copy: EnabledConfig & CopyConfig;
    uglify: EnabledConfig;
    stylelint: EnabledConfig & StylelintConfig;
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
    uglify: {
        enabled: true,
    },
    stylelint: {
        enabled: true,
        ...DEFAULT_STYLELINT_CONFIG,
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

        if (this.config.clean.enabled) {
            builder.add(new DefaultCleanPluginAdapter());
        }

        if (this.config.statsWriter.enabled) {
            builder.add(new DefaultStatsWriterPluginAdapter());
        }

        if (this.config.define.enabled) {
            builder.add(new DefaultDefinePluginAdapter());
        }

        if (this.config.provide.enabled) {
            builder.add(new DefaultProvidePluginAdapter());
        }

        if (this.config.copy.enabled) {
            builder.add(new DefaultCopyPluginAdapter(this.config.copy));
        }

        const isProduction = builderConfig.env === Environment.Production;

        if (isProduction) {
            if (this.config.uglify.enabled) {
                builder.add(new DefaultUglifyPluginAdapter());
            }
        } else {
            if (this.config.stylelint.enabled) {
                builder.add(
                    new DefaultStylelintPluginAdapter(this.config.stylelint)
                );
            }
        }

        builder.build();

        next();
    }
}
