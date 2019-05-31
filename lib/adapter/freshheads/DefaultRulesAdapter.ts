import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import Builder, { BuilderConfig } from '../../Builder';
import SassAdapter, {
    Config as SassConfig,
    DEFAULT_CONFIG as DEFAULT_SASS_CONFIG,
} from './SassAdapter';
import LoadReferencedFilesAdapter, {
    Config as FilesConfig,
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

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    files: EnabledConfig & FilesConfig;
    sass: EnabledConfig & SassConfig;
    css: EnabledConfig & CssConfig;
    javascript: EnabledConfig & JavascriptConfig;
    typescript: EnabledConfig & TypescriptConfig;
};

const DEFAULT_CONFIG: Config = {
    files: {
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
};

export default class DefaultRulesAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
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

        if (this.config.files.enabled) {
            builder.add(new LoadReferencedFilesAdapter(this.config.files));
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
