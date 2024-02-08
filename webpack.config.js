const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");

 module.exports = {
    mode: "production",
   entry: './src/index.js',
   output: {
     filename: 'bundle.[hashcontent].js',
     path: path.resolve(__dirname, 'build'),
     clean: true
   },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
       {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',

      },
    ],
  },

  plugins: [
        new htmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body"
        })
    ]
 };