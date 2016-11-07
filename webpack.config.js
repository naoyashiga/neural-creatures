var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: { path: './dist', filename: 'bundle.js' },
  devServer: {
   contentBase: 'dist',
 },
  resolve: {
    // extensions: ['', '.js'],
    alias: {
      webworkify: 'webworkify-webpack',
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // {
      //   test: /\.js$/,
      //   include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
      //   loader: 'transform/cacheable?brfs'
      // }
    ]
    // postLoaders: [{
    //   include: /node_modules\/mapbox-gl-shaders/,
    //   loader: "transform",
    //   query: "brfs"
    // }]
  },
  // plugins: [
  //   // new webpack.optimize.UglifyJsPlugin(),
  //   new HtmlWebpackPlugin({
  //     title: 'Street Lights'
  //   })
  // ],
};
