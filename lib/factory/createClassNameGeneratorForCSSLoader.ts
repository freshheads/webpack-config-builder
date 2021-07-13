import { BuilderConfig, Environment } from '../Builder';
import path from 'path';
import loaderUtils from 'loader-utils';

/**
 * Create a hash based on a the file location and class name. Will be unique across a project, and close to globally
 * unique.
 */
const determineUniqueFileHash = (
    context: any,
    localName: string,
    maxLength?: number
) => {
    const relativePath: string =
        path.posix.relative(context.rootContext, context.resourcePath) +
        localName;

    const hashBuffer = Buffer.from(relativePath, 'utf8');

    return loaderUtils.getHashDigest(hashBuffer, 'md5', 'base64', maxLength);
};

/**
 * Builds-up a new class name with the name of the module, sub-class and a hash incorporated.
 */
const determineClassName = (context: any, localName: string, options: any) => {
    const hash = determineUniqueFileHash(context, localName, 5);

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
const createClassNameGeneratorForCSSLoader =
    (builderConfig: BuilderConfig) =>
    (
        context: any,
        _localIdentName: any,
        localName: string,
        options: any
    ): string | void => {
        const fileBaseName = path.basename(context.resourcePath);

        // make sure custom classNames are only used for css modules otherwise global css will
        // get changed too, but will not match the class names supplied in the HTML.
        if (!determineFileIsCSSOrSCSSModule(fileBaseName)) {
            return localName;
        }

        // only use in dev environment, as it is only useful there to distinguish between
        // generated class names. In prod we return a unique hash.
        if (builderConfig.env !== Environment.Dev) {
            return determineUniqueFileHash(context, localName);
        }

        return determineClassName(context, localName, options);
    };

export default createClassNameGeneratorForCSSLoader;
