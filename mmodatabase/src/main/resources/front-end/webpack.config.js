var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
   entry: "./src/index.jsx", // входная точка - исходный файл
   output:{
       path: path.resolve(__dirname, '../static'),     // путь к каталогу выходных файлов - папка build
       publicPath: path.resolve(__dirname, '../static/'),
       filename: "bundle.js"       // название создаваемого файла
   },
   devServer:{
       historyApiFallback: true,
       historyApiFallback: {
           rewrites: [
               { from: /./, to: '/index.html' }
           ]
       },
       contentBase: path.resolve(__dirname, '../static'),
       publicPath: '/',
       proxy: {
       '/api': {
           target: 'http://localhost:3000',
           secure: false
         }
       }
   },
   module:{
        rules:[
           {    //загрузчик для jsx
               test: /\.jsx$/, // определяем тип файлов
               exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
               loader: "babel-loader",   // определяем загрузчик
               options:{
                   presets:["@babel/preset-env", "@babel/preset-react"]    // используемые плагины
               }
           },
           {
                test: /\.scss$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
            {
				test: /\.css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            }
        ]
   },
   plugins: [
       new MiniCssExtractPlugin()
   ]
}
