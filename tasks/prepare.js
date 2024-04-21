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
	resolve("./README.md"),
	resolve("./packages/sugilite/README.md")
);
fs.copyFileSync(
	resolve("./CHANGELOG.md"),
	resolve("./packages/sugilite/CHANGELOG.md")
);
