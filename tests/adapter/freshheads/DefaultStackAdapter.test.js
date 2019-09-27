const { FreshheadsDefaultStackAdapter } = require('../../../build/index');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

describe('FreshheadsDefaultStackAdapter', () => {
    describe('When applied', () => {
        var adapter, builderConfig;

        beforeEach(() => {
            adapter = new FreshheadsDefaultStackAdapter();
            builderConfig = { env: 'dev' };
        });

        it('should contain all rules for all default adapters', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules)).toBe(true);

            expect(rules).toHaveLength(4);

            rules.forEach(rule => {
                expect(rule).toHaveProperty('test');
            });
        });

        it("should call the 'next' callback afterwards", done => {
            const callback = () => done();

            adapter.apply({}, builderConfig, callback);
        });
    });

    describe('When applied with CopyWebpackPlugin images true', () => {
        var adapter, builderConfig;

        beforeEach(() => {
            adapter = new FreshheadsDefaultStackAdapter({
                copyFilesToBuildDir: {
                    enabled: true,
                    images: true,
                },
            });
            builderConfig = { env: 'dev' };
        });

        it('WriteBuildStatsToFileAdapter should be loaded after CopyFilesToBuildDirAdapter', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            const plugins = webpackConfig.plugins;
            expect(Array.isArray(plugins)).toBe(true);

            const positionStatsWriterPlugin = plugins.findIndex(
                item => item instanceof StatsWriterPlugin
            );

            const positionCopyPlugin = plugins.findIndex(
                item => item instanceof CopyWebpackPlugin
            );

            expect(positionStatsWriterPlugin).toBeGreaterThan(
                positionCopyPlugin
            );
        });
    });
});
