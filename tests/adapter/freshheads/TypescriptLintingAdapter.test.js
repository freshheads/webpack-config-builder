const {
    Builder,
    FreshheadsTypescriptLintingAdapter,
} = require('../../../build/index');

describe('FreshheadsTypescriptLintingAdapter', () => {
    let builderConfig;

    beforeEach(() => {
        builderConfig = { env: 'production' };
    });

    describe('Without additional configuration supplied', () => {
        it('should set the correct defaults', () => {
            const adapter = new FreshheadsTypescriptLintingAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules)).toBe(true);
            expect(rules).toHaveLength(1);

            const onlyRule = rules.pop();

            expect(onlyRule).toHaveProperty('test');
            expect(onlyRule).toHaveProperty('use');

            const use = onlyRule.use;

            expect(Array.isArray(use)).toBe(true);
            expect(use).toHaveLength(1);

            const onlyUse = use.pop();

            expect(onlyUse).toHaveProperty('loader', 'tslint-loader');
            expect(onlyUse).toHaveProperty('options.configFile');
        });
    });

    describe('With extra configuration applied', () => {
        it('should add the correct rule configuration', () => {
            const otherConfigurationPath = './tsconfig.json';
            const adapter = new FreshheadsTypescriptLintingAdapter({
                configurationPath: otherConfigurationPath,
            });
            const webpackConfig = {};

            adapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules)).toBe(true);
            expect(rules).toHaveLength(1);

            const onlyRule = rules.pop();

            expect(onlyRule).toHaveProperty('test');
            expect(onlyRule).toHaveProperty('use');

            const use = onlyRule.use;

            expect(Array.isArray(use)).toBe(true);
            expect(use).toHaveLength(1);

            const onlyUse = use.pop();

            expect(onlyUse).toHaveProperty('loader', 'tslint-loader');
            expect(onlyUse).toHaveProperty(
                'options.configFile',
                otherConfigurationPath
            );
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const callback = () => {
                done();
            };

            const adapter = new FreshheadsTypescriptLintingAdapter();

            adapter.apply({}, builderConfig, callback);
        });
    });
});
