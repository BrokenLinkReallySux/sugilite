const { execSync } = require("child_process");
for (const target of ["amd", "amd-named", "esm", "umd", "cjs"]) {
	execSync(`npm run build -- ${target} false`);
}
