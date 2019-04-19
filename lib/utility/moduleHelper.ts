import detectInstalled from 'detect-installed';

export function checkIfModuleIsInstalled(module: string): boolean {
    return detectInstalled.sync(module, {
        local: true,
    });
}
