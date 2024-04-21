const rollup = require("rollup");
const { resolve } = require("path");
const fs = require("fs");

const target = process.argv[2] || "umd";
const dev = eval(process.argv[3] || "true");

/** @type {rollup.InputOptions} */
let inputoptions = {
	input: resolve("./src/sugilite/sugilite.js"),
};

const wrapperfile = fs.readFileSync(
	resolve("./src/sugilite/wrapper/" + target + ".js")
);

/** @type {rollup.OutputOptions} */
let outputoptions = {
	intro: String(wrapperfile).split("// CODE GOES HERE")[0],
	outro: String(wrapperfile).split("// CODE GOES HERE")[1],
	file: "packages/sugilite/sugilite." + target + ".js",
};

if (target !== "esm") {
	outputoptions.format = "cjs";
} else {
	outputoptions.file = "packages/sugilite/sugilite.esm.mjs";
}

if (dev) {
	rollup.watch({
		...inputoptions,
		output: [outputoptions],
	});
} else {
	rollup.rollup(inputoptions).then(build => {
		build.write(outputoptions);
	});
}
