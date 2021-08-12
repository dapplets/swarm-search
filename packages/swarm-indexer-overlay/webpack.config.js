const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
    mode: 'development',
    devtool: false,
    name: 'swarm-indexer-overlay',
    output: {
        path: path.join(__dirname, 'build'),
        clean: true
    },
    entry: path.join(__dirname, "src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: [/\.eot$/, /\.ttf$/, /\.woff$/, /\.woff2$/, /\.svg$/, /\.png$/],
                use: 'file-loader'
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.join(__dirname, "public/index.html") }),
        new ForkTsCheckerWebpackPlugin(),
        new WebpackAssetsManifest(),
    ]
};