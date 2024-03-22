function factory(exports, isBrowser, window, _$) {
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
	const ACCESS = {
		type: Symbol.for("sugilite.accessor.type"),
		props: Symbol.for("sugilite.accessor.props"),
		tag: Symbol.for("sugilite.accessor.tag"),
		children: Symbol.for("sugilite.accessor.children"),
	};
	let $ = _$;

	/**
	 * Returns a jQuery object, given properties and children.
	 * @example Sugilite.c()
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
				const specialProps = ["css", "ref", "bindVal$"];
				const evRegex = /^ev\$([a-z]+)$/;
				if (isBrowser) {
					Object.keys(props)
						.filter((p) => evRegex.test(p))
						.forEach((prop) => {
							$(el).on(prop.replace(evRegex, "$1"), props[prop]);
						});
					if ("css" in props && typeof props.css === "object") {
						$(el).css(props.css);
					}
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
					.filter((p) => !specialProps.includes(p) && !evRegex.test(p))
					.forEach((prop) => {
						el.setAttribute(
							prop.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
							props[prop]
						);
					});
			}
			children.forEach((child) => {
				if (["boolean", "string", "number", "float"].includes(typeof child)) {
					$(el).append(window.document.createTextNode(String(child)));
				} else if (Signal.is(child)) {
					let text = window.document.createTextNode(child.value);
					$(el).append(text);
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
	 * @param  {...SugiliteNode} children
	 * @returns {JQuery<DocumentFragment>} A fragment
	 */
	function f(...children) {
		let frag = window.document.createDocumentFragment();
		children.forEach((child) => {
			if (["boolean", "string", "number", "float"].includes(typeof child)) {
				$(frag).append(window.document.createTextNode(String(child)));
			} else if (Signal.is(child)) {
				let text = window.document.createTextNode(child.value);
				$(frag).append(text);
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
				this.#effects.forEach((effect) => effect());
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
		value: "0.0.1",
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

/**
 * A factory function returning an instance of Sugilite, taking an instance of JQuery and a window.
 * @param {JQueryStatic} jquery
 * @param {Window} win
 * @param {boolean} browser Whether this should run as if in a browser
 */
module.exports = function (jquery, win, browser) {
	let exports = {};
	factory(exports, browser, win, jquery);
	return Object.freeze(exports);
};
