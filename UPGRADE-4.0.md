# Upgrading from v3 to v4

## Delete unused packages and update packages to required minimal versions:

### Delete unused packages:

`npm uninstall terser-webpack-plugin cssnano file-loader clean-webpack-plugin`

### Update to required minimal versions:

`npm install @freshheads/webpack-config-builder@4 webpack@5 css-loader@5 mini-css-extract-plugin@1 webpack-stats-plugin@1 webpack-cli@4 postcss-loader@6 sass-loader@12 sass@1 @babel/preset-env@7 postcss@8 @babel/core@7 css-minimizer-webpack-plugin@3 -D`

## Other:

1. Replace 'dev' with 'development' in package.json scripts.
2. If you use **copy-webpack-plugin** the minimal required version is now v9.
3. loadReferencedFileAdaptor no longer has a `test` config for image/font assets. It's now possible to add `additionalAssetRules` which give more control over the way the [asset module](https://webpack.js.org/guides/asset-modules/) is loaded. This gives you the option to make rules for different asset types of overwrite one like .svg in this example.

usage with DefaultStackAdapter:

```
loadReferencedFiles: {
    enabled: true,
    additionalAssetRules: [
        {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        },
    ],
},
```

or

```
builder.add(
    new LoadReferencedFilesAdapter([
        {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        },
    ])
);
```

4. Read the [migration guide](https://webpack.js.org/migrate/5/) supplied by Webpack. Some settings / best practices are still done at application level.
