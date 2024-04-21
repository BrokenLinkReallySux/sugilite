import c from "../elem-factory";
import f from "../fragment";
import { Signal } from "../reactivity/signal";

export default function Case({ children, predicate }) {
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
