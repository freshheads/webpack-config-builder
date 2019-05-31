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

            expect(rule).toHaveProperty('test');
            expect(rule).toHaveProperty('use', 'file-loader');
        });
    });

    describe('With a configuration override supplied', () => {
        it('should set the correct output configuration', () => {
            const alternateTest = /.woff2/;
            const alternateAdapter = new FreshheadsLoadReferencedFilesAdapter({
                test: alternateTest,
            });
            const webpackConfig = {};

            alternateAdapter.apply(webpackConfig, builderConfig, () => {});

            expect(webpackConfig).toHaveProperty('module');
            expect(webpackConfig).toHaveProperty('module.rules');

            const rules = webpackConfig.module.rules;

            expect(Array.isArray(rules));
            expect(rules).toHaveLength(1);

            const rule = rules.pop();

            expect(rule).toHaveProperty('test', alternateTest);
            expect(rule).toHaveProperty('use', 'file-loader');
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const callback = () => {
                done();
            };

            adapter.apply({}, builderConfig, callback);
        });
    });
});
