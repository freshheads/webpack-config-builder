const { FreshheadsTypescriptAdapter } = require('../../../build/index');

describe('FreshheadsTypescriptAdapter', () => {
    describe('Without customn configuration', () => {
        it('should set the correct defaults', () => {
            const adapter = new FreshheadsTypescriptAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('module.rules');
            expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

            const rules = webpackConfig.module.rules;

            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule).toHaveProperty('test');
            expect(rule).toHaveProperty('include');
            expect(rule).toHaveProperty('use');

            expect(Array.isArray(rule.use)).toBe(true);

            const use = rule.use;

            expect(use).toHaveLength(1);

            const firstUse = use[0];

            expect(firstUse).toHaveProperty('loader');
            expect(firstUse.loader).toBe('ts-loader');
        });
    });

    describe('With custom configuration', () => {
        it('should apply it on top of the defaults', () => {
            const expectedIncludeValue = ['./first', './second'];
            const adapter = new FreshheadsTypescriptAdapter({
                include: expectedIncludeValue,
            });
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

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
