import { Configuration } from 'webpack';
import { BuilderConfig } from '../Builder';

export type NextCallback = () => void;

export interface Adapter {
    apply: (
        webpackConfig: Configuration,
        builderConfig: BuilderConfig,
        next: NextCallback
    ) => void;
}
