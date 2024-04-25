import { c } from './sugilite.esm.mjs';
export { f as Fragment } from './sugilite.esm.mjs';

function jsx(tag, props) {
	if (typeof tag === "undefined") {
		throw new Error(
			"the tag passed to sugilite's jsx factory was undefined. perhaps you used a component from another file without importing it?"
		);
	}
	if (typeof tag !== "function" && typeof tag !== "string") {
		throw new Error("tag must be a function or a string");
	}

	let passedprops;
	if (props === null) ; else {
		passedprops = {};
		Object.keys(props).forEach(k => {
			if (k !== "children") passedprops[k] = props[k];
		});
	}

	if ("children" in props) {
		return c(tag, passedprops, ...Array(props.children).flat(1));
	}

	return c(tag, passedprops);
}

export { jsx, jsx as jsxDEV, jsx as jsxs };
