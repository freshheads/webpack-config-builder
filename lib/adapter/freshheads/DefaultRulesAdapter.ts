import { Adapter, NextCallback } from '../Adapter';
import { Configuration } from 'webpack';
import Builder, { BuilderConfig } from '../../Builder';
import DefaultSassRuleAdapter, {
    Config as SassConfig,
    DEFAULT_CONFIG as DEFAULT_SASS_CONFIG,
} from './DefaultSassRuleAdapter';
import DefaultFilesRuleAdapter, {
    Config as FilesConfig,
    DEFAULT_CONFIG as DEFAULT_FILES_CONFIG,
} from './DefaultFilesRuleAdapter';
import DefaultJavascriptRuleAdapter, {
    Config as JavascriptConfig,
    DEFAULT_CONFIG as DEFAULT_JAVASCRIPT_CONFIG,
} from './DefaultJavascriptRuleAdapter';
import DefaultTypescriptRuleAdapter, {
    Config as TypescriptConfig,
    DEFAULT_CONFIG as DEFAULT_TYPESCRIPT_CONFIG,
} from './DefaultTypescriptRuleAdapter';
import DefaultCssRuleAdapter, {
    Config as CssConfig,
    DEFAULT_CONFIG as DEFAULT_CSS_CONFIG,
} from './DefaultCssRuleAdapter';
import DefaultTSLintRuleAdapter, {
    Config as TypescriptLintConfig,
    DEFAULT_CONFIG as DEFAULT_TYPESCRIPT_LINTING_CONFIG,
} from './DefaultTSLintRuleAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    files: EnabledConfig & FilesConfig;
    sass: EnabledConfig & SassConfig;
    css: EnabledConfig & CssConfig;
    javascript: EnabledConfig & JavascriptConfig;
    typescript: EnabledConfig & TypescriptConfig;
    typescriptLinting: EnabledConfig & TypescriptLintConfig;
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
    typescriptLinting: {
        enabled: false,
        ...DEFAULT_TYPESCRIPT_LINTING_CONFIG,
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
            builder.add(new DefaultFilesRuleAdapter(this.config.files));
        }

        if (this.config.sass.enabled) {
            builder.add(new DefaultSassRuleAdapter(this.config.sass));
        }

        if (this.config.css.enabled) {
            builder.add(new DefaultCssRuleAdapter(this.config.css));
        }

        if (this.config.javascript.enabled) {
            builder.add(
                new DefaultJavascriptRuleAdapter(this.config.javascript)
            );
        }

        if (this.config.typescript.enabled) {
            builder.add(
                new DefaultTypescriptRuleAdapter(this.config.typescript)
            );
        }

        if (this.config.typescriptLinting.enabled) {
            builder.add(
                new DefaultTSLintRuleAdapter(this.config.typescriptLinting)
            );
        }

        builder.build();

        next();
    }
}
