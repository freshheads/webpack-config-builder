import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';

type NextCallback = () => void;

export interface Adapter {
    apply: (
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) => void;
}
