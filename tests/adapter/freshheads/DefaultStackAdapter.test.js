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

            rules.forEach((rule) => {
                if (rule.oneOf) {
                    expect(rule.oneOf[0]).toHaveProperty('test');
                } else {
                    expect(rule).toHaveProperty('test');
                }
            });
        });

        it('should set the correct defaults for Optimization Adaptor', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('optimization');

            const optimizationRules = webpackConfig.optimization;

            expect(optimizationRules).toHaveProperty('splitChunks');
            expect(optimizationRules.splitChunks).toEqual({
                automaticNameDelimiter: '-',
            });
        });

        it("should call the 'next' callback afterwards", (done) => {
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
                (item) => item instanceof StatsWriterPlugin
            );

            const positionCopyPlugin = plugins.findIndex(
                (item) => item instanceof CopyWebpackPlugin
            );

            expect(positionStatsWriterPlugin).toBeGreaterThan(
                positionCopyPlugin
            );
        });
    });
});
