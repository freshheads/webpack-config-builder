# webpack-config-builder

Uses an adapter pattern to build webpack configurations. This makes it possible for teams to create and maintain their base webpack setup and be able to update it from a central git repo, instead of having to change every project individually.

**Example:**

```javascript
// webpack.config.js

const {
    Builder,
    FreshheadsDefaultDevtoolAdapter: DevtoolAdapter,
    FreshheadsDefaultOutputAdapter: OutputAdapter,
    ResolveAdapter,
    EntryAdapter,
    TargetAdapter,
    ModeAdapter,
    WatchOptionsAdapter,
} = require('@freshheads/webpack-config-builder');

const nodeEnv = process.env.NODE_ENV || 'production';
const isProduction = nodeEnv === 'production';

const builder = new Builder({
    env: nodeEnv,
});

builder
    .add(
        new EntryAdapter({
            app: [
                path.resolve(__dirname, 'src/scss/app.scss'),
                path.resolve(__dirname, 'src/js/index.tsx'),
            ],
            legacy: [
                path.resolve(__dirname, './src/scss/legacy/app.scss'),
                path.resolve(__dirname, 'src/js/legacy/app.js'),
            ],
            picturefill: [
                path.resolve(__dirname, 'src/js/legacy/picturefill.js'),
            ],
        })
    )
    .add(new TargetAdapter('web'))
    .add(new ModeAdapter(isProduction ? 'production' : 'development'))
    .add(new DevtoolAdapter())
    .add(new OutputAdapter(outputPath, '/assets/frontend/build'))
    .add(
        new ResolveAdapter({
            modules: [path.resolve(__dirname, 'node_modules')],
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        })
    )
    .add(
        new WatchOptionsAdapter({
            ignored: /node_modules/,
            poll: true,
        })
    );

const config = builder.build();

module.exports = config;
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

Make sure that files are build first, as the tests are executed on them, to make sure that these are correct.
