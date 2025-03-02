const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

const pkgName = 'torus'
const libraryName = pkgName.charAt(0).toUpperCase() + pkgName.slice(1)

const externals = ['@chaitanyapotti/random-id', 'fast-deep-equal', 'loglevel', 'deepmerge']

const { NODE_ENV = 'production' } = process.env

const baseConfig = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'production' ? false : 'source-map',
  entry: './index.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: libraryName,
    libraryExport: 'default',
  },
  resolve: {
    alias: {
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
      lodash: path.resolve(__dirname, 'node_modules/lodash'),
      'js-sha3': path.resolve(__dirname, 'node_modules/js-sha3'),
    },
  },
  module: {
    rules: [],
  },
}

const babelLoaderWithPolyfills = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
  },
}

const babelLoader = { ...babelLoaderWithPolyfills, use: { loader: 'babel-loader', options: { plugins: ['@babel/transform-runtime'] } } }

const umdPolyfilledConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.polyfill.umd.min.js`,
    libraryTarget: 'umd',
  },
  module: {
    rules: [babelLoaderWithPolyfills],
  },
}

const umdConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.umd.min.js`,
    libraryTarget: 'umd',
  },
  module: {
    rules: [babelLoader],
  },
}

const cjsConfig = {
  ...baseConfig,
  // ...optimization,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.cjs.js`,
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [babelLoader],
  },
  externals: [...externals, /^(@babel\/runtime)/i],
  plugins: [
    new ESLintPlugin({
      extensions: '.js',
    }),
  ],
}

module.exports = [umdPolyfilledConfig, umdConfig, cjsConfig]
// module.exports = [cjsConfig]

// V5
// experiments: {
//   outputModule: true
// }

// node: {
//   global: true,
// },
// resolve: {
//   alias: { crypto: 'crypto-browserify', stream: 'stream-browserify', vm: 'vm-browserify' },
//   aliasFields: ['browser'],
// },
