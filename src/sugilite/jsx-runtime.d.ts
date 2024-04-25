import sugilite from ".";
export { f as Fragment } from ".";

export declare namespace JSX {
	interface Element extends sugilite.JSX.Element {}
	interface IntrinsicElements extends sugilite.JSX.IntrinsicElements {}
	interface ElementAttributesProperty
		extends sugilite.JSX.ElementAttributesProperty {}
}

export declare function jsx(
	tag: sugilite.Component | string,
	props: Record<string, any>
): JSX.Element;
