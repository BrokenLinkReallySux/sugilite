/// <reference types="./index.d.ts" />
const isBrowser = typeof window !== "undefined" && "document" in window;
(function (factory) {
	if (isBrowser) {
		factory(window, require("jquery"));
	} else {
		const { JSDOM } = require("jsdom");
		const win = new JSDOM();
		factory(win.window, require("jquery")(win.window));
	}
})(function (window, $) {
	// CODE GOES HERE
});
