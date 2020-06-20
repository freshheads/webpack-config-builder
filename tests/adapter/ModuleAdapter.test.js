const { Builder, ModuleAdapter } = require('./../../build/index');

describe('ModuleAdapter', () => {
    var builder, builderConfig, adapter;

    beforeEach(() => {
        builder = new Builder(builderConfig);

        builderConfig = { env: 'production' };

        adapter = new ModuleAdapter({
            noParse: 'test',
        });
    });

    describe('With a configuration supplied', () => {
        it('should add it to the webpack configuration', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                module: {
                    noParse: 'test',
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
        it("should call the 'next' callback", (done) => {
            const callback = () => {
                done();
            };

            adapter.apply({}, builderConfig, callback);
        });
    });
});
