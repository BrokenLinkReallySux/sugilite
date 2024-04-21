const { resolve } = require("path");

/** @type {import("webpack").Configuration} */
module.exports = {
	entry: resolve("./demo/ssr/src/server.jsx"),
	output: {
		path: resolve("./demo/ssr/dist"),
		filename: "bundle.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: "babel-loader",
			},
		],
	},
	target: "node",
};
