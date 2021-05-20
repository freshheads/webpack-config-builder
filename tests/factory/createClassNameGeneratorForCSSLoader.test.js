const { createClassNameGeneratorForCSSLoader } = require('./../../build/index');

describe('createClassNameGeneratorForCSSLoader()', () => {
    describe('When in the production environment', () => {
        const builderConfig = { env: 'production' };

        let generator;

        beforeEach(() => {
            generator = createClassNameGeneratorForCSSLoader(builderConfig);
        });

        describe('When generating a class name for a module', () => {
            it('should return undefined', () => {
                const generated = generator({
                    resourcePath: '/home/somewhere/test.module.scss',
                });

                expect(generated).toBeUndefined();
            });
        });

        describe('When generating a class name for a regular css class', () => {
            it('should return undefined', () => {
                const generated = generator({
                    resourcePath: '/home/somewhere/_variables.scss',
                });

                expect(generated).toBeUndefined();
            });
        });
    });

    describe('When in the develop environment', () => {
        const builderConfig = { env: 'dev' };

        let generator;

        beforeEach(() => {
            generator = createClassNameGeneratorForCSSLoader(builderConfig);
        });

        describe('When generating a class name for a CSS module', () => {
            it('should contain both the module and sub-class name in the generated class name', () => {
                const subClassName = 'isPrimary';
                const moduleName = 'test';

                const generated = generator(
                    {
                        resourcePath: `/home/somewhere/${moduleName}.module.css`,
                        rootContext: '/',
                    },
                    undefined,
                    subClassName,
                    {}
                );

                const result =
                    generated &&
                    generated.startsWith(`${moduleName}_${subClassName}__`, 0);

                expect(result).toBe(true);
            });
        });

        describe('When generating a class name for a SCSS module', () => {
            it('should contain both the module and sub-class name in the generated class name', () => {
                const subClassName = 'isPrimary';
                const moduleName = 'test';

                const generated = generator(
                    {
                        resourcePath: `/home/somewhere/${moduleName}.module.scss`,
                        rootContext: '/',
                    },
                    undefined,
                    subClassName,
                    {}
                );

                const result =
                    generated &&
                    generated.startsWith(`${moduleName}_${subClassName}__`, 0);

                expect(result).toBe(true);
            });
        });

        describe('When generating a class name for a global css class', () => {
            it('should return undefined', () => {
                const generated = generator(
                    {
                        resourcePath: '/home/somewhere/_variables.scss',
                    },
                    undefined,
                    'button--primary',
                    {}
                );

                expect(generated).toBeUndefined();
            });
        });
    });
});
