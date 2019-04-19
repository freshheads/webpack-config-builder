const { Builder, ModeAdapter } = require('./../../build/index');

describe('ModeAdapter', () => {
    var builder;
    var builderConfig;
    var adapter;

    beforeEach(() => {
        builder = new Builder(builderConfig);

        builderConfig = { env: 'production' };

        adapter = new ModeAdapter('development');
    });

    describe('With a mode supplied', () => {
        it('should add it to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                mode: 'development',
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
                    'A webpack mode is already set. If set again, it will replace the previous one.'
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
