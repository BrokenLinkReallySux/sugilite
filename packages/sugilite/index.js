/// <reference types="./index.d.ts" />
/**
 * @file index.js
 * @requires jquery
 */

(function (global, factory) {
	"use strict";
	const isBrowser = typeof window !== "undefined" && "document" in window;
	const win = isBrowser
		? window
		: (() => {
				const { JSDOM } = require("jsdom");
				return new JSDOM().window;
		  })();
	// @ts-ignore
	if (isBrowser && !global.jQuery && typeof module !== "object") {
		// @ts-ignore
		global.createSugilite = function (jq, undef = true) {
			let exports = {};
			factory(exports, isBrowser, win, jq);
			// @ts-ignore
			if (undef) global.createSugilite = undefined;
			return Object.freeze(exports);
		};
		return;
	}
	const $ = isBrowser
		? typeof module === "object"
			? require("jquery") // @ts-ignore
			: global.jQuery
		: require("jquery")(win);

	let exports = {};
	factory(exports, isBrowser, win, $);
	if (typeof module === "object" && typeof module.exports === "object") {
		Object.defineProperty(exports, "__esModule", { value: !0 });
		module.exports = Object.freeze(exports);
		console.log("using cjs build of sugilite");
		return;
	}
	// @ts-ignore
	if (typeof define === "function" && define.amd) {
		// @ts-ignore
		define("sugilite", [], () => Object.freeze(exports));
		console.log("using amd build of sugilite");
		return;
	} else {
		console.log("using browser global build of sugilite");
		// @ts-ignore
		global.Sugilite = Object.freeze(exports);
	}
})(
	// prettier-ignore
	typeof window === "undefined" ? this : window,
	function (exports, isBrowser, window, _$) {
		"use strict";
		/** @typedef {(props: (Object<string, *>)) => JQuery} Component */
		/** @typedef {Signal|JQuery|string|boolean|number|HTMLElement} SugiliteNode */
		const TYPES = {
			framgent: Symbol.for("sugilite.fragment"),
			element: Symbol.for("sugilite.fragment"),
			signal: Symbol.for("sugilite.signal"),
			ref: Symbol.for("sugilite.ref"),
			context: Symbol.for("sugilite.context"),
			slot: Symbol.for("sugilite.slot"),
		};

		let $ = _$;

		/**
		 * Returns a jQuery object, given properties and children.
		 * @example Sugilite.c("h1", null, "Hello World");
		 * @returns {JQuery}
		 * @param {null | Object<string, *>} props
		 * @param {...SugiliteNode} children
		 * @param {string | Component} tag
		 */
		function c(tag, props, ...children) {
			if (typeof tag === "function") {
				return tag({ ...props, children });
			} else if (typeof tag === "string") {
				let el = window.document.createElement(tag);
				if (props !== null && typeof props === "object") {
					const specialProps = ["css$", "bindVal$", "className", "htmlFor"];
					const evRegex = /^ev\$([a-z]+)$/;
					if (isBrowser) {
						Object.keys(props)
							.filter(p => evRegex.test(p))
							.forEach(prop => {
								$(el).on(prop.replace(evRegex, "$1"), props[prop]);
							});
						if ("css" in props && typeof props.css === "object") {
							$(el).css(props.css);
						}
					}
					if ("className" in props) {
						el.className = props.className;
					}
					if ("htmlFor" in props) {
						el.htmlFor = props.htmlFor;
					}
					if ("bindVal$" in props) {
						if (!Signal.is(props.bindVal$)) {
							throw new Error("bindVal$ must be a signal");
						}
						$(el).val(props.bindVal$.value);
						if (isBrowser) {
							$(el).on("input", function () {
								props.bindVal$.value = $(this).val();
							});
							props.bindVal$.effect(() => {
								if ($(el).val() !== props.bindVal$.value)
									$(el).val(props.bindVal$.value);
							});
						}
					}
					Object.keys(props)
						.filter(p => !specialProps.includes(p) && !evRegex.test(p))
						.forEach(prop => {
							el.setAttribute(
								prop.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
								props[prop]
							);
						});
				}
				children.forEach(child => {
					if (["boolean", "string", "number", "float"].includes(typeof child)) {
						$(el).append(window.document.createTextNode(String(child)));
					} else if (Signal.is(child)) {
						// @ts-ignore
						let text = window.document.createTextNode(child.value);
						$(el).append(text);
						// @ts-ignore
						child.effect(() => (text.textContent = child.value));
					} else {
						$(el).append(child);
					}
				});

				return $(el);
			} else {
				throw new Error("tag must be function or string");
			}
		}

		/**
		 * @example Sugilite.f(Sugilite.c("h1", null, "hello"), Sugilite.c("h1", null, "world"))
		 * @param  {{ children: SugiliteNode[] }} props
		 * @returns {JQuery<DocumentFragment>} A fragment
		 */
		function f({ children }) {
			let frag = window.document.createDocumentFragment();
			children.forEach(child => {
				if (["boolean", "string", "number", "float"].includes(typeof child)) {
					$(frag).append(window.document.createTextNode(String(child)));
				} else if (Signal.is(child)) {
					// @ts-ignore
					let text = window.document.createTextNode(child.value);
					$(frag).append(text);
					// @ts-ignore
					child.effect(() => (text.textContent = child.value));
				} else {
					$(frag).append(child);
				}
			});
			return $(frag);
		}

		/**
		 * @template T
		 */
		class Signal {
			__$_type = TYPES.signal;
			#effects = [];
			#value;
			/**
			 * @param {T} inital The initial value of the signal
			 */
			constructor(inital) {
				this.#value = inital;
			}

			/**
			 * Sets a callback to fire whenever the siganl changes
			 * @param {() => unknown} callback The callback that is fired
			 * @example mysignal.effect(() => console.log(`value: ${mysignal.value}`))
			 */
			effect(callback) {
				this.#effects.push(callback);
			}

			get value() {
				return this.#value;
			}

			set value(update) {
				if (isBrowser) {
					this.#value = update;
					this.#effects.forEach(effect => effect());
				}
			}

			/**
			 * @returns {boolean} Whether the given value is a signal
			 */
			static is(signal) {
				if (
					typeof signal === "object" &&
					"__$_type" in signal &&
					signal.__$_type === TYPES.signal
				) {
					return true;
				}
				return false;
			}
		}

		/**
		 * Returns a signal
		 * @example const count = Sugilite.signal(0);
		 * @template T
		 * @param {T} initial
		 * @returns {Signal<T>}
		 */
		function signal(initial) {
			return new Signal(initial);
		}
		signal.is = Signal.is;

		let config = {};
		Object.defineProperty(config, "jQueryInstance", {
			get: function () {
				return $;
			},
			set: function (jq) {
				$ = jq;
			},
		});

		let info = {};
		Object.defineProperty(info, "version", {
			value: "0.0.2",
			writable: false,
		});
		Object.defineProperty(info, "browserDetected", {
			value: isBrowser,
			writable: false,
		});

		Object.defineProperty(exports, "config", {
			get: function () {
				return Object.freeze(config);
			},
		});
		Object.defineProperty(exports, "info", {
			get: function () {
				return Object.freeze(info);
			},
		});
		exports.signal = signal;
		exports.f = f;
		exports.c = c;
		exports.default = Object.freeze({
			signal,
			f,
			c,
		});
	}
);
