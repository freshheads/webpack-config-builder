const { FreshheadsJavascriptJQueryAdapter } = require('../../../build/index');
const ProvidePlugin = require('webpack').ProvidePlugin;

describe('JavascriptJQueryAdapter', () => {
    var adapter;

    beforeEach(() => {
        adapter = new FreshheadsJavascriptJQueryAdapter();
    });

    describe('When applied', () => {
        it('should add the plugin to the plugins section of the webpack config', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(plugins).toHaveLength(1);

            const firstPlugin = plugins.pop();

            expect(firstPlugin).toBeInstanceOf(ProvidePlugin);
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
