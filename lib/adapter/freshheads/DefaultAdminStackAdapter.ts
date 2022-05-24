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
                '../../vendor/freshheads/admin-bundle/Resources/public/assets/node_modules'
            ),
        ],
        alias: {
            // be able to use the 'fhadmin' alias in scss and js files to prevent long paths to files
            fhadmin: path.resolve(
                process.cwd(),
                '../../vendor/freshheads/admin-bundle/Resources/public/assets/src'
            ),
            fhConfirm: path.resolve(
                process.cwd(),
                '../../vendor/freshheads/admin-bundle/Resources/public/assets/src/js/modules/jquery.fhConfirm'
            ),
            'jquery.ui.widget': path.resolve(
                process.cwd(),
                '../../vendor/freshheads/admin-bundle/Resources/public/assets/node_modules/jquery-ui/ui/widget'
            ),
            // use the jquery version that is defined in app
            jquery: path.resolve(process.cwd(), 'node_modules/jquery'),
        },
    },
    copyFilesToBuildDir: {
        enabled: true,
        // Copies assets from admin-bundle to build dir
        additionalPatterns: [
            {
                from: path.resolve(
                    process.cwd(),
                    '../../vendor/freshheads/admin-bundle/Resources/public/assets/images/**/*'
                ),
                context: path.resolve(
                    process.cwd(),
                    '../../vendor/freshheads/admin-bundle/Resources/public/assets/'
                ),
                // admin bundle assets always get hashed also in dev environment
                to: 'fhadmin/[path][name].[contenthash][ext]',
                toType: 'template',
            },
        ],
    },
    javascript: {
        enabled: true,
        babelConfig: {
            // include libs that need to transpile to es5
            include: [
                path.resolve(process.cwd(), 'src/js'),
                path.resolve(
                    process.cwd(),
                    '../../vendor/freshheads/admin-bundle/Resources/public/assets/src/js'
                ),
                path.resolve(
                    process.cwd(),
                    '../../vendor/freshheads/admin-bundle/Resources/public/assets/node_modules/countable/'
                ),
            ],
        },
        jQuery: {
            enabled: true,
        },
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
