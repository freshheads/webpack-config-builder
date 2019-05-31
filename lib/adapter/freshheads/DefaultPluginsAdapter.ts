import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import Builder, { BuilderConfig, Environment } from '../../Builder';
import {
    Config as CopyConfig,
    DEFAULT_CONFIG as DEFAULT_COPY_CONFIG,
} from './DefaultCopyPluginAdapter';
import {
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
            const DefaultCleanPluginAdapter = require('./DefaultCleanPluginAdapter');

            builder.add(new DefaultCleanPluginAdapter.default());
        }

        if (this.config.statsWriter.enabled) {
            const DefaultStatsWriterPluginAdapter = require('./DefaultStatsWriterPluginAdapter');

            builder.add(new DefaultStatsWriterPluginAdapter.default());
        }

        if (this.config.define.enabled) {
            const DefaultDefinePluginAdapter = require('./DefaultDefinePluginAdapter');

            builder.add(new DefaultDefinePluginAdapter.default());
        }

        if (this.config.provide.enabled) {
            const DefaultProvidePluginAdapter = require('./DefaultProvidePluginAdapter');

            builder.add(new DefaultProvidePluginAdapter.default());
        }

        if (this.config.copy.enabled) {
            const DefaultCopyPluginAdapter = require('./DefaultCopyPluginAdapter');

            builder.add(new DefaultCopyPluginAdapter.default(this.config.copy));
        }

        const isProduction = builderConfig.env === Environment.Production;

        if (isProduction) {
            if (this.config.uglify.enabled) {
                const DefaultUglifyPluginAdapter = require('./DefaultUglifyPluginAdapter');

                builder.add(new DefaultUglifyPluginAdapter.default());
            }
        } else {
            if (this.config.stylelint.enabled) {
                const DefaultStylelintPluginAdapter = require('./DefaultStylelintPluginAdapter');

                builder.add(new DefaultStylelintPluginAdapter.default(this.config.stylelint));
            }
        }

        builder.build();

        next();
    }
}
