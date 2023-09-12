const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'react-dist')
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            sharedComponents: path.resolve(__dirname, 'src/sharedComponents/'),
            modals: path.resolve(__dirname, 'src/modals/'),
            sharedTypes: path.resolve(__dirname, 'src/sharedTypes.ts'),
            theme: path.resolve(__dirname, 'src/theme.tsx'),
            colors: path.resolve(__dirname, 'src/colors.tsx'),
            utilities: path.resolve(__dirname, 'src/utilities.ts'),
            Context: path.resolve(__dirname, 'src/Context.tsx'),
            database: path.resolve(__dirname, 'src/database.ts')
        }
    },
    devtool: 'source-map',
  devServer: {
        compress: true,
        port: 3003,
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/static/index.template.ejs',
            inject: 'body'
        })
    ]
}
