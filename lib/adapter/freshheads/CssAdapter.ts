import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import deepmerge from 'deepmerge';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { iterateObjectValues } from '../../utility/iterationHelper';
import SassLoaderAdapter, {
    Config as SassConfig,
    DEFAULT_CONFIG as DEFAULT_SASS_CONFIG,
} from './SassLoaderAdapter';
import { Builder } from '../../index';

export type Config = {
    cssLoaderOptions: { [key: string]: any };
    sass: SassConfig;
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
    },
    sass: DEFAULT_SASS_CONFIG,
};

export default class CssAdapter implements Adapter {
    private config: Config;

    constructor(config: Partial<Config> = {}) {
        this.config = deepmerge<Config>(DEFAULT_CONFIG, config);
    }

    public apply(
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) {
        const builder = new Builder(builderConfig, webpackConfig);

        if (builderConfig.env === Environment.Dev) {
            this.validateAllRequiredModulesAreInstalled();
        }

        // add extract css before rules because extract plugin is also required as loader
        builder.add(new ExtractCssPluginAdapter());

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        if (typeof webpackConfig.module.rules === 'undefined') {
            webpackConfig.module.rules = [];
        }

        const rule: RuleSetRule = {
            test: this.config.sass.enabled ? /\.s?css$/ : /\.css$/,
            use: [
                {
                    loader: require('mini-css-extract-plugin').loader,
                },
                {
                    loader: 'css-loader',
                    options: this.config.cssLoaderOptions,
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: () => {
                            // Adding custom plugins / options can be done at application level by adding a postcss.config.js
                            // You can not override settings for the plugins loaded below because loader options are leading.
                            // @see https://github.com/webpack-contrib/postcss-loader#config

                            // Autoprefixer requires settings to work with CSS grid in IE.
                            // You can also trigger this by setting a comment
                            // @see https://github.com/postcss/autoprefixer#grid-autoplacement-support-in-ie
                            const autoprefixer = require('autoprefixer');

                            const plugins = [
                                autoprefixer({
                                    remove: false,
                                }),
                            ];

                            return {
                                sourceMap: true,
                                plugins: plugins,
                            };
                        },
                    },
                },
            ],
        };

        webpackConfig.module.rules.push(rule);

        if (this.config.sass.enabled) {
            builder.add(new SassLoaderAdapter(this.config.sass));
        }

        builder.build();

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            autoprefixer: '10.0.0',
            'css-loader': '5.0.0',
            postcss: '8.0.0',
            'postcss-loader': '5.0.0',
        };

        iterateObjectValues<string>(requiredModules, (minVersion, module) => {
            validateIfRequiredModuleIsInstalled(
                'CssAdapter',
                module,
                minVersion
            );
        });
    }
}
