const { FreshheadsTypescriptAdapter } = require('../../../build/index');

describe('FreshheadsTypescriptAdapter', () => {
    describe('Without customn configuration', () => {
        it('should set the correct defaults', () => {
            const adapter = new FreshheadsTypescriptAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toHaveProperty('resolve.extensions');

            expect(webpackConfig).toEqual({
                resolve: {
                    extensions: ['.ts', '.tsx'],
                },
            });
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const adapter = new FreshheadsTypescriptAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
