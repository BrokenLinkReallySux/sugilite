const { resolve } = require("path");

/** @type {import("webpack").Configuration} */
module.exports = {
	entry: resolve("./demo/ssr/src/client.jsx"),
	output: {
		path: resolve("./demo/ssr/dist/client"),
		filename: "app.js",
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
	externals: ["jsdom"],
};
