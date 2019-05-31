const {
    FreshheadsDefaultStylelintPluginAdapter,
    Builder,
} = require('../../../build/index');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');

describe('FreshheadsDefaultStylelintPluginAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultStylelintPluginAdapter();
        });

        it('should add the plugin to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(StylelintBarePlugin);
        });

        describe('...and on the production environment', () => {
            it('should log a warning', () => {
                const builder = new Builder({ env: 'production' });

                builder.add(adapter);

                builder.build();

                jest.spyOn(global.console, 'warn');
            });
        });

        it("should call the 'next' callback afterwards", done => {
            const nextCallback = () => done();

            adapter.apply({}, { env: 'dev' }, nextCallback);
        });
    });
});
