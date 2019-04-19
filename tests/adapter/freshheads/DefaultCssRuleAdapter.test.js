const {
    FreshheadsDefaultCssRuleAdapter,
    FreshheadsDefaultCssExtractPluginAdapter,
    Builder,
} = require('../../../build/index');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

describe('FreshheadsDefaultCssRuleAdapter', () => {
    describe('With default configuration', () => {
        describe('...environment independent', () => {
            it('should set the correct defaults', () => {
                const adapter = new FreshheadsDefaultCssRuleAdapter();
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

                expect(use).toHaveLength(3);

                expect(use[1]).toEqual({
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                });
            });
        });

        describe('..for the production environment', () => {
            it('should set the correct defaults', () => {
                const adapter = new FreshheadsDefaultCssRuleAdapter();
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                const rule = webpackConfig.module.rules.pop();
                const use = rule.use;

                expect(use[2]).toHaveProperty('loader', 'postcss-loader');
                expect(use[2]).toHaveProperty('options.plugins');

                const postCssUsePlugins = use[2].options.plugins();

                expect(postCssUsePlugins).toHaveLength(2);
            });
        });

        describe('..for the development environment', () => {
            it('should set the correct defaults', () => {
                const adapter = new FreshheadsDefaultCssRuleAdapter();
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'dev' }, () => {});

                const rule = webpackConfig.module.rules.pop();
                const use = rule.use;

                expect(use[2]).toHaveProperty('loader', 'postcss-loader');
                expect(use[2]).toHaveProperty('options.plugins');

                const postCssUsePlugins = use[2].options.plugins();

                expect(postCssUsePlugins).toHaveLength(1);
            });
        });

        describe('...when supplied without the MiniCssExtractAdapter', () => {
            it('should add it to the plugins', () => {
                const builder = new Builder();

                builder.add(new FreshheadsDefaultCssRuleAdapter());

                const webpackConfig = builder.build();

                expect(webpackConfig).toHaveProperty('plugins');

                const plugins = webpackConfig.plugins;

                expect(Array.isArray(plugins)).toBe(true);
                expect(plugins).toHaveLength(1);

                const onlyPlugin = plugins.pop();

                expect(onlyPlugin).toBeInstanceOf(MiniCssExtractPlugin);
            });

            it("shouldn't re-add it when it is already there", () => {
                const builder = new Builder();

                builder
                    .add(new FreshheadsDefaultCssRuleAdapter())
                    .add(new FreshheadsDefaultCssExtractPluginAdapter());

                const webpackConfig = builder.build();

                expect(webpackConfig).toHaveProperty('plugins');

                const plugins = webpackConfig.plugins;

                expect(Array.isArray(plugins)).toBe(true);
                expect(plugins).toHaveLength(1);

                const onlyPlugin = plugins.pop();

                expect(onlyPlugin).toBeInstanceOf(MiniCssExtractPlugin);
            });
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const adapter = new FreshheadsDefaultCssRuleAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
