const path = require('path');

module.exports = {
  entry: './public/app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.build', 'js'),
  },
  mode: 'development', // FIXME: add flag for this
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['env', 'react'],
            presets: ['react'],
            // "babel": {
            //   "presets": ["env", "react", "stage-2"]
            // },
          },
        },
      },
    ],
  },
};
