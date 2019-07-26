import { Adapter, NextCallback } from '../Adapter';
import { BuilderConfig } from '../../Builder';
import { Configuration } from 'webpack';
import deepmerge from 'deepmerge';
import { Builder } from '../..';
import BabelLoaderAdapter, {
    Config as BabelLoaderConfig,
    DEFAULT_CONFIG as DEFAULT_BABEL_LOADER_CONFIG,
} from './BabelLoaderAdapter';
import JavascriptLintingAdapter, {
    Config as LintingConfig,
    DEFAULT_CONFIG as DEFAULT_LINTING_CONFIG,
} from './JavascriptLintingAdapter';
import JavascriptMinimizationAdapter from './JavascriptMinimizationAdapter';
import JavascriptJQueryAdapter from './JavascriptJQueryAdapter';
import TypescriptAdapter from './TypescriptAdapter';

type EnabledConfig = {
    enabled: boolean;
};

export type Config = {
    babelConfig: BabelLoaderConfig;
    linting: EnabledConfig & LintingConfig;
    jQuery: EnabledConfig;
    typescript: boolean;
};

export const DEFAULT_CONFIG: Config = {
    babelConfig: DEFAULT_BABEL_LOADER_CONFIG,
    linting: {
        enabled: true,
        ...DEFAULT_LINTING_CONFIG,
    },
    jQuery: {
        enabled: false,
    },
    typescript: false
};

export default class JavascriptAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config, {
            arrayMerge: (_destinationArray, sourceArray) => sourceArray,
        });
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {

        const builder = new Builder(builderConfig, webpackConfig);

        builder
            .add(new BabelLoaderAdapter(this.config.babelConfig))
            .add(new JavascriptMinimizationAdapter());

        if (this.config.typescript) {
            builder.add(new TypescriptAdapter());
        }

        if (this.config.jQuery.enabled) {
            builder.add(new JavascriptJQueryAdapter());
        }

        if (this.config.linting.enabled) {
            // @todo check how to work with typescript linter
            // @see https://github.com/typescript-eslint/typescript-eslint
            builder.add(new JavascriptLintingAdapter(this.config.linting));
        }

        builder.build();

        next();
    }
}
