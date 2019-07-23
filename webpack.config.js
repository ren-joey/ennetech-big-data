const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',  // 'production' || 'development' || 'none'
  entry: {
    index: './js/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: 'js/main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')]
              }
            }
          },
          {loader: 'sass-loader'}
        ]
      },
      {
        test: /\.(jpe?g|png|gif|mp3|svg|ttf|eot)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][hash].[ext]',
              context: ''
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /*
    | 如果執行環境是 Production, 那麼就將程式 minimize
    */
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  ]
}
