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
            it('should throw an error', () => {
                const builder = new Builder(builderConfig);

                builder.add(new TargetAdapter('web'));
                builder.add(new TargetAdapter('node'));

                const callback = () => {
                    builder.build();
                };

                expect(callback).toThrow(
                    'A webpack target is already set. If set again, it will replace the previous one.'
                );
            });
        });
    });
});
