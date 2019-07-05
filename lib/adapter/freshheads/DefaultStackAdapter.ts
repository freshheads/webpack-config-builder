import { Adapter, NextCallback } from '../Adapter';
import { Configuration, Resolve } from 'webpack';
import Builder, { BuilderConfig, Environment } from '../../Builder';
import SassAdapter, {
    Config as SassConfig,
    DEFAULT_CONFIG as DEFAULT_SASS_CONFIG,
} from './SassAdapter';
import LoadReferencedFilesAdapter, {
    Config as LoadReferencedFilesConfig,
    DEFAULT_CONFIG as DEFAULT_FILES_CONFIG,
} from './LoadReferencedFilesAdapter';
import JavascriptAdapter, {
    Config as JavascriptConfig,
    DEFAULT_CONFIG as DEFAULT_JAVASCRIPT_CONFIG,
} from './JavascriptAdapter';
import TypescriptAdapter, {
    Config as TypescriptConfig,
    DEFAULT_CONFIG as DEFAULT_TYPESCRIPT_CONFIG,
} from './TypescriptAdapter';
import CssAdapter, {
    Config as CssConfig,
    DEFAULT_CONFIG as DEFAULT_CSS_CONFIG,
} from './CssAdapter';
import CleanBuildDirectoryAdapter from './CleanBuildDirectoryAdapter';
import WriteBuildStatsToFileAdapter from './WriteBuildStatsToFileAdapter';
import DefineEnvironmentVariablesAdapter from './DefineEnvironmentVariablesAdapter';
import CopyFilesToBuildDirAdapter, {
    Config as CopyFilesConfig,
    DEFAULT_CONFIG as DEFAULT_COPY_FILES_CONFIG,
} from './CopyFilesToBuildDirAdapter';
import SourcemapAdapter from './SourcemapAdapter';
import TargetAdapter from '../TargetAdapter';
import OptimizationAdapter from './OptimizationAdapter';
import ResolveAdapter, {
    DEFAULT_CONFIG as DEFAULT_RESOLVE_CONFIG,
} from './ResolveAdapter';
import ModeAdapter from '../ModeAdapter';
import WatchOptionsAdapter from './WatchOptionsAdapter';
import { RecursivePartial } from '../../utility/types';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    resolve: Resolve;
    loadReferencedFiles: EnabledConfig & LoadReferencedFilesConfig;
    sass: EnabledConfig & SassConfig;
    css: EnabledConfig & CssConfig;
    javascript: EnabledConfig & JavascriptConfig;
    typescript: EnabledConfig & TypescriptConfig;
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
    sass: {
        enabled: true,
        ...DEFAULT_SASS_CONFIG,
    },
    css: {
        enabled: true,
        ...DEFAULT_CSS_CONFIG,
    },
    javascript: {
        enabled: true,
        ...DEFAULT_JAVASCRIPT_CONFIG,
    },
    typescript: {
        enabled: false,
        ...DEFAULT_TYPESCRIPT_CONFIG,
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
            .add(new CleanBuildDirectoryAdapter())
            .add(new WriteBuildStatsToFileAdapter())
            .add(new SourcemapAdapter())
            .add(new DefineEnvironmentVariablesAdapter())
            .add(new WatchOptionsAdapter())
            .add(new OptimizationAdapter());

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

        if (this.config.sass.enabled) {
            builder.add(new SassAdapter(this.config.sass));
        }

        if (this.config.css.enabled) {
            builder.add(new CssAdapter(this.config.css));
        }

        if (this.config.javascript.enabled) {
            builder.add(new JavascriptAdapter(this.config.javascript));
        }

        if (this.config.typescript.enabled) {
            builder.add(new TypescriptAdapter(this.config.typescript));
        }

        builder.build();

        next();
    }
}
