const { Builder, TargetAdapter } = require('./../../build/index');

describe('TargetAdapter', () => {
    const builderConfig = { env: 'production' };

    describe('With a target supplied', () => {
        let adapter;

        beforeEach(() => {
            adapter = new TargetAdapter('node');
        });

        it('should set the other target', () => {
            const config = {};

            adapter.apply(config, builderConfig, () => {});

            expect(config).toEqual({
                target: 'node',
            });
        });
    });

    describe('When applied within a builder', () => {
        describe('..and applied twice', () => {
            it('should log a warning', () => {
                const builder = new Builder(builderConfig);

                builder.add(new TargetAdapter('web'));
                builder.add(new TargetAdapter('node'));

                builder.build();

                jest.spyOn(global.console, 'warn');
            });
        });
    });
});
