import BaseWatchOptionsAdapter from '../WatchOptionsAdapter';
import { Options } from 'webpack';

const DEFAULT_CONFIG: Options.WatchOptions = {
    ignored: /node_modules/,
    poll: true,
};

export default class WatchOptionsAdapter extends BaseWatchOptionsAdapter {
    constructor(config: Partial<Options.WatchOptions> = {}) {
        const combinedConfig = { ...DEFAULT_CONFIG, ...config };

        super(combinedConfig);
    }
}
