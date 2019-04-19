const { Builder, EntryAdapter } = require('./../../build/index');

describe('EntryAdapter', () => {
    const builderConfig = { env: 'production' };

    describe('With an entry applied', () => {
        let adapter;

        beforeEach(() => {
            adapter = new EntryAdapter('./../app.js');
        });

        it('should be able to instantiate it', () => {
            expect(adapter instanceof EntryAdapter).toBe(true);
        });

        it('should add the entry to the supplied configuration file', () => {
            const config = {};

            adapter.apply(config, builderConfig, () => {});

            expect(config).toEqual({
                entry: './../app.js',
            });
        });
    });

    describe('When used with de builder', () => {
        describe('When called multiple times within the build profess', () => {
            let builder;

            beforeEach(() => {
                builder = new Builder(builderConfig);

                builder.add(new EntryAdapter('./../app.js'));
                builder.add(new EntryAdapter('./../app.scss'));
            });

            it('should throw an error', () => {
                const callback = () => {
                    const config = builder.build();

                    console.log('config', config);
                };

                expect(callback).toThrow(
                    'A webpack entry is already set. If set again, it will replace the previous one.'
                );
            });
        });
    });
});
