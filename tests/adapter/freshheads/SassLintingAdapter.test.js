const { FreshheadsSassLintingAdapter } = require('../../../build/index');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

describe('FreshheadsSassLintingAdapter', () => {
    describe('When applied', () => {
        describe('..in the production environment', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsSassLintingAdapter();
            });

            it('should not alter the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toStrictEqual(webpackConfig);
                expect(webpackConfig).toBe(webpackConfig);
            });

            it("should call the 'next' callback", done => {
                const callback = () => done();

                adapter.apply({}, { env: 'production' }, callback);
            });
        });

        describe('..in non-production environments', () => {
            describe('..with default configuration', () => {
                it('should add the linting plugin to the Webpack config', () => {
                    const adapter = new FreshheadsSassLintingAdapter();

                    const webpackConfig = {};

                    adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                    expect(webpackConfig).toHaveProperty('plugins');

                    const plugins = webpackConfig.plugins;

                    expect(Array.isArray(plugins)).toBe(true);
                    expect(plugins).toHaveLength(1);

                    const onlyPlugin = plugins[0];

                    expect(onlyPlugin).toBeInstanceOf(StylelintBarePlugin);
                });
            });

            describe('..with custom configuration', () => {
                it('should add the linting plugin to the Webpack config', () => {
                    const customConfigurationPath =
                        './customPath/someFile.json';

                    const adapter = new FreshheadsSassLintingAdapter({
                        configurationPath: customConfigurationPath,
                    });

                    const webpackConfig = {};

                    adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                    expect(webpackConfig).toHaveProperty('plugins');

                    const plugins = webpackConfig.plugins;

                    expect(Array.isArray(plugins)).toBe(true);
                    expect(plugins).toHaveLength(1);

                    const onlyPlugin = plugins[0];

                    expect(onlyPlugin).toBeInstanceOf(StylelintBarePlugin);
                });
            });

            it("should call the 'next' callback", done => {
                const adapter = new FreshheadsSassLintingAdapter();
                const callback = () => done();

                adapter.apply({}, { env: 'dev' }, callback);
            });
        });
    });
});
