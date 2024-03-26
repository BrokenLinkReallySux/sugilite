const { resolve } = require("path");

/** @type {import("webpack").Configuration} */
module.exports = {
	entry: resolve("./demo/counter/counter.jsx"),
	output: {
		path: resolve("./demo/counter/dist"),
		filename: "bundle.js",
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
