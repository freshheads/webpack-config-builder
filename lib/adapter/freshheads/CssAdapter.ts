import { Adapter, NextCallback } from '../Adapter';
import { Configuration, RuleSetRule } from 'webpack';
import deepmerge from 'deepmerge';
import { validateIfRequiredModuleIsInstalled } from '../../utility/moduleHelper';
import { BuilderConfig, Environment } from '../../Builder';
import ExtractCssPluginAdapter from './ExtractCssPluginAdapter';
import { iterateObjectValues } from '../../utility/iterationHelper';
import { checkPluginInstanceIsInWebpackConfig } from '../../utility/webpackConfigHelper';
import SassLoaderAdapter, {
    Config as SassConfig,
    DEFAULT_CONFIG as DEFAULT_SASS_CONFIG,
} from './SassLoaderAdapter';

export type Config = {
    cssLoaderOptions: { [key: string]: any };
    sass: SassConfig;
};

export const DEFAULT_CONFIG: Config = {
    cssLoaderOptions: {
        sourceMap: true,
        modules: {
            auto: true, // enable css modules for filenames that contain .module.css
        },
    },
    sass: DEFAULT_SASS_CONFIG,
};

// @todo fix tests

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
        this.validateAllRequiredModulesAreInstalled();

        if (typeof webpackConfig.module === 'undefined') {
            webpackConfig.module = {
                rules: [],
            };
        }

        const isProduction = builderConfig.env === Environment.Production;

        const rule: RuleSetRule = {
            test: /\.s?css$/,
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
                        ident: 'postcss',
                        sourceMap: true,
                        plugins: () => {
                            const autoprefixer = require('autoprefixer');

                            const plugins = [
                                autoprefixer({
                                    remove: false,
                                }),
                            ];

                            if (isProduction) {
                                const cssNano = require('cssnano');

                                plugins.push(cssNano);
                            }

                            return plugins;
                        },
                    },
                },
            ],
        };

        webpackConfig.module.rules.push(rule);

        next();

        if (this.config.sass.enabled) {
            new SassLoaderAdapter(this.config.sass).apply(
                webpackConfig,
                builderConfig,
                () => {}
            );
        }

        if (!this.checkMiniCssExtractPluginIsInWebpackConfig(webpackConfig)) {
            new ExtractCssPluginAdapter().apply(
                webpackConfig,
                builderConfig,
                () => {}
            );
        }
    }

    private checkMiniCssExtractPluginIsInWebpackConfig(
        webpackConfig: Configuration
    ): boolean {
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');

        return checkPluginInstanceIsInWebpackConfig(
            MiniCssExtractPlugin,
            webpackConfig
        );
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            'mini-css-extract-plugin': '0.9.0',
            autoprefixer: '9.7.0',
            'css-loader': '3.4.0',
            'postcss-loader': '3.0.0',
            cssnano: '4.1.10',
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
