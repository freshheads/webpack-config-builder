const {
    Builder,
    FreshheadsDefaultOptimizationAdapter,
} = require('../../../build/index');

describe('FreshheadsDefaultOutputAdapter', () => {
    let builder, adapter, builderConfig;

    beforeEach(() => {
        builderConfig = { env: 'production' };
        builder = new Builder(builderConfig);
        adapter = new FreshheadsDefaultOptimizationAdapter();
    });

    describe('Without additional configuration supplied', () => {
        it('should set the correct defaults that include the parameters we provided', () => {
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

    describe('With additional configuration supplied', () => {
        it('should set the correct output configuration', () => {
            const alternateAdapter = new FreshheadsDefaultOptimizationAdapter({
                minimize: false,
            });
            const webpackConfig = {};

            alternateAdapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                optimization: {
                    minimize: false,
                    splitChunks: {
                        automaticNameDelimiter: '-',
                    },
                },
            });
        });

        it('should set the correct output configuration with deepmerge', () => {
            const alternateAdapter = new FreshheadsDefaultOptimizationAdapter({
                minimize: false,
                splitChunks: {
                    maxSize: 0,
                },
            });
            const webpackConfig = {};

            alternateAdapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                optimization: {
                    minimize: false,
                    splitChunks: {
                        automaticNameDelimiter: '-',
                        maxSize: 0,
                    },
                },
            });
        });
    });

    describe('When applied twice', () => {
        it('should log a warning', () => {
            const builder = new Builder();

            builder.add(adapter).add(adapter);

            jest.spyOn(global.console, 'warn');
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
