const { resolve } = require("path");
const fs = require("fs");

const metadata = JSON.parse(
	fs.readFileSync(resolve("./src/sugilite/metadata.json"), "utf-8")
);

const deps = JSON.parse(fs.readFileSync(resolve("./package.json"), "utf-8"));

const combined = { ...metadata, ...deps };

fs.writeFileSync("./packages/sugilite/package.json", JSON.stringify(combined));
fs.copyFileSync(
	resolve("./src/sugilite/index.d.ts"),
	resolve("./packages/sugilite/index.d.ts")
);
fs.copyFileSync(
	resolve("./src/sugilite/jsx-runtime.d.ts"),
	resolve("./packages/sugilite/jsx-runtime.d.ts")
);
fs.copyFileSync(
	resolve("./README.md"),
	resolve("./packages/sugilite/README.md")
);
fs.copyFileSync(
	resolve("./CHANGELOG.md"),
	resolve("./packages/sugilite/CHANGELOG.md")
);

function replaceImportSrc(file, importsrc) {
	const contents = fs.readFileSync(
		resolve("./packages/sugilite/", file),
		"utf-8"
	);
	const transformed = contents.replace(/['"]\.['"]/g, `'${importsrc}'`);
	fs.writeFileSync(resolve("./packages/sugilite/", file), transformed);
}

replaceImportSrc("./jsx-runtime.js", "./sugilite.cjs.js");
replaceImportSrc("./jsx-runtime.min.js", "./sugilite.cjs.js");
replaceImportSrc("./jsx-runtime.mjs", "./sugilite.esm.mjs");
replaceImportSrc("./jsx-runtime.min.mjs", "./sugilite.esm.min.mjs");
