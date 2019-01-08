const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const env = process.env.NODE_ENV;
const minify = env === 'production';
const sourceMap = env === 'development';

const config = {
  mode: env,

  entry: './src/assets/js/app.js',

  output: {
    filename: 'assets/[name].[chunkhash:7].js',
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(['./public/']),

    new MiniCssExtractPlugin({ filename: 'assets/styles.[hash:7].css' }),

    new HtmlWebpackPlugin({
      inlineSource: '.css$',
      minify: (minify) ? { collapseWhitespace: true } : false,
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap,
              ident: 'postcss',
              plugins: () => [
                require('postcss-import')(),
                require('postcss-mixins')(),
                require('postcss-preset-env')({
                  stage: 2,
                  features: {
                    'custom-properties': {
                      'preserve': false,
                    },
                    'nesting-rules': true,
                    'custom-selectors': true,
                  },
                }),
              ],
            },
          },
        ],
      },
    ],
  },
};

if (minify) {
  config.optimization = {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
    ],
  };
}

module.exports = config;
