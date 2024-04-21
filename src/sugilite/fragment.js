import filterChildren from "./filterchildren";

export default function f({ children }) {
	/** @type {DocumentFragment} */
	let frag = window.document.createDocumentFragment();
	children.forEach(child => filterChildren(child, frag));
	return $(frag);
}
