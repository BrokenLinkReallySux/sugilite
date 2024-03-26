/** @jsx c */
import "jquery";

export type HTMLProps = {
	ev$abort?: Event;
	ev$afterprint?: Event;
	ev$animationend?: AnimationEvent;
	ev$animationiteration?: AnimationEvent;
	ev$animationstart?: AnimationEvent;
	ev$beforeprint?: Event;
	ev$beforeunload?: Event;
	ev$blur?: FocusEvent;
	ev$canplay?: Event;
	ev$canplaythrough?: Event;
	ev$change?: Event;
	ev$click?: MouseEvent;
	ev$contextmenu?: MouseEvent;
	ev$copy?: ClipboardEvent;
	ev$cut?: ClipboardEvent;
	ev$dblclick?: MouseEvent;
	ev$drag?: DragEvent;
	ev$dragend?: DragEvent;
	ev$dragenter?: DragEvent;
	ev$dragleave?: DragEvent;
	ev$dragover?: DragEvent;
	ev$dragstart?: DragEvent;
	ev$drop?: DragEvent;
	ev$durationchange?: Event;
	ev$ended?: Event;
	ev$error?: Event;
	ev$focus?: FocusEvent;
	ev$focusin?: FocusEvent;
	ev$focusout?: FocusEvent;
	ev$fulllscreenchange?: Event;
	ev$fullscreenerror?: Event;
	ev$input?: InputEvent;
	ev$invalid?: Event;
	ev$keydown?: KeyboardEvent;
	ev$keypress?: KeyboardEvent;
	ev$keyup?: KeyboardEvent;
	ev$load?: Event;
	ev$loadeddata?: Event;
	ev$loadedmetadata?: Event;
	ev$loadstart?: ProgressEvent;
	ev$message?: Event;
	ev$mousedown?: MouseEvent;
	ev$mouseenter?: MouseEvent;
	ev$mouseleave?: MouseEvent;
	ev$mousemove?: MouseEvent;
	ev$mouseover?: MouseEvent;
	ev$mouseout?: MouseEvent;
	ev$mouseup?: MouseEvent;
	ev$open?: Event;
	ev$paste?: ClipboardEvent;
	ev$pause?: Event;
	ev$play?: Event;
	ev$playing?: Event;
	ev$progress?: Event;
	ev$ratechange?: Event;
	ev$reset?: Event;
	ev$seeked?: Event;
	ev$seeking?: Event;
	ev$select?: Event;
	ev$show?: Event;
	ev$stalled?: Event;
	ev$suspend?: Event;
	ev$toggle?: Event;
	ev$touchcancel?: TouchEvent;
	ev$touchend?: TouchEvent;
	ev$touchmove?: TouchEvent;
	ev$touchstart?: TouchEvent;
	ev$transitionend?: TransitionEvent;
	ev$volumechange?: Event;
	ev$waiting?: Event;
	ev$wheel?: WheelEvent;

	css$?: Record<string, any>;
	bindVal$?: Signal<string>;

	className?: string;
	htmlFor?: string;

	style?: string;
	accept?: string;
	acceptCharset?: string;
	accesskey?: string;
	action?: string;
	align?: string;
	allow?: string;
	alt?: string;
	async?: string | boolean;
	autocapitalize?: string;
	autocomplete?: string;
	autoplay?: string | boolean;
	background?: string;
	bgcolor?: string;
	border?: string;
	charset?: string;
	checked?: string;
	cite?: string;
	color?: string;
	cols?: number | string;
	colspan?: number | string;
	content?: string;
	contenteditable?: string | boolean;
	decoding?: string;
	defer?: string | boolean;
	disabled?: string | boolean;
	download?: string | boolean;
	draggable?: string | boolean;
	enctype?: string;
	height?: string;
	hidden?: string | boolean;
	httpEquiv?: string;
	id?: string;
	intergrity?: string;
	inputmode?: string;
	ismap?: string | boolean;
	lang?: string;
	max?: string | number;
	maxlength?: string | number;
	minlength?: string | number;
	method?: string;
	min?: string | number;
	multiple?: string | boolean;
	muted?: string | boolean;
	name?: string;
};

type SugiliteNode = JQuery | string | number | boolean | Signal<any>;
type Component = (props: Record<string, any>) => {};

declare class Signal<T> {
	constructor(initial: T);
	effect(callback: () => unknown);
	get value(): T;
	set value(update: T);
}

export declare function c(
	tag: string,
	props: HTMLProps | null,
	...children: SugiliteNode[]
): JQuery;
export declare function c(
	tag: Component,
	props: Record<string, any> | null,
	...children: SugiliteNode[]
): JQuery;

export declare function f(props: {
	children: SugiliteNode[];
}): JQuery<DocumentFragment>;

export declare function signal<T>(initial: T): Signal<T>;

export default {
	c,
	f,
	signal,
} as const;
