const {
    FreshheadsDefaultCopyFilesToBuildDirAdapter,
} = require('../../../build/index');
const CopyWebpackPlugin = require('copy-webpack-plugin');

describe('FreshheadsDefaultCopyFilesToBuildDirAdapter', () => {
    describe('When applied without patterns', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultCopyFilesToBuildDirAdapter();
        });

        describe('...and with no other plugins applied', () => {
            it('should not add the plugin to the configuration', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).not.toHaveProperty('plugins');
            });
        });

        describe('...and with other plugins applied', () => {
            it('should not add the plugin to the configuration', () => {
                const webpackConfig = {
                    plugins: [new CopyWebpackPlugin()],
                };

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('plugins');

                const plugins = webpackConfig.plugins;

                expect(plugins).toHaveLength(1);
            });
        });

        it("should call the 'next' callback afterwards", done => {
            const webpackConfig = {};

            const nextCallback = () => {
                done();
            };

            adapter.apply(webpackConfig, { env: 'production' }, nextCallback);
        });
    });

    describe('When applied with patterns', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultCopyFilesToBuildDirAdapter({
                images: true,
            });
        });

        it('should add the plugin to the configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(CopyWebpackPlugin);
        });

        it("should call the 'next' callback afterwards", done => {
            const webpackConfig = {};

            const nextCallback = () => {
                done();
            };

            adapter.apply(webpackConfig, { env: 'production' }, nextCallback);
        });
    });
});
