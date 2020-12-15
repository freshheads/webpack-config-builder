import BaseWatchOptionsAdapter, { WatchOptions } from '../WatchOptionsAdapter';

const DEFAULT_CONFIG: WatchOptions = {
    ignored: /node_modules/,
    poll: true,
};

export default class WatchOptionsAdapter extends BaseWatchOptionsAdapter {
    constructor(config: Partial<WatchOptions> = {}) {
        const combinedConfig = { ...DEFAULT_CONFIG, ...config };

        super(combinedConfig);
    }
}
