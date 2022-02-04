const {
    FreshheadsLoadReferencedFilesAdapter,
} = require('../../../build/index');

describe('FreshheadsLoadReferencedFilesAdapter', () => {
    let adapter, builderConfig;

    beforeEach(() => {
        builderConfig = { env: 'production' };
        adapter = new FreshheadsLoadReferencedFilesAdapter();
    });

    describe('Without additional configuration supplied', () => {
        it('should set the correct defaults that include the parameters we provided', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules));
            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule.oneOf).toHaveLength(1);

            expect(rule.oneOf[0]).toHaveProperty('test');
            expect(rule.oneOf[0]).toHaveProperty('type', 'asset/resource');
        });
    });

    describe('With a additional asset rules supplied', () => {
        it('should set the correct output configuration', () => {
            const alternateAdapter = new FreshheadsLoadReferencedFilesAdapter({
                additionalAssetRules: [
                    {
                        test: /\.svg$/i,
                        issuer: /\.[jt]sx?$/,
                        use: ['@svgr/webpack'],
                    },
                ],
            });
            const webpackConfig = {};

            alternateAdapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules));
            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule.oneOf).toHaveLength(2);
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
