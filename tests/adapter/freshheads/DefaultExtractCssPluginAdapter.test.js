const {
    FreshheadsDefaultExtractCssPluginAdapter,
} = require('../../../build/index');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

describe('FreshheadsDefaultExtractCssPluginAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultExtractCssPluginAdapter();
        });

        it('should add the plugin to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(MiniCssExtractPlugin);
        });

        it("should call the 'next' callback afterwards", done => {
            const callback = () => done();

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
