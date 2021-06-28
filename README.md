# Webpack config builder

Uses an adapter pattern to build webpack configurations. This makes it possible for teams to create and maintain their base webpack setup and be able to update it from a central git repo, instead of having to change every project individually.

## Documentation

-   [Installation](#installation)
-   [Configuration](#configuration)
-   [API](#api)
-   [Development](#development)

## Installation

As expected:

```bash
npm install @freshheads/webpack-config-builder --save-dev
```

## Configuration

For development of [Freshheads](https://www.freshheads.com/) projects, it is sensible to start with a default stack adapter. Any change in configuration that is required for your specific project, and differs from the default stack, can be easily applied to the webpack configuration afterwards.

### Start with default stack

_Example:_

```javascript
// webpack.config.js

const {
    Builder,

    // general adapters
    ResolveAdapter,
    EntryAdapter,
    TargetAdapter,
    ModeAdapter,
    WatchOptionsAdapter,

    // Freshheads specific adapters, that contains your re-usable (in this case Freshheads) defaults
    FreshheadsDefaultStackAdapter: DefaultStackAdapter,
} = require('@freshheads/webpack-config-builder');

const path = require('path');
const outputPath = path.resolve(__dirname, 'build');
const nodeEnv = process.env.NODE_ENV || 'production';
const isProduction = nodeEnv !== 'dev';

const builderConfig = {
    env: nodeEnv,
};
const builder = new Builder(builderConfig);

builder
    .add(
        new EntryAdapter({
            app: [
                path.resolve(__dirname, 'src/scss/app.scss'),
                path.resolve(__dirname, 'src/js/app.tsx'),
            ],
        })
    )
    .add(new OutputAdapter(outputPath, '/assets/frontend/build'))
    .add(
        new DefaultStackAdapter({
            javascript: {
                enabled: true,
                typescript: true,
            },
        })
    );

const config = builder.build();

module.exports = config;
```

**Tip!** Use node's [`utils.inspect`](https://nodejs.org/api/util.html#util_util_inspect_object_options) for easy inspecting of the output of `builder.build`:

```javascript
const config = builder.build();

console.log(
    require('util').inspect(config, { showHidden: false, depth: null })
);
```

### Project-specific finetuning

The default stack adapters allow for a lot of finetuning using configuration. Hoewever sometimes that is not enough and we need to make additional changes for our project.

The `builder.build()` command outputs a configuration object that can be feeded to `webpack`. However it is also possible for you to modify it before you feed it to 'the beast'. You can do this by:

1.  modifying the configuration manually afterwards. i.e.:

    ```javascript
    const config = builder.build();

    config.module.rules.unshift({
        test: /\.svg$/,
        issuer: {
            test: /.js?$/,
        },
        use: ['@svgr/webpack'],
    });
    ```

2.  writing a (project) specific adapter to apply the changes and add it to the build chain:

    ```javascript
    builder
        ...
        .add(new DefaultStackAdapter({ ... })
        .add(new MyCustomAdapter({ ... })
    ```

    Add it at the point in the build chain where you require it to be, and make sure it implements the required [`Adapter`](https://github.com/freshheads/webpack-config-builder/blob/master/lib/adapter/Adapter.d.ts) interface, otherwise it will probably not work as expected.

3.  instead of finetuning or removing already applied configuration, make sure they the correct changes are applied in the first place. The [`DefaultStackAdapter`](https://github.com/freshheads/webpack-config-builder/blob/master/lib/adapter/freshheads/DefaultStackAdapter.ts) and many adapters are in fact convenience collections of other, smaller adapters that you can also apply seperately for finegrained configuration creation. I.e.:

    ```javascript
    builder
        ...
    //    .add(new DefaultStackAdapter({ ... }))
        .add(new TargetAdapter('web'))
        .add(new ModeAdapter(isProduction ? 'production' : 'development'))
        .add(new ResolveAdapter())
        .add(new SourcemapAdapter())
        .add(new DefineEnvironmentVariablesAdapter())
        .add(new WatchOptionsAdapter())
        .add(
            new OptimizationAdapter({
                splitChunks: {
                    automaticNameDelimiter: '-',
                },
            })
        )
    ```

    Look into the source code for more information of the possibilities.

## API

### Builder

Instantiation:

| Parameter       | Required | Default                 | Description                                                                    |
| --------------- | -------- | ----------------------- | ------------------------------------------------------------------------------ |
| `builderConfig` | `false`  | `{ env: 'production' }` | Configuration for the builder. See [description](#types)                       |
| `webpackConfig` | `fase`   | `{}`                    | Initial state of the webpack configuration. Leave empty to start from scratch. |

Methods:

| Name                             | Description                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `add(adapter: Adapter): Builder` | Adds an adapter to the builder, and adds it to the queue of to be executed adapters.                                                    |
| `build()`                        | Executes all with `add()` added adapters, and executes them one by one, passing in the webpack configuration and builder configuration. |

### Adapters

For the general, finegrained adapters, see the [Webpack documentation](https://webpack.js.org/configuration). They should be pretty easy to apply as each adapter represents an entry key of the webpack config.

The adapters in the [`./freshheads`](https://github.com/freshheads/webpack-config-builder/tree/master/lib/adapter/freshheads) folder of the repository are [Freshheads](https://www.freshheads.com/) specific, and serve as examples and project startup setups.

### Utility functions

-   **`createClassNameGeneratorForCSSLoader()`**

    When using (S)CSS modules, by default the outputted class name for (S)CSS modules in your HTML, is a hash. This is not very helpful when you are debugging in the browser and are trying to resolve a class name. You can supply this class name generator to the `CSSAdapter` to prepend the generated class name with the module name and sub-class. (i.e. `button_isPrimary_xD3kS` instead of `xD3kS`). The `builderConfig`, that contains the current environment, needs to be supplied to make sure that it is only applied in the dev environment.

    ```js
    const builderConfig = {
        env: nodeEnv,
    };

    $builder = new Builder(builderConfig);

    // ...

    new DefaultStackAdapter({
        css: {
            enabled: true,
            cssLoaderOptions: {
                modules: {
                    getLocalIdent:
                        createClassNameGeneratorForCSSLoader(builderConfig),
                },
            },
        },
    });
    ```

    or

    ```js
    new CSSAdapter({
        modules: {
            getLocalIdent: createClassNameGeneratorForCSSLoader(builderConfig),
        },
    });
    ```

## Development

Install dependencies:

```bash
npm install
```

Build javascript files:

```bash
npm run build
```

(or in watch mode, run: `npm run build:watch`)

Watch for test results:

```bash
npm run test:watch
```

Make sure that files are build first, as the tests are executed on the build files, to make sure that these are correct.
