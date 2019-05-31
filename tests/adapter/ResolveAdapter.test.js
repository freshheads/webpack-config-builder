const { Builder, ResolveAdapter } = require('./../../build/index');

describe('ResolveAdapter', () => {
    var builder;
    var builderConfig;
    var adapter;

    beforeEach(() => {
        builder = new Builder(builderConfig);

        builderConfig = { env: 'production' };

        adapter = new ResolveAdapter({
            modules: './node_modules',
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        });
    });

    describe('With configuration supplied', () => {
        it('should add it to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                resolve: {
                    modules: './node_modules',
                    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
                },
            });
        });
    });

    describe('When supplied in a build chain', () => {
        describe('...and applied twice', () => {
            it('should log a warning', () => {
                builder.add(adapter).add(adapter);

                builder.build();

                jest.spyOn(global.console, 'warn');
            });
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const callback = () => {
                done();
            };

            adapter.apply({}, builderConfig, callback);
        });
    });
});
