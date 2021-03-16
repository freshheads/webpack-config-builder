import { Adapter, NextCallback } from '../Adapter';
import { Configuration, ResolveOptions } from 'webpack';
import Builder, { BuilderConfig, Environment } from '../../Builder';
import LoadReferencedFilesAdapter, {
    Config as LoadReferencedFilesConfig,
    DEFAULT_CONFIG as DEFAULT_FILES_CONFIG,
} from './LoadReferencedFilesAdapter';
import JavascriptAdapter, {
    Config as JavascriptConfig,
    DEFAULT_CONFIG as DEFAULT_JAVASCRIPT_CONFIG,
} from './JavascriptAdapter';
import CssAdapter, {
    Config as CssConfig,
    DEFAULT_CONFIG as DEFAULT_CSS_CONFIG,
} from './CssAdapter';
import WriteBuildStatsToFileAdapter from './WriteBuildStatsToFileAdapter';
import DefineEnvironmentVariablesAdapter from './DefineEnvironmentVariablesAdapter';
import CopyFilesToBuildDirAdapter, {
    Config as CopyFilesConfig,
    DEFAULT_CONFIG as DEFAULT_COPY_FILES_CONFIG,
} from './CopyFilesToBuildDirAdapter';
import SourcemapAdapter from './SourcemapAdapter';
import TargetAdapter from '../TargetAdapter';
import OptimizationAdapter from '../OptimizationAdapter';
import ResolveAdapter, {
    DEFAULT_CONFIG as DEFAULT_RESOLVE_CONFIG,
} from './ResolveAdapter';
import ModeAdapter from '../ModeAdapter';
import WatchOptionsAdapter from './WatchOptionsAdapter';
import { RecursivePartial } from '../../utility/types';
import MinimizationAdapter from './MinimizationAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    resolve: ResolveOptions;
    loadReferencedFiles: EnabledConfig & LoadReferencedFilesConfig;
    css: EnabledConfig & CssConfig;
    javascript: EnabledConfig & JavascriptConfig;
    copyFilesToBuildDir: EnabledConfig & CopyFilesConfig;
};

const DEFAULT_CONFIG: Config = {
    resolve: {
        ...DEFAULT_RESOLVE_CONFIG,
    },
    loadReferencedFiles: {
        enabled: true,
        ...DEFAULT_FILES_CONFIG,
    },
    css: {
        enabled: true,
        ...DEFAULT_CSS_CONFIG,
    },
    javascript: {
        enabled: true,
        ...DEFAULT_JAVASCRIPT_CONFIG,
    },
    copyFilesToBuildDir: {
        enabled: true,
        ...DEFAULT_COPY_FILES_CONFIG,
    },
};

export default class DefaultStackAdapter implements Adapter {
    private config: Config;

    constructor(config: RecursivePartial<Config> = {}) {
        // @ts-ignore cannot fix strange resolve.modules error
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const builder = new Builder(builderConfig, webpackConfig);

        const isProduction = builderConfig.env === Environment.Production;

        builder
            .add(new TargetAdapter('web'))
            .add(new ModeAdapter(isProduction ? 'production' : 'development'))
            .add(new ResolveAdapter(this.config.resolve))
            .add(new SourcemapAdapter())
            .add(new DefineEnvironmentVariablesAdapter())
            .add(new WatchOptionsAdapter())
            .add(
                new OptimizationAdapter({
                    splitChunks: {
                        automaticNameDelimiter: '-',
                    },
                })
            )
            .add(new MinimizationAdapter());

        if (this.config.loadReferencedFiles.enabled) {
            builder.add(
                new LoadReferencedFilesAdapter(this.config.loadReferencedFiles)
            );
        }

        if (this.config.copyFilesToBuildDir.enabled) {
            builder.add(
                new CopyFilesToBuildDirAdapter(this.config.copyFilesToBuildDir)
            );
        }

        if (this.config.css.enabled) {
            builder.add(new CssAdapter(this.config.css));
        }

        if (this.config.javascript.enabled) {
            builder.add(new JavascriptAdapter(this.config.javascript));
        }

        // StatsBuilder should be added after CopyFilesAdapter so all assets will be written to stats.json
        builder.add(new WriteBuildStatsToFileAdapter());

        builder.build();

        next();
    }
}
