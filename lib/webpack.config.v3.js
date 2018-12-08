const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: './',
  entry: {
    main: './app.js',
    verdor: ['react', 'vue', 'angular']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js',
    publicPath: '/static/',
    library: 'start-webpack-conf',
    libraryTarget: 'umd',
    chunkFilename: '[chunkhash].js',
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  devtool: 'cheap-module-eval-source-map' | 'source-map',
  devServer: {
    clientLogLevel: 'warning',
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/dist/',
    historyApiFallback : true,
    compress: true,
    open: true,
    hot: true,
    quiet: true,
    progress: true,
    port: PORT,
    watchOptions: {},
    proxy: {
      // "/api": {
      //   target: "http://localhost:3000",
      //   pathRewrite: {"^/api" : ""}
      // }
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              moduls: true,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                moduls: true,
                importLoaders: 1,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/images/[hash].[name].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[hash].[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[hash].[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    // define env as mode
    new webpack.DefinePlugin({
      'process.env': 'development' | 'production'
    }),
    // clean old build files
    new CleanWebpackPlugin(['dist']),
    // generate template
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    // mini js
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    }),
    // copy static files
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    // split css
    new ExtractTextPlugin("styles.css"),
    // split chunks
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    // Separating a Manifest for cache
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    // HMR
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
