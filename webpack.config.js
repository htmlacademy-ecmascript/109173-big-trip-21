const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js', // Входная точка для webpack (https://up.htmlacademy.ru/profession/fullstack/6/ecmascript/21/module/1/item/7)
  output: { // Настройка выходного файла
    path: path.resolve(__dirname, 'build'), // Директория сохранения
    filename: 'bundle.[contenthash].js', // Название
    clean: true, // Перед каждой новой сборкой - очищаем build от предыдущей сборки
  },
  devtool: 'source-map', // Генерируем карту для работы с иходным котом в devtool
  plugins: [ // Дополнительные используемые плагины
    new CopyPlugin({ // Плагин для копирования произвольных файлов в нашу директорию сборки
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new HtmlPlugin({
      template: 'public/index.html'
    }),
  ],
  // Настройка лоадеров (https://webpack.js.org/concepts/loaders/)
  module: {
    rules: [ // Настройки для Babel (Транспилер) (https://up.htmlacademy.ru/profession/fullstack/6/ecmascript/21/module/1/item/8)
      { // Настройки поддерживаемых браузеров лежат в package.json, секция browserslist
        test: /\.js$/, // Какие файлы отслеживаем
        exclude: /(node_modules)/, // Игнорируем директорию node_nodules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
};
