import { Signal } from "./reactivity/signal";
import { Slot } from "./reactivity/slot";

export default function filterChildren(child, el) {
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
