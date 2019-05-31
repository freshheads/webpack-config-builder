import { OptimizationAdapter as GlobalOptimizationAdapter } from '../..';
import { Adapter } from '../Adapter';
import { Options } from 'webpack';
import deepmerge from 'deepmerge';

export default class OptimizationAdapter extends GlobalOptimizationAdapter
    implements Adapter {
    constructor(config: Options.Optimization = {}) {
        const configWithDefaults: Options.Optimization = deepmerge<
            Options.Optimization
        >(
            {
                splitChunks: {
                    automaticNameDelimiter: '-',
                },
            },
            config
        );

        super(configWithDefaults);
    }
}
