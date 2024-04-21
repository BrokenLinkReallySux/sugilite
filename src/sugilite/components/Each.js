import { Signal } from "../reactivity/signal";
import c from "../elem-factory";
import f from "../fragment";

export default function Each({ children, array, wrapper = "div" }) {
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
