const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.PRODUCTION || false;

let plugins = [];
let filename = 'bundle.js';

const pluginsProd = [
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }),

  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
];

if (isProduction) {
  plugins = plugins.concat(pluginsProd);
  filename = 'bundle.min.js';
}

module.exports = {
  entry: {
    web: './views/routes.jsx',
    demo: './views/demo.jsx',
  },

  output: {
    path: path.join(__dirname, 'views', 'static', 'js', 'dist'),
    filename: `[name].${filename}`,
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins,
};
