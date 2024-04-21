const { minify } = require("uglify-js");
const { resolve } = require("path");
const fs = require("fs");

const file = fs.readFileSync(resolve("./packages/sugilite/sugilite.umd.js"));
const res = minify(String(file)).code;
fs.writeFileSync(resolve("./packages/sugilite/sugilite.umd.min.js"), res);
