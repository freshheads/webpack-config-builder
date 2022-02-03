const { FreshheadsDefaultAdminStackAdapter } = require('../../../build/index');

describe('FreshheadsDefaultAdminStackAdapter', () => {
    describe('When applied', () => {
        var adapter, builderConfig;

        beforeEach(() => {
            adapter = new FreshheadsDefaultAdminStackAdapter();
            builderConfig = { env: 'dev' };
        });

        it('should contain all rules for all default adapters', () => {
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules)).toBe(true);

            expect(rules).toHaveLength(4);

            rules.forEach((rule) => {
                if (rule.oneOf) {
                    expect(rule.oneOf[0]).toHaveProperty('test');
                } else {
                    expect(rule).toHaveProperty('test');
                }
            });
        });

        it("should call the 'next' callback afterwards", (done) => {
            const callback = () => done();

            adapter.apply({}, builderConfig, callback);
        });
    });
});
