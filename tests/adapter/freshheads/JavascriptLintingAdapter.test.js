const {
    Builder,
    FreshheadsJavascriptLintingAdapter,
} = require('../../../build/index');

describe('FreshheadsJavascriptLintingAdapter', () => {
    let builderConfig;

    beforeEach(() => {
        builderConfig = { env: 'production' };
    });

    describe('Without additional configuration supplied', () => {
        it('should set the correct defaults', () => {
            const adapter = new FreshheadsJavascriptLintingAdapter();
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

            expect(onlyUse).toHaveProperty('loader', 'eslint-loader');
            expect(onlyUse).toHaveProperty('options.configFile');
        });
    });

    describe('With extra configuration applied', () => {
        it('should add the correct rule configuration', () => {
            const otherConfigurationPath = './eslintrc';
            const adapter = new FreshheadsJavascriptLintingAdapter({
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

            expect(onlyUse).toHaveProperty('loader', 'eslint-loader');
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

            const adapter = new FreshheadsJavascriptLintingAdapter();

            adapter.apply({}, builderConfig, callback);
        });
    });
});
