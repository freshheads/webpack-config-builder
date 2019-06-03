const { FreshheadsJavascriptLintingAdapter } = require('../../../build/index');
const CleanWebpackPlugin = require('clean-webpack-plugin');

describe('FreshheadsJavascriptLintingAdapter', () => {
    describe('When applied', () => {
        describe('..with default settings', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsJavascriptLintingAdapter();
            });

            it('should add the right rule to the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                expect(webpackConfig).toHaveProperty('module');
                expect(webpackConfig.module).toHaveProperty('rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);
                expect(use).toHaveLength(1);

                const firstUse = use[0];

                expect(firstUse).toHaveProperty('loader', 'eslint-loader');
            });

            describe('..on the production environment', () => {
                it('should do nothing to the Webpack configuration', () => {
                    const webpackConfig = {};

                    adapter.apply(
                        webpackConfig,
                        { env: 'production' },
                        () => {}
                    );

                    expect(webpackConfig).not.toHaveProperty('module');
                });
            });
        });

        describe('..with custom settings', () => {
            let customConfigurationPath, adapter;

            beforeEach(() => {
                customConfigurationPath = './someCustomFile.js';

                adapter = adapter = new FreshheadsJavascriptLintingAdapter({
                    configurationPath: customConfigurationPath,
                });
            });

            it('should add the right rule to the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                expect(webpackConfig).toHaveProperty('module');
                expect(webpackConfig.module).toHaveProperty('rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);
                expect(use).toHaveLength(1);

                const firstUse = use[0];

                expect(firstUse).toHaveProperty('loader', 'eslint-loader');
                expect(firstUse).toHaveProperty(
                    'options.configFile',
                    customConfigurationPath
                );
            });

            describe('..on the production environment', () => {
                it('should do nothing to the Webpack configuration', () => {
                    const webpackConfig = {};

                    adapter.apply(
                        webpackConfig,
                        { env: 'production' },
                        () => {}
                    );

                    expect(webpackConfig).not.toHaveProperty('module');
                });
            });
        });

        it("should call the 'next' callback afterwards", done => {
            const adapter = new FreshheadsJavascriptLintingAdapter();
            const webpackConfig = {};

            const nextCallback = () => done();

            adapter.apply(webpackConfig, { env: 'production' }, nextCallback);
        });
    });
});
