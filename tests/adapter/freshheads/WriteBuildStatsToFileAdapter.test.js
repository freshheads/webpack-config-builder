const {
    FreshheadsWriteBuildStatsToFileAdapter,
} = require('../../../build/index');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

describe('FreshheadsWriteBuildStatsToFileAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsWriteBuildStatsToFileAdapter();
        });

        it('should add the StartsWriterPlugin to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(StatsWriterPlugin);
        });

        it("should call the 'next' callback afterwards", (done) => {
            const nextCallback = () => done();

            adapter.apply({}, { env: 'production' }, nextCallback);
        });
    });
});
