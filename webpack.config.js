const path = require("path");
const RenameAssetPlugin = require('./utils/rename-asset-plugin');
const { WatchIgnorePlugin } = require('webpack');

exports.default = {
  mode: "production",
  // devtool: "inline-source-map",
  entry: {
    "google-adapter": './packages/google-adapter/src/index.ts',
    "youtube-adapter": './packages/youtube-adapter/src/index.ts',
    "search-dapplet": './packages/search-dapplet/src/index.ts'
  },
  output: {
    path: path.join(__dirname, 'packages'),
    filename: '[name]/build/index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.ts$/,
      use: "ts-loader"
    },
    {
      test: /\.(png|jp(e*)g|svg|html)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 512 * 1024 // Convert images < 512kb to base64 strings
        }
      }]
    }
    ]
  },
  devServer: {
    port: 3001,
    https: true,
    writeToDisk: true,
    hot: false,
    inline: false,
    liveReload: false,
    open: false
  },
  plugins: [
    new WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    new RenameAssetPlugin(x => (x.indexOf('.d.ts') !== -1) ? x.replace('src', 'build') : x)
  ],
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "timers": false, // require.resolve("timers-browserify"),
      "buffer": false, // require.resolve("buffer-browserify"),
      "assert": false, // require.resolve("assert-browserify"),
      "http": false, // require.resolve("stream-http"),
      "https": false, // require.resolve("https-browserify"),
    }
  }
}