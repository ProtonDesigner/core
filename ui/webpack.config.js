const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

var config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  devtool: "source-map",
  // devServer: {
  //   port: 9000,
  //   static: {
  //     directory: path.join(__dirname)
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new MonacoWebpackPlugin()
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
        fs: false,
        child_process: false,
        crypto: false,
        url: false,
    },
  },
  experiments: {
    topLevelAwait: true
  }
};

module.exports = (env, argv) => {
  let plugins = []
  if (argv.mode === "development") {
    config.optimization.minimize = false;
    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify("development"),
        },
      }),
    )
  } else {
    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify("production"),
        },
      }),
    )
  }

  plugins.push(new NodePolyfillPlugin())

  return config;
}
