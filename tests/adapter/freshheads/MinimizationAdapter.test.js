const { FreshheadsMinimizationAdapter } = require('../../../build/index');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

describe('FreshheadsMinimizationAdapter', () => {
    describe('When applied', () => {
        let adapter;

        beforeEach(() => {
            adapter = new FreshheadsMinimizationAdapter();
        });

        describe('..on the production environment', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsMinimizationAdapter();
            });

            it('should add css minimizer to the webpack config', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('optimization');

                const CssMinimizer = webpackConfig.optimization.minimizer[1];
                expect(CssMinimizer).toBeInstanceOf(CssMinimizerPlugin);
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
