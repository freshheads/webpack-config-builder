# Upgrading from v3 to v4

## Packages verwijderen en installeren:

### Deleten ongebruikte packages:
`npm uninstall terser-webpack-plugin cssnano fileloader`

### Install laatste minimale versies:
`npm install @freshheads/webpack-config-builder@4 webpack@5 css-loader@5 mini-css-extract-plugin@1 webpack-stats-plugin@1 webpack-cli@4 postcss-loader@6 sass-loader@12 sass@1 @babel/preset-env@7 postcss@8 @babel/core@7 css-minimizer-webpack-plugin@3 -D`

## Overig:

1. Pas in package.json scripts dev aan naar development bij env. 
2. Als je de **copy-webpack-plugin** gebruikt is de minimale versie nu 9
