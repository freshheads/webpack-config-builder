import { Resolve } from 'webpack';
import path from 'path';
import BaseResolveAdapter from '../ResolveAdapter';
import deepmerge from 'deepmerge';

export const DEFAULT_CONFIG: Resolve = {
    modules: [path.resolve(process.cwd(), 'node_modules')],
    extensions: ['.js', '.jsx', '.json'],
};

export default class ResolveAdapter extends BaseResolveAdapter {
    constructor(config: Partial<Resolve> = {}) {
        const combinedConfig = deepmerge<Resolve>(DEFAULT_CONFIG, config, {
            arrayMerge: (_destinationArray, sourceArray) => sourceArray,
        });

        super(combinedConfig);
    }
}
