import filterChildren from "./filterchildren";
import { Signal } from "./reactivity/signal";

export default function c(tag, props, ...children) {
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
