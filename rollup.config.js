import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import svgr from '@svgr/rollup'

export default {
  input: "src/index.js",
  output: [
    {
      file: 'dist/index.es.js',
      format: 'esm',
      exports: 'named',
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: 'bundle.js',
      format: 'cjs',
    },
  ],
  external: [
    /^@babel.*/,
    /^@date-io\/.*/,
    /^@material-ui\/.*/,
    /^@openimis.*/,
    "classnames",
    "clsx",
    "history",
    /^lodash.*/,
    "moment",
    "prop-types",
    /^react.*/,
    /^redux.*/,
    '@openimis/fe-core',
  ],
  plugins: [
    json(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "runtime",
    }),
    svgr(),
  ],
};
