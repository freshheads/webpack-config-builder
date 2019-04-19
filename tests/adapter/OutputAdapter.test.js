const { Builder, OutputAdapter } = require('./../../build/index');

describe('OutputAdapter', () => {
    const builderConfig = { env: 'production' };

    describe('With output configuration supplied', () => {
        it('should add it to the configuration file', () => {
            const adapter = new OutputAdapter({
                path: './../web/build',
                publicPath: '/build',
            });

            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toEqual({
                output: {
                    path: './../web/build',
                    publicPath: '/build',
                },
            });
        });
    });

    describe('When supplied in a build chain', () => {
        var builder;

        beforeEach(() => {
            builder = new Builder();

            builder.add(
                new OutputAdapter({
                    path: './../web/build',
                    publicPath: '/build',
                })
            );
        });

        it('should throw an error when it is applied twice', () => {
            builder.add(
                new OutputAdapter({
                    path: './../web/dist',
                    publicPath: '/dist',
                })
            );

            const callback = () => {
                builder.build();
            };

            expect(callback).toThrow(
                'A webpack output is already set. If set again, it will replace the previous one.'
            );
        });

        it('should call the next() callback after updating the config', done => {
            const nextCallback = () => {
                done();
            };

            const adapter = new OutputAdapter({
                path: './../web/dist',
                publicPath: '/dist',
            });

            adapter.apply({}, builderConfig, nextCallback);
        });
    });
});
