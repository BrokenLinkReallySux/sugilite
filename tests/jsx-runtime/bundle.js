import $ from 'jquery';

/// <reference types="./index" />


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
		{
			this.#value = update;
			this.#effects.forEach(effect => effect());
		}
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
		{
			this.#contents.replaceWith(update);
			this.#contents = update;
			this.#effects.forEach(effect => effect());
		}
	}
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
			{
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
				{
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
		return c(tag, passedprops, ...Array(props.children).flat());
	}

	return c(tag, passedprops);
}

function App() {
  return jsx(f, {
    children: [jsx("h1", {
      children: "hello"
    }), jsx("h2", {
      children: "world"
    })]
  });
}
$("#root").append(jsx(App, {}));
