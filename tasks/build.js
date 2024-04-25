const rollup = require("rollup");
const { resolve } = require("path");
const fs = require("fs");
const { default: terser } = require("@rollup/plugin-terser");

const dev = typeof process.argv[2] !== "undefined" && process.argv[2] === "dev";

/** @type {rollup.InputOptions} */
let inputoptions = {
	input: resolve("./src/sugilite/sugilite.js"),
};

/** @type {rollup.OutputOptions[]} */
let outputoptions = ["amd", "esm", "amd-named", "umd", "cjs"]
	.map(target => {
		const wrapperfile = fs.readFileSync(
			resolve("./src/sugilite/wrapper/" + target + ".js")
		);

		const wrapperparts = String(wrapperfile).split("// CODE GOES HERE"),
			intro = wrapperparts[0],
			outro = wrapperparts[1];

		/** @type {rollup.OutputOptions[]} */
		let opts = [
			{
				intro,
				outro,
				format: target === "esm" ? "esm" : "cjs",
				file: resolve(
					"./packages/sugilite",
					"./sugilite." + target + "." + (target === "esm" ? "m" : "") + "js"
				),
			},
		];

		if ((target === "umd") | (target === "esm")) {
			opts.push({
				intro,
				outro,
				format: target === "esm" ? "esm" : "cjs",
				plugins: [terser()],
				file: resolve(
					"./packages/sugilite",
					"./sugilite." +
						target +
						".min." +
						(target === "esm" ? "m" : "") +
						"js"
				),
			});
		}
		return opts;
	})
	.flat();

if (dev) {
	rollup.watch({
		...inputoptions,
		output: outputoptions,
	});
	rollup.watch({
		input: resolve("./src/sugilite/jsx-runtime.js"),
		external: ["."],
		output: [
			{
				file: resolve("./packages/sugilite/jsx-runtime.js"),
				format: "cjs",
			},
			{
				file: resolve("./packages/sugilite/jsx-runtime.mjs"),
				format: "esm",
			},
			{
				file: resolve("./packages/sugilite/jsx-runtime.min.js"),
				format: "cjs",
				plugins: [terser()],
			},
			{
				file: resolve("./packages/sugilite/jsx-runtime.min.mjs"),
				format: "esm",
				plugins: [terser()],
			},
		],
	});
} else {
	rollup.rollup(inputoptions).then(build => {
		outputoptions.forEach(opt => build.write(opt));
	});
	rollup
		.rollup({
			input: resolve("./src/sugilite/jsx-runtime.js"),
			external: ["."],
		})
		.then(build => {
			[
				{
					file: resolve("./packages/sugilite/jsx-runtime.js"),
					format: "cjs",
				},
				{
					file: resolve("./packages/sugilite/jsx-runtime.mjs"),
					format: "esm",
				},
				{
					file: resolve("./packages/sugilite/jsx-runtime.min.js"),
					format: "cjs",
					plugins: [terser()],
				},
				{
					file: resolve("./packages/sugilite/jsx-runtime.min.mjs"),
					format: "esm",
					plugins: [terser()],
				},
			].forEach(opt => build.write(opt));
		});
}
