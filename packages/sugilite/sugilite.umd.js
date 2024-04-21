'use strict';

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
		

Object.defineProperty(exports, '__esModule', { value: true });

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
}

function signal(inital) {
	return new Signal(inital);
}

signal.depends = function (deps, callback) {
	const result = new Signal(callback());
	deps.forEach(dep => {
		if (!dep instanceof Signal) {
			throw new Error("dependencies must be a signal");
		}
		dep.effect(() => (result.value = callback()));
	});
	return result;
};

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
}

function slot(inital) {
	return new Slot(inital);
}

function filterChildren(child, el) {
	if (["boolean", "string", "number", "float"].includes(typeof child)) {
		$(el).append(window.document.createTextNode(String(child)));
	} else if (child instanceof Signal) {
		// @ts-ignore
		let text = window.document.createTextNode(child.value);
		$(el).append(text);
		// @ts-ignore
		child.effect(() => (text.textContent = child.value));
	} else if (child instanceof Slot) {
		$(el).append(child.content);
	} else if (Array.isArray(child)) {
		child.forEach(ch => filterChildren(ch, el));
	} else {
		$(el).append(child);
	}
}

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
				if (!props.bindVal$ instanceof Signal) {
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

		let containspromises = false;
		for (const child of children) {
			if (child instanceof Promise) {
				containspromises = true;
				break;
			}
		}
		if (containspromises) {
			return new Promise((resolve, reject) => {
				Promise.all(children)
					.then(values => {
						values.forEach(v => filterChildren(v, el));
						resolve($(el));
					})
					.catch(res => reject(res));
			});
		}

		children.forEach(child => filterChildren(child, el));

		return $(el);
	} else {
		throw new Error("tag must be function or string");
	}
}

function f({ children }) {
	/** @type {DocumentFragment} */
	let frag = window.document.createDocumentFragment();
	children.forEach(child => filterChildren(child, frag));
	return $(frag);
}

function Case({ children, predicate }) {
	if (!predicate instanceof Signal) {
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

function Each({ children, array, wrapper = "div" }) {
	if (!array instanceof Signal) {
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
	if (
		typeof wrapper !== "string" &&
		typeof wrapper !== "function" &&
		!(typeof wrapper === "object" && "jquery" in wrapper)
	) {
		throw new Error(
			"the 'wrapper' attribute must be a component, string, or jquery object"
		);
	}
	const frag = document.createDocumentFragment();
	frag.append(
		...array.value.map((v, i, a) => c(f, null, children[0](v, i, a))[0])
	);
	let node;
	if (typeof wrapper === "object") {
		node = wrapper;
		wrapper.append(frag);
	} else {
		node = c(wrapper, null, $(frag));
	}
	function loop() {
		frag.replaceChildren(
			...array.value.map((v, i, a) => c(f, null, children[0](v, i, a))[0])
		);
		node[0].replaceChildren(frag);
	}
	array.effect(loop);
	return node;
}

function Patience({ children, fallback = null }) {
	const contentslot = slot(fallback || $(document.createTextNode("")));
	Promise.all(children).then(values => {
		contentslot.content = c(f, null, ...values);
	});
	return contentslot.content;
}

var sugilite = { c, f, Signal, signal, Slot, slot, Case, Each, Patience };

exports.Case = Case;
exports.Each = Each;
exports.Patience = Patience;
exports.Signal = Signal;
exports.Slot = Slot;
exports.c = c;
exports.default = sugilite;
exports.f = f;
exports.signal = signal;
exports.slot = slot;


	}
);
