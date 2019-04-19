import { OptimizationAdapter } from '../..';
import { Adapter } from '../Adapter';
import { Options } from 'webpack';

export default class DefaultOptimizationAdapter extends OptimizationAdapter
    implements Adapter {
    constructor(config: Options.Optimization = {}) {
        const configWithDefaults: Options.Optimization = {
            splitChunks: {
                automaticNameDelimiter: '-',
            },
            ...config,
        };

        super(configWithDefaults);
    }
}
