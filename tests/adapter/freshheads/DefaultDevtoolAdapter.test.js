const {
    Builder,
    DevtoolAdapter,
    FreshheadsDefaultDevtoolAdapter,
} = require('../../../build/index');

describe('FreshheadsDefaultDevtoolAdapter', () => {
    describe('For the production environment', () => {
        it('should set the correct sourcemap tool', () => {
            const adapter = new FreshheadsDefaultDevtoolAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'production' }, () => {});

            expect(webpackConfig).toEqual({
                devtool: 'source-map',
            });
        });
    });

    describe('For the development environment', () => {
        it('should set the correct sourcemap tool', () => {
            const adapter = new FreshheadsDefaultDevtoolAdapter();
            const webpackConfig = {};

            adapter.apply(webpackConfig, { env: 'dev' }, () => {});

            expect(webpackConfig).toEqual({
                devtool: 'inline-source-map',
            });
        });
    });

    describe('When applied twice', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const adapter = new FreshheadsDefaultDevtoolAdapter();

            builder.add(adapter).add(adapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When supplied with a regular devtool adapter', () => {
        it('should log a warning', () => {
            const builder = new Builder();
            const regularAdapter = new DevtoolAdapter();
            const freshheadsAdapter = new FreshheadsDefaultDevtoolAdapter();

            builder.add(regularAdapter).add(freshheadsAdapter);

            builder.build();

            jest.spyOn(global.console, 'warn');
        });
    });

    describe('When done', () => {
        it("should call the 'next' callback", done => {
            const adapter = new FreshheadsDefaultDevtoolAdapter();

            const callback = () => {
                done();
            };

            adapter.apply({}, { env: 'production' }, callback);
        });
    });
});
