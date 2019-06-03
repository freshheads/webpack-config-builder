const {
    FreshheadsJavascriptMinimizationAdapter,
} = require('../../../build/index');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');

describe('FreshheadsJavascriptMinimizationAdapter', () => {
    describe('When applied', () => {
        let adapter;

        beforeEach(() => {
            adapter = new FreshheadsJavascriptMinimizationAdapter();
        });

        describe('..on non-production environments', () => {
            it('should should not later the webpac config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                expect(webpackConfig).not.toHaveProperty('plugins');
            });

            it("should call the 'next' callback afterwards", done => {
                const webpackConfig = {};

                const nextCallback = () => done();

                adapter.apply(webpackConfig, { env: 'dev' }, nextCallback);
            });
        });

        describe('..on the production environment', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsJavascriptMinimizationAdapter();
            });

            it('should add the right plugin to the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('plugins');

                const plugins = webpackConfig.plugins;

                expect(Array.isArray(plugins)).toBe(true);
                expect(plugins).toHaveLength(1);

                const onlyPlugin = plugins[0];

                expect(onlyPlugin).toBeInstanceOf(UglifyjsPlugin);
            });

            it("should call the 'next' callback afterwards", done => {
                const webpackConfig = {};

                const nextCallback = () => done();

                adapter.apply(
                    webpackConfig,
                    { env: 'production' },
                    nextCallback
                );
            });
        });
    });
});
