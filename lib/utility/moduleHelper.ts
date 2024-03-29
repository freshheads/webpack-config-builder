import { execSync } from 'child_process';
import { gte as versionIsGreaterThanOrEqualTo } from 'semver';
import { warn, error } from './messageHelper';
import { Environment } from '../Builder';

type TInstalledModules = {
    [key: string]: string;
};

export function validateIfRequiredModuleIsInstalled(
    adapter: string,
    module: string,
    minVersion?: string
): void {
    // We don't validate modules in production build
    // Because it will break in NPM 6 (due changes in version of npm list command)
    if (process.env.NODE_ENV === Environment.Production) {
        return;
    }

    if (!checkIfModuleIsInstalled(module, minVersion)) {
        error(
            `Adapter '${adapter}' requires module '${module}' to be installed${
                minVersion ? ` with min version '${minVersion}'` : ''
            }.`
        );

        throw new Error(
            `when validating the required dependencies, please install ${module} >= '${minVersion}'`
        );
    }
}

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

function resolveListOfInstalledRootModules(): TInstalledModules {
    if (inMemoryCache) {
        return inMemoryCache;
    }

    // gets all dependencies (incl. dev) from package-lock.json, not from node_modules folder, as with NPM 7+ the node
    // modules might be stored in the root project node_modules folder and not in a child-project
    // in NPM 6 this command will only return the packages for the current environment (dev / prod)
    // so this is why we no longer validate during production builds to keep NPM 6 support for now
    const command = 'npm list --json --package-lock-only --depth=0';
    let commandOutput: string | null;

    try {
        commandOutput = execSync(command).toString();
    } catch (error) {
        warn(
            `Command '${command}' resulted in an error. Perhaps there are unmet peer dependencies?`
        );

        console.error(error);

        // prettier-ignore
        // @ts-expect-error of type unknown
        commandOutput = typeof error.stdout !== 'undefined' ? error.stdout.toString() : null;
    }

    if (!commandOutput) {
        return {};
    }

    const outputAsJson = JSON.parse(commandOutput);

    const dependencies = outputAsJson.dependencies;

    if (!dependencies) {
        throw new Error('Could not extract dependencies from stdout');
    }

    const filteredOutput: { [key: string]: string } = {};

    Object.keys(dependencies).forEach((module) => {
        filteredOutput[module] = dependencies[module].version;
    });

    inMemoryCache = filteredOutput;

    return filteredOutput;
}
