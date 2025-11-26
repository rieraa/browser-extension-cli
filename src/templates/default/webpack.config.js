const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function getWebpackConfig({ mode = 'production', projectRoot }) {
  const isDev = mode === 'development';

  return {
    mode,
    entry: {
      popup: path.join(projectRoot, 'src/popup/index.tsx'),
      content: path.join(projectRoot, 'src/content/index.ts'),
      background: path.join(projectRoot, 'src/background/index.ts'),
    },
    output: {
      path: path.join(projectRoot, 'dist'),
      filename: '[name]/[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '88' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript',
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, 'src/popup/index.html'),
        filename: 'popup/popup.html',
        chunks: ['popup'],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(projectRoot, 'public'),
            to: '.',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    ],
    devtool: isDev ? 'cheap-module-source-map' : false,
    watch: isDev,
    watchOptions: isDev ? {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    } : undefined,
  };
}

module.exports = { getWebpackConfig };

