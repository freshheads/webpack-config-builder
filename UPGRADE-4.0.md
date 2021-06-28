# Upgrading from v3 to v4

## Delete unused packages and update packages to required minimal versions:

### Delete unused packages:

`npm uninstall terser-webpack-plugin cssnano file-loader clean-webpack-plugin`

### Update to required minimal versions:

`npm install @freshheads/webpack-config-builder@4 webpack@5 css-loader@5 mini-css-extract-plugin@1 webpack-stats-plugin@1 webpack-cli@4 postcss-loader@6 sass-loader@12 sass@1 @babel/preset-env@7 postcss@8 @babel/core@7 css-minimizer-webpack-plugin@3 -D`

## Other:

1. Replace 'dev' with 'development' in package.json scripts.
2. If you use **copy-webpack-plugin** the minimal required version is now v9.
3. Read the [migration guide](https://webpack.js.org/migrate/5/) supplied by Webpack. Some settings / best practices are still done at application level.
