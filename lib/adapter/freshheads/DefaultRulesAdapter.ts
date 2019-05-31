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
import DefaultESLintRuleAdapter, {
    Config as JavascriptLintConfig,
    DEFAULT_CONFIG as DEFAULT_JAVASCRIPT_LINTING_CONFIG
} from './DefaultESLintRuleAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    files: EnabledConfig & FilesConfig;
    sass: EnabledConfig & SassConfig;
    css: EnabledConfig & CssConfig;
    javascript: EnabledConfig & JavascriptConfig;
    javascriptLinting: EnabledConfig & JavascriptLintConfig;
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
    javascriptLinting: {
        enabled: true,
        ...DEFAULT_JAVASCRIPT_LINTING_CONFIG
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
            const DefaultFilesRuleAdapter = require('./DefaultFilesRuleAdapter');

            builder.add(new DefaultFilesRuleAdapter.default(this.config.files));
        }

        if (this.config.sass.enabled) {
            const DefaultSassRuleAdapter = require('./DefaultSassRuleAdapter');

            builder.add(new DefaultSassRuleAdapter.default(this.config.sass));
        }

        if (this.config.css.enabled) {
            const DefaultCssRuleAdapter = require('./DefaultCssRuleAdapter');

            builder.add(new DefaultCssRuleAdapter.default(this.config.css));
        }

        if (this.config.javascript.enabled) {
            const DefaultJavascriptRuleAdapter = require('./DefaultJavascriptRuleAdapter');

            builder.add(new DefaultJavascriptRuleAdapter.default(this.config.javascript));
        }

        if (this.config.javascriptLinting.enabled) {
            const DefaultESLintRuleAdapter = require('./DefaultESLintRuleAdapter');

            builder.add(new DefaultESLintRuleAdapter.default(this.config.javascriptLinting));
        }

        if (this.config.typescript.enabled) {
            const DefaultTypescriptRuleAdapter = require('./DefaultTypescriptRuleAdapter');

            builder.add(new DefaultTypescriptRuleAdapter.default(this.config.typescript));
        }

        if (this.config.typescriptLinting.enabled) {
            const DefaultTSLintRuleAdapter = require('./DefaultTSLintRuleAdapter');

            builder.add(new DefaultTSLintRuleAdapter.default(this.config.typescriptLinting));
        }

        builder.build();

        next();
    }
}
