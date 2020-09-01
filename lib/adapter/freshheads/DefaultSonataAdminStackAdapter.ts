import DefaultStackAdapter, {
    Config as DefaultStackConfig,
} from './DefaultStackAdapter';
import deepmerge from 'deepmerge';
import path from 'path';
import { RecursivePartial } from '../../utility/types';
import { Configuration, ExternalsObjectElement } from 'webpack';
import { BuilderConfig } from '../../Builder';
import { NextCallback } from '../Adapter';

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
            'fhadmin': path.resolve(
                process.cwd(),
                '../../vendor/freshheads/admin-bundle/Resources/public/assets/src'
            ),
            'fhform': path.resolve(
                process.cwd(),
                '../../vendor/freshheads/form-bundle/Resources/public'
            ),
            'jquery-ui/ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js'
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
                to: 'fhadmin/[path][name].[hash].[ext]',
                toType: 'template',
            },
        ],
    },
    javascript: {
        enabled: true,
        babelConfig: {
            include: [
                path.resolve(process.cwd(), 'src/js'),
                path.resolve(
                    process.cwd(),
                    '../../vendor/freshheads/admin-bundle/Resources/public/assets/src/js'
                ),
            ],
        },
    },
};

export default class DefaultSonataAdminStackAdapter extends DefaultStackAdapter {
    constructor(config: RecursivePartial<DefaultStackConfig> = {}) {
        const configCombinedWithAdminDefaults = deepmerge<
            RecursivePartial<DefaultStackConfig>
        >(DEFAULT_CONFIG, config, {
            arrayMerge: (_destinationArray, sourceArray) => sourceArray,
        });

        super(configCombinedWithAdminDefaults);
    }


    apply(webpackConfig: Configuration, builderConfig: BuilderConfig, next: NextCallback) {
        super.apply(webpackConfig, builderConfig, next);

        // Use external jQuery from Sonata
        webpackConfig.externals = {
            ...webpackConfig.externals as ExternalsObjectElement || {},
            jquery: 'jQuery'
        };
    }
}
