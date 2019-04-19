const {
    FreshheadsDefaultUglifyPluginAdapter,
} = require('../../../build/index');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');

describe('FreshheadsDefaultUglifyPluginAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultUglifyPluginAdapter();
        });

        it('should add the UglifyJsPlugin to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(UglifyjsPlugin);
        });

        it("should call the 'next' callback afterwards", done => {
            const nextCallback = () => done();

            adapter.apply({}, { env: 'production' }, nextCallback);
        });
    });
});
