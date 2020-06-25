const {
    Builder,
    DevtoolAdapter,
    FreshheadsSourcemapAdapter,
} = require('../../../build/index');

describe('FreshheadsSourcemapAdapter', () => {
    describe('For the production environment', () => {
        it('should set the correct sourcemap tool', () => {
            const adapter = new FreshheadsSourcemapAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toEqual({
                devtool: 'source-map',
            });
        });
    });

    describe('For the development environment', () => {
        it('should set the correct sourcemap tool', () => {
            const adapter = new FreshheadsSourcemapAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toEqual({
                devtool: 'eval-source-map',
            });
        });
    });

    describe('When applied twice', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const adapter = new FreshheadsSourcemapAdapter();

            builder.add(adapter).add(adapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When supplied with a regular devtool adapter', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const regularAdapter = new DevtoolAdapter();
            const freshheadsAdapter = new FreshheadsSourcemapAdapter();

            builder.add(regularAdapter).add(freshheadsAdapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", (done) => {
            const adapter = new FreshheadsSourcemapAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
