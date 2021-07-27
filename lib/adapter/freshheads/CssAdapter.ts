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
        modules: {
            auto: true, // enable css modules for filenames that contain .module.(s)css
        },
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

        const isProduction = builderConfig.env === Environment.Production;

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

        if (this.config.sass.enabled) {
            builder.add(new SassLoaderAdapter(this.config.sass));
        }

        builder.build();

        next();
    }

    private validateAllRequiredModulesAreInstalled() {
        const requiredModules: { [module: string]: string } = {
            autoprefixer: '9.8.0',
            'css-loader': '3.6.0',
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
