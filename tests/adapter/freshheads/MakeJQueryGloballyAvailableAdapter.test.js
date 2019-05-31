const {
    FreshheadsMakeJQueryGloballyAvailableAdapter,
} = require('../../../build/index');
const { ProvidePlugin } = require('webpack');

describe('FreshheadsMakeJQueryGloballyAvailableAdapter', () => {
    describe('When applied', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsMakeJQueryGloballyAvailableAdapter();
        });

        it('should add the DefinePlugin to the webpack plugin configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(1);

            const onlyPlugin = plugins.pop();

            expect(onlyPlugin).toBeInstanceOf(ProvidePlugin);
        });

        it("should call the 'next' callback", done => {
            const callback = () => done();

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
