const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/assets/js/app.js',

  output: {
    filename: 'assets/[name].[chunkhash:7].js',
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(['./public/']),

    new ExtractTextPlugin('assets/styles.[contenthash:7].css'),

    new HtmlWebpackPlugin({
      inlineSource: '.css$',
      minify: (process.env.NODE_ENV === 'production') ? { collapseWhitespace: true } : false,
      template: 'src/index.html',
      favicon: 'src/favicon.ico',
      excludeAssets: [/main.*.js/],
    }),

    new HtmlWebpackExcludeAssetsPlugin(),

    new HtmlWebpackInlineSourcePlugin(),

    new CopyWebpackPlugin([
      { from: 'src/google*.html', to: '[name].[ext]' },
      { from: 'src/_redirects', to: '[name].[ext]' },
    ]),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: process.env.NODE_ENV !== 'production',
                minimize: process.env.NODE_ENV === 'production',
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: process.env.NODE_ENV !== 'production',
              },
            },
          ],
        }),
      }
    ],
  },
}
