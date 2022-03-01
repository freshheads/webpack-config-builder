const {
    checkIfModuleIsInstalled,
} = require('./../../build/utility/moduleHelper');

describe('moduleHelper', () => {
    describe('::checkIfModuleIsInstalled()', () => {
        describe('When applied on an installed module', () => {
            describe('..regular dependency', () => {
                it('returns true', () => {
                    const result = checkIfModuleIsInstalled('deepmerge');

                    expect(result).toBe(true);
                });
            });

            describe('..dev dependency without a version', () => {
                it('returns true', () => {
                    const result = checkIfModuleIsInstalled('webpack');

                    expect(result).toBe(true);
                });
            });

            describe('..with a version', () => {
                describe('..that is installed exactly', () => {
                    it('returns true', () => {
                        const result = checkIfModuleIsInstalled(
                            'webpack',
                            '4.39.1'
                        );

                        expect(result).toBe(true);
                    });
                });

                describe('..that is above the minimum required', () => {
                    it('returns true', () => {
                        const result = checkIfModuleIsInstalled(
                            'webpack',
                            '4.38.0'
                        );

                        expect(result).toBe(true);
                    });
                });

                describe('..that is below the minimum required', () => {
                    it('returns false', () => {
                        const result = checkIfModuleIsInstalled(
                            'webpack',
                            '155.12.0'
                        );

                        expect(result).toBe(false);
                    });
                });
            });
        });

        describe('When applied on an not-installed module', () => {
            it('returns false', () => {
                const result = checkIfModuleIsInstalled('non-existant');

                expect(result).toBe(false);
            });
        });
    });
});
