const {
    FreshheadsDefaultJavascriptRuleAdapter,
} = require('../../../build/index');

describe('FreshheadsDefaultJavascriptRuleAdapter', () => {
    describe('Without customn configuration', () => {
        it('should set the correct defaults', () => {
            const expectConfigFilePath = './babel.config.js';
            const adapter = new FreshheadsDefaultJavascriptRuleAdapter({
                babelConfigurationFilePath: expectConfigFilePath,
            });
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('module.rules');
            expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

            const rules = webpackConfig.module.rules;

            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule).toHaveProperty('test');
            expect(rule).toHaveProperty('use');

            expect(Array.isArray(rule.use)).toBe(true);

            const use = rule.use;

            expect(use).toHaveLength(1);

            const firstUse = rule.use[0];

            expect(firstUse).toHaveProperty('loader', 'babel-loader');
            expect(firstUse).toHaveProperty('options');

            const options = firstUse.options;

            expect(options).toHaveProperty('configFile', expectConfigFilePath);
        });
    });

    describe('With custom configuration', () => {
        it('should set the correct defaults', () => {
            const expectedBabelConfigPath = './babel.config.js';
            const adapter = new FreshheadsDefaultJavascriptRuleAdapter({
                include: ['./test', './anders'],
                babelConfigurationFilePath: expectedBabelConfigPath,
            });
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toHaveProperty('module.rules');
            expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

            const rules = webpackConfig.module.rules;

            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule).toHaveProperty('test');
            expect(rule).toHaveProperty('use');

            expect(Array.isArray(rule.use)).toBe(true);

            expect(rule.include).toHaveLength(2);

            const use = rule.use;

            expect(use).toHaveLength(1);

            const firstUse = rule.use[0];

            expect(firstUse).toHaveProperty('loader', 'babel-loader');
            expect(firstUse).toHaveProperty('options');

            const options = firstUse.options;

            expect(options).toHaveProperty(
                'configFile',
                expectedBabelConfigPath
            );
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const adapter = new FreshheadsDefaultJavascriptRuleAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
