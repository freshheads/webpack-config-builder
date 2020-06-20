const {
    FreshheadsCleanBuildDirectoryAdapter,
} = require('../../../build/index');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

describe('FreshheadsCleanBuildDirectoryAdapter', () => {
    var adapter;

    beforeEach(() => {
        adapter = new FreshheadsCleanBuildDirectoryAdapter();
    });

    describe('When applied', () => {
        it('should add the plugin to the plugins section of the webpack config', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(plugins).toHaveLength(1);

            const firstPlugin = plugins.pop();

            expect(firstPlugin).toBeInstanceOf(CleanWebpackPlugin);
        });

        it("should call the 'next' callback afterwards", (done) => {
            const webpackConfig = {};

            const nextCallback = () => {
                done();
            };

            adapter.apply(webpackConfig, { env: 'production' }, nextCallback);
        });
    });
});
