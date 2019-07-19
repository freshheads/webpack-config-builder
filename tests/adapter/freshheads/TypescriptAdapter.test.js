const { FreshheadsTypescriptAdapter } = require('../../../build/index');

describe('FreshheadsTypescriptAdapter', () => {
    describe('Without customn configuration', () => {
        it('should set the correct defaults', () => {
            const adapter = new FreshheadsTypescriptAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toHaveProperty('module.rules');
            expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

            const rules = webpackConfig.module.rules;

            expect(rules).toHaveLength(2);

            const firstRule = rules[0];

            expect(firstRule).toHaveProperty('test');
            expect(firstRule).toHaveProperty('include');
            expect(firstRule).toHaveProperty('use');

            expect(Array.isArray(firstRule.use)).toBe(true);

            const firstRuleOnlyUse = firstRule.use;

            expect(firstRuleOnlyUse).toHaveLength(1);

            const firstRuleFirstUse = firstRuleOnlyUse[0];

            expect(firstRuleFirstUse).toHaveProperty('loader');
            expect(firstRuleFirstUse.loader).toBe('babel-loader');

            const secondRule = rules[1];

            expect(secondRule).toHaveProperty('test');
            expect(secondRule).toHaveProperty('use');

            expect(Array.isArray(secondRule.use)).toBe(true);

            const secondRuleOnlyUse = secondRule.use;

            expect(secondRuleOnlyUse).toHaveLength(1);

            const secondRuleFirstUse = secondRuleOnlyUse[0];

            expect(secondRuleFirstUse).toHaveProperty('loader');
            expect(secondRuleFirstUse.loader).toBe('tslint-loader');
        });
    });

    describe('With custom configuration', () => {
        it('should apply it on top of the defaults', () => {
            const expectedIncludeValue = ['./first', './second'];
            const adapter = new FreshheadsTypescriptAdapter({
                include: expectedIncludeValue,
                linting: {
                    enabled: false,
                },
            });
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toHaveProperty('module.rules');
            expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

            const rules = webpackConfig.module.rules;

            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule).toHaveProperty('include', expectedIncludeValue);
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
