const { Builder, DevtoolAdapter } = require('./../../build/index');

describe('DevtoolAdapter', () => {
    const builderConfig = { env: 'production' };

    describe('Without any configuration', () => {
        let adapter = null;

        beforeEach(() => {
            adapter = new DevtoolAdapter();
        });

        it('should instantiate it', () => {
            expect(adapter instanceof DevtoolAdapter).toBe(true);
        });

        it('should output the default type', () => {
            const config = {};

            adapter.apply(config, builderConfig, () => {});

            expect(config).toEqual({
                devtool: 'inline-source-map',
            });
        });
    });

    describe('With alternate configuration', () => {
        let adapter = null;

        beforeEach(() => {
            adapter = new DevtoolAdapter('source-map');
        });

        it('should apply the set type', () => {
            const config = {};

            adapter.apply(config, builderConfig, () => {});

            expect(config).toEqual({
                devtool: 'source-map',
            });
        });
    });

    describe('When applied with a builder', () => {
        describe('...and added twice', () => {
            it('should log a warning', () => {
                const builder = new Builder(builderConfig);

                builder.add(new DevtoolAdapter());
                builder.add(new DevtoolAdapter('source-map'));

                builder.build();

                jest.spyOn(global.console, 'warn');
            });
        });
    });
});
