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
            it('should log a warning', () => {
                builder.add(adapter).add(adapter);

                jest.spyOn(global.console, 'warn');
            });
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", (done) => {
            const callback = () => {
                done();
            };

            adapter.apply({}, builderConfig, callback);
        });
    });
});
