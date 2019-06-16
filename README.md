# Webpack config builder

Uses an adapter pattern to build webpack configurations. This makes it possible for teams to create and maintain their base webpack setup and be able to update it from a central git repo, instead of having to change every project individually.

## Documentation

-   [Installation](#installation)
-   [Configuration](#configuration)
-   [API](#api)
-   [Adapters](#adapters)
-   [Development](#development)

## Installation

As expected:

```bash
npm install @freshheads/webpack-config-builder --save-dev
```

## Configuration

Example:

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

const builder = new Builder({
    env: nodeEnv,
});

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
            typescript: {
                enabled: true,
            },
        })
    );

module.exports = builder.build();
```

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

### Types

Also see Typescript definitions in the [repository](https://github.com/freshheads/webpack-config-builder).

```typescript
export enum Environment {
    Dev = 'dev',
    Production = 'production',
}

type BuilderConfig {
    env: Environment;
}
```

## Adapters

### General

For the general adapters, see the [Webpack documentation](https://webpack.js.org/configuration). They should be pretty easy to apply as each adapter represents an entry key of the webpack config.

### Freshheads defaults

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

Make sure that files are build first, as the tests are executed on them, to make sure that these are correct.
