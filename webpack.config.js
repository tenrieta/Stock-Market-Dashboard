const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const eslintOptions = {
  extensions: ["js", "jsx"],
  exclude: ["/node_modules/", "/.husky/"],
};

const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  mode: !isProduction ? "development" : "production",
  entry: path.resolve(__dirname, "./src/index.jsx"),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [
                !isProduction && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    !isProduction && new ReactRefreshWebpackPlugin(),
    new ESLintPlugin(eslintOptions),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Stock Market Dashboard",
      template: path.resolve(__dirname, "./src/index.html"),
    }),
    new Dotenv(),
  ].filter(Boolean),
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    publicPath: !isProduction ? "/" : "/stock-market-dashboard/", // necessary to make react-router-dom subpages work on refresh
  },
  devServer: {
    static: path.resolve(__dirname, "./build"),
    historyApiFallback: true, // necessary to make react-router-dom subpages work on refresh
  },
  devtool: "source-map",
};
