const {
    FreshheadsDefineEnvironmentVariablesAdapter,
} = require('../../../build/index');
const { DefinePlugin } = require('webpack');

describe('FreshheadsDefineEnvironmentVariablesAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefineEnvironmentVariablesAdapter();
        });

        it('should add the plugin to the webpack config plugins', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(DefinePlugin);
        });

        it("should call the 'next' callback afterwards", done => {
            const callback = () => done();

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
