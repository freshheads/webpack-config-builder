import { Configuration } from 'webpack';

export function checkPluginInstanceIsInWebpackConfig(
    plugin: Function,
    webpackConfig: Configuration
): boolean {
    if (typeof webpackConfig.plugins === 'undefined') {
        return false;
    }

    const plugins = webpackConfig.plugins;

    return (
        plugins.findIndex((cursorPlugin) => cursorPlugin instanceof plugin) !==
        -1
    );
}
