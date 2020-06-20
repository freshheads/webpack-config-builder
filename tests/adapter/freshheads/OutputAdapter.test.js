const {
    Builder,
    OutputAdapter,
    FreshheadsOutputAdapter,
} = require('../../../build/index');

describe('FreshheadsOutputAdapter', () => {
    describe('For the production environment', () => {
        it('should set the correct defaults that include the parameters we provided', () => {
            const adapter = new FreshheadsOutputAdapter(
                './../web/build',
                'build'
            );
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toEqual({
                output: {
                    chunkFilename: '[name].[hash].[id].js',
                    filename: '[name].[hash].js',
                    path: './../web/build',
                    publicPath: 'build',
                },
            });
        });
    });

    describe('For the development environment', () => {
        it('should set the correct output configuration', () => {
            const adapter = new FreshheadsOutputAdapter(
                './../web/build',
                'build'
            );
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toEqual({
                output: {
                    chunkFilename: '[name].[id].js',
                    filename: '[name].js',
                    path: './../web/build',
                    publicPath: 'build',
                },
            });
        });
    });

    describe('When applied twice', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const adapter = new FreshheadsOutputAdapter(
                './../web/build',
                'build'
            );

            builder.add(adapter).add(adapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When supplied with a regular output adapter', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const regularAdapter = new OutputAdapter({});
            const freshheadsAdapter = new FreshheadsOutputAdapter(
                './../web/build',
                'build'
            );

            builder.add(regularAdapter).add(freshheadsAdapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", (done) => {
            const adapter = new FreshheadsOutputAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
