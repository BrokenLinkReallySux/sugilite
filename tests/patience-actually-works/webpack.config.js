const { resolve } = require("path");

module.exports = {
	entry: resolve("./tests/patience-actually-works/index.js"),
	output: {
		path: resolve("./tests/patience-actually-works/dist"),
		filename: "bundle.js",
	},
	externals: ["jsdom"],
};
