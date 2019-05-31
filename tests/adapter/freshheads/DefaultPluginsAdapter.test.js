const { FreshheadsDefaultPluginsAdapter } = require('../../../build/index');

describe('FreshheadsDefaultPluginsAdapter', () => {
    describe('When applied without configuration', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultPluginsAdapter();
        });

        it('should add all default adapters to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('plugins');

            const plugins = webpackConfig.plugins;

            expect(Array.isArray(plugins)).toBe(true);
            expect(plugins).toHaveLength(4);
        });

        it("should call the 'next' callback", done => {
            const callback = () => done();

            adapter.apply({}, { env: 'production' }, callback);
        });
    });

    describe('When applied with stuff disabled', () => {
        var adapter;

        beforeEach(() => {
            adapter = new FreshheadsDefaultPluginsAdapter({
                clean: {
                    enabled: false,
                },
                statsWriter: {
                    enabled: false,
                },
                define: {
                    enabled: false,
                },
                provide: {
                    enabled: false,
                },
                copy: {
                    enabled: false,
                },
                uglify: {
                    enabled: false,
                },
                stylelint: {
                    enabled: false,
                },
            });
        });

        it('should not add this stuff to the plugins', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(adapter).not.toHaveProperty('plugins');
        });
    });
});
