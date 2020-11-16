const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function client() {
  const views = fs.readdirSync(path.resolve(__dirname, "views"))
    .filter(file => path.extname(file) === '.html')
    .map(file => path.basename(file, '.html'));
  const scripts = fs.readdirSync(path.resolve(__dirname, "src/client"))
    .filter(file => path.extname(file) === '.tsx')
    .map(file => path.basename(file, '.tsx'));
  const names = views.filter(name => scripts.includes(name));

  return {
    // Input
    entry: names.reduce((e, name) =>
      ({ ...e, [name]: `./src/client/${name}.tsx` }),
      {}
    ),
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss'],
      alias: {
        '@shared': path.resolve(__dirname, 'src/shared'),
        'jinaga': 'jinaga/dist/jinaga',
      },
    },

    // Processing
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: [
            path.resolve(__dirname, 'src/client'),
            path.resolve(__dirname, 'src/shared'),
          ],
          use: 'ts-loader',
          exclude: /node-modules/,
        },
        {
            test: /\.(scss|css)$/,

            use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: names.map(name => new HtmlWebpackPlugin({
      chunks: [name],
      template: `views/${name}.html`,
      filename: `${name}.html`
    })).concat([
      new WorkboxPlugin.GenerateSW({
        swDest: 'scripts/service-worker.js',
        inlineWorkboxRuntime: true
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'src/server/images'),
          to:   path.resolve(__dirname, 'dist/images')
        } 
      ])
    ]),

    // Output
    mode: 'production',
    target: 'web',
    devtool: 'source-map',
    output: {
      filename: 'scripts/[name]-[hash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
  };
}

const server = {
  // Input
  entry: './src/server/server.ts',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },

  // Processing
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, 'src/server'),
          path.resolve(__dirname, 'src/shared'),
        ],
        use: 'ts-loader',
        exclude: /node-modules/,
      },
    ],
  },

  // Output
  mode: 'production',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: 'source-map',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
};

module.exports = [
  client(),
  server
];