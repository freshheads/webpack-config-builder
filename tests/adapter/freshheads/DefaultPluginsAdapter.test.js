const { FreshheadsDefaultPluginsAdapter } = require('../../../build/index');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

describe('FreshheadsDefaultPluginsAdapter', () => {
    describe('When applied without configuration', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultPluginsAdapter();
        });

        it('should add all default adapters to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(5);
        });

        describe('..for the production environment', () => {
            it('should add the uglify js plugin', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                const plugins = webpackConfig.plugins;

                const lastPlugin = plugins.pop();

                expect(lastPlugin).toBeInstanceOf(UglifyjsPlugin);
            });
        });

        describe('..for non-production environments', () => {
            it('should add the stylelint plugin', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                const plugins = webpackConfig.plugins;

                const lastPlugin = plugins.pop();

                expect(lastPlugin).toBeInstanceOf(StylelintBarePlugin);
            });
        });

        it("should call the 'next' callback", done => {
            const callback = () => done();

            adapter.apply({}, { env: 'production' }, callback);
        });
    });

    describe('When applied with stuff disabled', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultPluginsAdapter({
                clean: {
                    enabled: false,
                },
                statsWriter: {
                    enabled: false,
                },
                define: {
                    enabled: false,
                },
                provide: {
                    enabled: false,
                },
                copy: {
                    enabled: false,
                },
                uglify: {
                    enabled: false,
                },
                stylelint: {
                    enabled: false,
                },
            });
        });

        it('should not add this stuff to the plugins', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(adapter).not.toHaveProperty('plugins');
        });
    });
});
