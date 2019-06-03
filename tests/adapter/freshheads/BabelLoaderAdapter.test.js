const { FreshheadsBabelLoaderAdapter } = require('../../../build/index');
const CleanWebpackPlugin = require('clean-webpack-plugin');

describe('FreshheadsBabelLoaderAdapter', () => {
    describe('When applied', () => {
        describe('..with default settings', () => {
            it('should add the right rule to the webpack config', () => {
                const adapter = new FreshheadsBabelLoaderAdapter();

                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'prod' }, () => {});

                expect(webpackConfig).toHaveProperty('module');
                expect(webpackConfig.module).toHaveProperty('rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);

                const onlyUse = use[0];

                expect(onlyUse).toHaveProperty('loader', 'babel-loader');
            });
        });

        describe('..with custom settings', () => {
            it('should add the right rule to the webpack config', () => {
                const custombabelConfigurationFilePath = './someOtherPath.json';
                const customInclude = ['./someOtherPath.js'];

                const adapter = new FreshheadsBabelLoaderAdapter({
                    babelConfigurationFilePath: custombabelConfigurationFilePath,
                    include: customInclude,
                });

                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'prod' }, () => {});

                expect(webpackConfig).toHaveProperty('module');
                expect(webpackConfig.module).toHaveProperty('rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');
                expect(onlyRule).toHaveProperty('include', customInclude);

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);

                const onlyUse = use[0];

                expect(onlyUse).toHaveProperty('loader', 'babel-loader');
                expect(onlyUse).toHaveProperty('options');
                expect(onlyUse.options).toHaveProperty(
                    'configFile',
                    custombabelConfigurationFilePath
                );
            });
        });

        it("should call the 'next' callback afterwards", done => {
            const adapter = new FreshheadsBabelLoaderAdapter();
            const webpackConfig = {};

            const nextCallback = () => done();

            adapter.apply(webpackConfig, { env: 'production' }, nextCallback);
        });
    });
});
