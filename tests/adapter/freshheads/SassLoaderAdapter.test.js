const { FreshheadsSassLoaderAdapter } = require('../../../build/index');

describe('FreshheadsSassLoaderAdapter', () => {
    describe('When applied', () => {
        describe('..without custom configuration', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsSassLoaderAdapter();
            });

            it('should add the correct loader', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('module.rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);
                expect(use).toHaveLength(5);

                expect(use[1]).toHaveProperty('loader', 'css-loader');
                expect(use[2]).toHaveProperty('loader', 'postcss-loader');
                expect(use[3]).toHaveProperty('loader', 'resolve-url-loader');
                expect(use[4]).toHaveProperty('loader', 'sass-loader');
            });

            it("should call the 'next' callback", done => {
                const callback = () => done();

                adapter.apply({}, { env: 'production' }, callback);
            });
        });

        describe('..with custom configuration', () => {
            let adapter;

            beforeEach(() => {
                adapter = new FreshheadsSassLoaderAdapter({
                    cssLoaderOptions: {
                        sourceMap: false,
                    },
                    sassLoaderOptions: {
                        sourceMap: false,
                    },
                });
            });

            it('should add the correct loader', () => {
                const webpackConfig = {};

                adapter.apply(webpackConfig, { env: 'production' }, () => {});

                expect(webpackConfig).toHaveProperty('module.rules');

                const rules = webpackConfig.module.rules;

                expect(Array.isArray(rules)).toBe(true);
                expect(rules).toHaveLength(1);

                const onlyRule = rules[0];

                expect(onlyRule).toHaveProperty('use');

                const use = onlyRule.use;

                expect(Array.isArray(use)).toBe(true);
                expect(use).toHaveLength(5);

                expect(use[1]).toHaveProperty('loader', 'css-loader');
                expect(use[2]).toHaveProperty('loader', 'postcss-loader');
                expect(use[3]).toHaveProperty('loader', 'resolve-url-loader');
                expect(use[4]).toHaveProperty('loader', 'sass-loader');
            });

            it("should call the 'next' callback", done => {
                const callback = () => done();

                adapter.apply({}, { env: 'production' }, callback);
            });
        });
    });
});
