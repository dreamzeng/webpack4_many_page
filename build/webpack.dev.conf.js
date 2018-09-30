const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');

//预加载(preload) 将提前启动优先级高,以及将来将被使用资源的非渲染阻塞获取。要在编译时添加这些特性,我们可以使用 preload-webpack-plugin 。
//const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		filename: './js/[name].bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, "../src"),
		publicPath:'/',
		host: "172.25.196.21",
		port: "8090",
		overlay: true, // 浏览器页面上显示错误
		// open: true, // 开启浏览器
		// stats: "errors-only", //stats: "errors-only"表示只打印错误：
		hot: true, // 开启热更新
		//服务器代理配置项
        proxy: {
            '/test/*':{
                target: 'https://www.baidu.com',
                secure: true,
                changeOrigin: true
            }
        }
	},
	plugins: [
		//热更新
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		}),
		/* new PreloadWebpackPlugin({
			rel: 'preload',
			excludeHtmlNames : ['lazy.html', 'decorator.html'],
			include: ['index']
		}) */
		new ScriptExtHtmlWebpackPlugin({
			preload: /\.js$/,
			//defaultAttribute: 'async'
		})
	],
	devtool: "source-map",  // 开启调试模式
	module: {
		rules: []
	},
}
module.exports = merge(webpackConfigBase, webpackConfigDev);