const { Builder, OptimizationAdapter } = require('./../../build/index');

describe('WatchOptionsAdapter', () => {
    var builder;
    var builderConfig;
    var adapter;

    beforeEach(() => {
        builder = new Builder(builderConfig);

        builderConfig = { env: 'production' };

        adapter = new OptimizationAdapter({
            splitChunks: {
                automaticNameDelimiter: '-',
            },
        });
    });

    describe('With a configuration supplied', () => {
        it('should add it to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                optimization: {
                    splitChunks: {
                        automaticNameDelimiter: '-',
                    },
                },
            });
        });
    });

    describe('When supplied in a build chain', () => {
        describe('...and applied twice', () => {
            it('should throw an error', () => {
                builder.add(adapter).add(adapter);

                const callback = () => {
                    builder.build();
                };

                expect(callback).toThrow(
                    'A webpack optimization configuration is already set. If set again, it will replace the previous one.'
                );
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
