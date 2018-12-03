const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");


//预加载(preload) 将提前启动优先级高,以及将来将被使用资源的非渲染阻塞获取。要在编译时添加这些特性,我们可以使用 preload-webpack-plugin 。
//const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpackConfigBase = require('./webpack.base.conf');

process.env.NODE_ENV = "test"

const webpackConfigProd = {
	mode: 'production', // 通过 mode 声明生产环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		filename: './js/[name].[hash].js',
		chunkFilename: './js/[name].[chunkhash:8].js', //块，配置了它，非入口entry的模块，会帮自动拆分文件，也就是大家常说的按需
		publicPath: './'
	},
	//devtool: 'cheap-module-eval-source-map', //生产环境不开启 source-map
	plugins: [
		//删除dist目录
		new cleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../'), //根目录
			// verbose Write logs to console.
			verbose: true, //开启在控制台输出信息
			// dry Use boolean "true" to test/emulate delete. (will not remove files).
			// Default: false - remove files
			dry: false,
		}),
		new webpack.DefinePlugin({
			'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		}),
		// 分离css插件参数为提取出去的路径
		new extractTextPlugin({
			filename: 'css/[name].[hash:8].min.css',
		}),
		//压缩css
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		//上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
		new UglifyJSPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: false,
					drop_console: true
				}
			}
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
	module: {
		rules: []
	},

}
module.exports = merge(webpackConfigBase, webpackConfigProd);
