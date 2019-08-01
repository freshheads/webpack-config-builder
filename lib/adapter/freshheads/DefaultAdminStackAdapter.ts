import DefaultStackAdapter, {
    Config as DefaultStackConfig,
} from './DefaultStackAdapter';
import deepmerge from 'deepmerge';
import path from 'path';
import { RecursivePartial } from '../../utility/types';

const DEFAULT_CONFIG: RecursivePartial<DefaultStackConfig> = {
    resolve: {
        modules: [
            path.resolve(process.cwd(), 'node_modules'),

            // also resolve packages in node_modules folder of fhAdminBundle as the admin defaults are installed there
            path.resolve(
                process.cwd(),
                '../../web/bundles/fhadmin/assets/node_modules'
            ),
        ],
        alias: {
            // be able to use the 'fhadmin' alias in scss and js files to prevent long paths to files
            fhadmin: path.resolve(
                process.cwd(),
                '../../web/bundles/fhadmin/assets/src'
            ),
        },
    },
    copyFilesToBuildDir: {
        enabled: true,
        additionalPatterns: [
            {
                from: {
                    glob: path.resolve(
                        process.cwd(),
                        'web/bundles/fhadmin/assets/images/**/*'
                    ),
                },
                context: process.cwd(),
            },
        ],
    },
    sass: {
        enabled: true,
    },
    javascript: {
        enabled: true,
    },
};

export default class DefaultAdminStackAdapter extends DefaultStackAdapter {
    constructor(config: RecursivePartial<DefaultStackConfig> = {}) {
        const configCombinedWithAdminDefaults = deepmerge<
            RecursivePartial<DefaultStackConfig>
        >(DEFAULT_CONFIG, config, {
            arrayMerge: (_destinationArray, sourceArray) => sourceArray,
        });

        super(configCombinedWithAdminDefaults);
    }
}
