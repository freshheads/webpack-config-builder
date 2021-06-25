import { BuilderConfig, Environment } from '../Builder';
import path from 'path';
import loaderUtils from 'loader-utils';
import webpack from 'webpack';
import LoaderContext = webpack.loader.LoaderContext;

/**
 * Create a hash based on a the file location and class name. Will be unique across a project, and close to globally
 * unique.
 */
const determineUniqueFileHash = (context: LoaderContext, localName: string) => {
    const relativePath: string =
        path.posix.relative(context.rootContext, context.resourcePath) +
        localName;

    const hashBuffer = Buffer.from(relativePath, 'utf8');

    return loaderUtils.getHashDigest(hashBuffer, 'md5', 'base64', 5);
};

/**
 * Builds-up a new class name with the name of the module, sub-class and a hash incorporated.
 */
const determineClassName = (
    context: LoaderContext,
    localName: string,
    options: any
) => {
    const hash = determineUniqueFileHash(context, localName);

    const className = loaderUtils.interpolateName(
        context,
        `[name]_${localName}__${hash}`,
        options
    );

    // Remove the .module that appears in every classname when based on the file and replace all "." with "_".
    return className.replace('.module_', '_').replace(/\./g, '_');
};

const determineFileIsCSSOrSCSSModule = (fileBaseName: string): boolean =>
    /\.module\.s?css$/.test(fileBaseName);

/**
 * @see https://github.com/webpack-contrib/css-loader/blob/bb2a6495dd6e52fbc5585c74f967032ac6e7ce52/README.md#getlocalident
 *
 * Temporary solution until a better solution is available that makes it no longer required to have to load
 * the `css-loader` loader twice, with possible different configurations.
 *
 * @see https://github.com/webpack-contrib/css-loader/issues/1307
 */
const createClassNameGeneratorForCSSLoader = (builderConfig: BuilderConfig) => (
    context: LoaderContext,
    _localIdentName: any,
    localName: string,
    options: any
): string | void => {
    // only use in dev environment, as it is only useful there to distinguish between
    // generated class names
    if (builderConfig.env !== Environment.Dev) {
        return;
    }

    const fileBaseName = path.basename(context.resourcePath);

    // make sure custom classNames are only used for css modules otherwise global css will
    // get changed too, but will not match the class names supplied in the HTML.
    if (!determineFileIsCSSOrSCSSModule(fileBaseName)) {
        // when returning undefined, the regular class generation method for css-loader will be used

        return;
    }

    return determineClassName(context, localName, options);
};

export default createClassNameGeneratorForCSSLoader;
