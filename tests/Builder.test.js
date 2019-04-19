const { Builder, DevtoolAdapter, EntryAdapter } = require('./../build/index');

describe('Builder', () => {
    let myBuilder = null;

    beforeEach(() => {
        myBuilder = new Builder({
            env: 'production',
        });
    });

    it('should by able to instantiate a new builder', () => {
        expect(myBuilder instanceof Builder).toBe(true);
    });

    describe('With no adapters added', () => {
        it('should return an empty object', () => {
            expect(myBuilder.build()).toEqual({});
        });
    });

    describe('With one adapter added', () => {
        it('should apply the adapter', () => {
            myBuilder.add(new DevtoolAdapter());

            const webpackConfig = myBuilder.build();

            expect(webpackConfig).toEqual({
                devtool: 'inline-source-map',
            });
        });
    });

    describe('With multiple adapters added', () => {
        it('should apply all of them', () => {
            myBuilder
                .add(new DevtoolAdapter())
                .add(new EntryAdapter('./../app.js'));

            const webpackConfig = myBuilder.build();

            expect(webpackConfig).toEqual({
                entry: './../app.js',
                devtool: 'inline-source-map',
            });
        });
    });

    describe('With initial state applied', () => {
        it('should apply the adapters on top of the already present webpack configuration', () => {
            const builder = new Builder(
                {},
                {
                    entry: './src/js/test.js',
                }
            );

            builder.add(new DevtoolAdapter());

            const webpackConfig = builder.build();

            expect(webpackConfig).toEqual({
                entry: './src/js/test.js',
                devtool: 'inline-source-map',
            });
        });
    });
});
