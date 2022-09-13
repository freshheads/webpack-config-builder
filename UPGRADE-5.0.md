# Upgrade from 4.x to 5.x

This should be straight forward, it is there to safely allow to bump the build dependencies.
It does drop support for node 12, we now require a minimum of node 14.

1. First upgrade to the latest major versions with the following command:

```
npm install css-minimizer-webpack-plugin@4 css-loader@6 mini-css-extract-plugin@2 postcss-loader@7 sass-loader@13 copy-webpack-plugin@11 resolve-url-loader@5
```

2. After this run webpack and it will hint you for potential minor versions that should be upgraded.
3. Check at least the following release guides if it contains any breaking changes or recommendations for your code:

-   [mini-css-extract-plugin 2.x](https://github.com/webpack-contrib/mini-css-extract-plugin/releases/tag/v2.0.0)
    -   recommendation: set publicOutputPath to auto in webpack.config.js when not using a CDN. Or remove it as this is the default.
    -   More info on this can be found in the [webpack docs](https://webpack.js.org/configuration/output/#outputpublicpath)
-   [css-loader 6.x](https://github.com/webpack-contrib/css-loader/releases/tag/v6.0.0)
    -   recommendation: remove ~ from app.scss when importing from packages

4. When creating classnames with `createClassNameGeneratorForCSSLoader` replace this with a setting documented in the readme.
