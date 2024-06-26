/// <reference types="./index.d.ts" />
/**
 * @file index.js
 * @requires jquery
 */

(function (global, factory) {
	"use strict";
	const isBrowser = typeof window !== "undefined" && "document" in window;
	const isAMD = isBrowser && typeof define === "function" && define.amd;
	const win = isBrowser
		? window
		: (() => {
				const { JSDOM } = require("jsdom");
				return new JSDOM().window;
		  })();
	// @ts-ignore
	if (isBrowser && !global.jQuery && typeof module !== "object" && !isAMD) {
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
	if (isAMD && !global.jQuery && typeof module !== "object" && isBrowser) {
		define(["jquery"], function ($) {
			let exports = {};
			factory(exports, isBrowser, win, $);
			return Object.freeze(exports);
		});
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
		define(["jquery"], () => Object.freeze(exports));
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

		function filterChildren(child, el) {
			if (["boolean", "string", "number", "float"].includes(typeof child)) {
				$(el).append(window.document.createTextNode(String(child)));
			} else if (Signal.is(child)) {
				// @ts-ignore
				let text = window.document.createTextNode(child.value);
				$(el).append(text);
				// @ts-ignore
				child.effect(() => (text.textContent = child.value));
			} else if (Slot.is(child)) {
				$(el).append(child.content);
			} else if (Array.isArray(child)) {
				child.forEach(ch => filterChildren(ch, el));
			} else {
				$(el).append(child);
			}
		}

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
					}
					if ("css$" in props && typeof props.css$ === "object") {
						$(el).css(props.css$);
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
				children.forEach(child => filterChildren(child, el));

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
			/** @type {DocumentFragment} */
			let frag = window.document.createDocumentFragment();
			children.forEach(child => filterChildren(child, frag));
			return $(frag);
		}

		/**
		 * @template T
		 */
		class Signal {
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
				if (signal instanceof Signal) {
					return true;
				}
				return false;
			}

			static depends(deps, callback) {
				const result = new Signal(callback());
				deps.forEach(dep => {
					if (!Signal.is(dep)) {
						throw new Error("dependencies must be a signal");
					}
					dep.effect(() => (result.value = callback()));
				});
				return result;
			}
		}

		class Slot {
			#effects = [];
			#contents;
			constructor(initial) {
				this.#contents = initial;
			}
			get content() {
				return this.#contents;
			}
			set content(update) {
				if (isBrowser) {
					this.#contents.replaceWith(update);
					this.#contents = update;
					this.#effects.forEach(effect => effect());
				}
			}
			static is(slot) {
				if (slot instanceof Slot) {
					return true;
				}
				return false;
			}
		}

		function lazyload(callback) {
			return async function (props) {
				return (await callback(props)).default;
			};
		}

		function Patience({ children, fallback = null }) {
			const contentslot = slot(fallback || $(document.createTextNode("")));
			Promise.all(children).then(values => {
				contentslot.content = c(f, null, ...values);
			});
			return contentslot.content;
		}
		function Each({ children, array, wrapper = "div" }) {
			if (!Signal.is(array)) {
				throw new Error("the 'array' attribute must be an array signal");
			}
			if (!Array.isArray(array.value)) {
				throw new Error("the 'array' attribute must be an array signal");
			}
			if (children.length !== 1) {
				throw new Error(
					"the 'Each' compononent takes only one child, which should be a function"
				);
			}
			if (typeof children[0] !== "function") {
				throw new Error(
					"the 'Each' compononent takes only one child, which should be a function"
				);
			}
			if (typeof wrapper !== "string" && typeof wrapper !== "function") {
				throw new Error(
					"the 'wrapper' attribute must be a component or a string"
				);
			}
			const frag = document.createDocumentFragment();
			frag.append(
				...array.value.map((v, i, a) => c(f, null, children[0](v, i, a))[0])
			);
			const node = c(wrapper, null, $(frag));
			function loop() {
				frag.replaceChildren(
					...array.value.map((v, i, a) => c(f, null, children[0](v, i, a))[0])
				);
				node[0].replaceChildren(frag);
			}
			array.effect(loop);
			return node;
		}
		function Case({ children, predicate }) {
			if (!signal.is(predicate)) {
				throw new Error("'predicate' must be a boolean signal");
			}
			if (typeof predicate.value !== "boolean") {
				throw new Error("'predicate' must be a boolean signal");
			}
			if (children.length !== 2) {
				throw new Error("the 'Case' component can take exactly two children");
			}
			const frag = c(f, null, ...children);
			if (predicate.value === true) {
				children[1].hide();
			} else {
				children[0].hide();
			}
			predicate.effect(() => {
				if (predicate.value === true) {
					children[1].hide();
					children[0].show();
				} else {
					children[0].hide();
					children[1].show();
				}
			});
			return frag;
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
		signal.depends = Signal.depends;
		function slot(initial) {
			return new Slot(initial);
		}
		slot.is = Slot.is;

		let config = {};
		Object.defineProperty(config, "jQueryInstance", {
			get: function () {
				return $;
			},
			set: function (jq) {
				$ = jq;
			},
		});
		Object.defineProperty(config, "win", {
			get() {
				return window;
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
		exports.slot = slot;
		exports.Patience = Patience;
		exports.Each = Each;
		exports.Case = Case;
		exports.Slot = Slot;
		exports.lazyload = lazyload;
		exports.default = Object.freeze({
			signal,
			f,
			c,
			slot,
			Patience,
			Each,
			Case,
			Signal,
			Slot,
			config: Object.freeze(config),
			info: Object.freeze(info),
			lazyload,
		});
	}
);
