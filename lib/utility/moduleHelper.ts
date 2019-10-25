import { execSync } from 'child_process';
import { gte as versionIsGreaterThanOrEqualTo } from 'semver';

type TInstalledModules = {
    [key: string]: string;
};

export function checkIfModuleIsInstalled(
    module: string,
    minVersion?: string
): boolean {
    const installedModules = resolveListOfInstalledRootModules();

    const moduleIsInstalled = typeof installedModules[module] !== 'undefined';

    if (!moduleIsInstalled) {
        return false;
    }

    if (minVersion) {
        const installedVersion = installedModules[module];

        return versionIsGreaterThanOrEqualTo(installedVersion, minVersion);
    }

    return true;
}

let inMemoryCache: TInstalledModules | null = null;

function resolveListOfInstalledRootModules() {
    if (inMemoryCache) {
        return inMemoryCache;
    }

    const stdout = execSync('npm list --json --depth=0');

    const outputAsJson = JSON.parse(stdout.toString());

    const dependencies = outputAsJson.dependencies;

    if (!dependencies) {
        throw new Error('Could not extract dependencies from stdout');
    }

    const filteredOutput: { [key: string]: string } = {};

    Object.keys(dependencies).forEach(module => {
        filteredOutput[module] = dependencies[module].version;
    });

    inMemoryCache = filteredOutput;

    return filteredOutput;
}
