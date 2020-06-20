const {
    FreshheadsJavascriptMinimizationAdapter,
} = require('../../../build/index');
const TerserPlugin = require('terser-webpack-plugin');

describe('FreshheadsJavascriptMinimizationAdapter', () => {
    describe('When applied', () => {
        let adapter;

        beforeEach(() => {
            adapter = new FreshheadsJavascriptMinimizationAdapter();
        });

        describe('..on non-production environments', () => {
            it('should should not later the webpac config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                expect(webpackConfig).not.toHaveProperty('plugins');
            });

            it("should call the 'next' callback afterwards", (done) => {
                const webpackConfig = {};

                const nextCallback = () => done();

                adapter.apply(webpackConfig, { env: 'dev' }, nextCallback);
            });
        });

        describe('..on the production environment', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsJavascriptMinimizationAdapter();
            });

            it('should enable minimizer to the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('optimization');

                expect(webpackConfig.optimization.minimize).toEqual(true);

                const minimizer = webpackConfig.optimization.minimizer[0];
                expect(minimizer).toBeInstanceOf(TerserPlugin);
            });

            it("should call the 'next' callback afterwards", (done) => {
                const webpackConfig = {};

                const nextCallback = () => done();

                adapter.apply(
                    webpackConfig,
                    { env: 'production' },
                    nextCallback
                );
            });
        });
    });
});
