var path = require('path')

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    publicPath: '/dist/',
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  resolve: {
    packageMains: ['main'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      SRC: path.join(__dirname, '/../src'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.json?$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      }, {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  }
}
