import { OptimizationAdapter } from '../..';
import { Adapter } from '../Adapter';
import { Options } from 'webpack';
import deepmerge from 'deepmerge';

export default class DefaultOptimizationAdapter extends OptimizationAdapter
    implements Adapter {
    constructor(config: Options.Optimization = {}) {
        const configWithDefaults: Options.Optimization = deepmerge({
            splitChunks: {
                automaticNameDelimiter: '-',
            }}, config);

        super(configWithDefaults);
    }
}
