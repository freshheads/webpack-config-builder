import { ResolveOptions } from 'webpack';
import path from 'path';
import BaseResolveAdapter from '../ResolveAdapter';
import deepmerge from 'deepmerge';

export const DEFAULT_CONFIG: ResolveOptions = {
    modules: [path.resolve(process.cwd(), 'node_modules')],
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
