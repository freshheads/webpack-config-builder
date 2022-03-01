import { ResolveOptions } from 'webpack';
import BaseResolveAdapter from '../ResolveAdapter';
import deepmerge from 'deepmerge';

/**
 * Using a relative path here, instead of an absolute path. Webpack will not resolve node modules back the
 * directory tree when not found in this folder, unless the path is relative. In NPM 7, using workspaces, node
 * modules are stored in the root project instead of the workspace!
 *
 * @see https://webpack.js.org/configuration/resolve/#resolvemodules
 */
const nodeModulesFolder = 'node_modules';

export const DEFAULT_CONFIG: ResolveOptions = {
    modules: [nodeModulesFolder],
    extensions: ['.js', '.jsx', '.json'],
};

export default class ResolveAdapter extends BaseResolveAdapter {
    constructor(config: Partial<ResolveOptions> = {}) {
        const combinedConfig = deepmerge<ResolveOptions>(
            DEFAULT_CONFIG,
            config,
            {
                arrayMerge: (_destinationArray, sourceArray) => sourceArray,
            }
        );

        super(combinedConfig);
    }
}
