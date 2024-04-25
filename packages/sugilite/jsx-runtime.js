'use strict';

var sugilite = require('./sugilite.cjs.js');

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
		return sugilite.c(tag, passedprops, ...Array(props.children).flat(1));
	}

	return sugilite.c(tag, passedprops);
}

Object.defineProperty(exports, "Fragment", {
	enumerable: true,
	get: function () { return sugilite.f; }
});
exports.jsx = jsx;
exports.jsxDEV = jsx;
exports.jsxs = jsx;
