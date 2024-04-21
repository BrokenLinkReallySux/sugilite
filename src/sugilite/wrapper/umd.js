/// <reference types="./index.d.ts" />
(function (global, factory) {
	const isBrowser = typeof window !== "undefined" && "document" in window;
	if (isBrowser && typeof define === "function" && define.amd) {
		define(["jquery", "exports"], ($, exports) =>
			factory(window, $, isBrowser, exports));
		return;
	}
	if (typeof module === "object" && typeof module.exports === "object") {
		if (isBrowser) {
			factory(window, require("jquery"), isBrowser, module.exports);
		} else {
			const { JSDOM } = require("jsdom");
			const win = new JSDOM();
			factory(window, require("jquery")(win.window), isBrowser, module.exports);
		}
		return;
	}
	factory(window, global.jQuery, isBrowser, (global.sugilite = {}));
})(
	typeof window !== "undefined" ? window : this,
	function (window, $, isBrowser, exports) {
		// CODE GOES HERE
	}
);
