import "jquery";

declare namespace sugilite {
	export type EvHandler<T extends Event, U extends EventTarget> = (
		event: T & { currentTarget: U }
	) => unknown;
	export type HTMLEvHandler<T extends Event, U extends HTMLElement> = EvHandler<
		T,
		EventTarget & U
	>;

	export type HTMLProps<T extends HTMLElement = HTMLElement> = {
		ev$abort?: HTMLEvHandler<Event, T>;
		ev$afterprint?: HTMLEvHandler<Event, T>;
		ev$animationend?: HTMLEvHandler<AnimationEvent, T>;
		ev$animationiteration?: HTMLEvHandler<AnimationEvent, T>;
		ev$animationstart?: HTMLEvHandler<AnimationEvent, T>;
		ev$beforeprint?: HTMLEvHandler<Event, T>;
		ev$beforeunload?: HTMLEvHandler<Event, T>;
		ev$blur?: HTMLEvHandler<FocusEvent, T>;
		ev$canplay?: HTMLEvHandler<Event, T>;
		ev$canplaythrough?: HTMLEvHandler<Event, T>;
		ev$change?: HTMLEvHandler<Event, T>;
		ev$click?: HTMLEvHandler<MouseEvent, T>;
		ev$contextmenu?: HTMLEvHandler<MouseEvent, T>;
		ev$copy?: HTMLEvHandler<ClipboardEvent, T>;
		ev$cut?: HTMLEvHandler<ClipboardEvent, T>;
		ev$dblclick?: HTMLEvHandler<MouseEvent, T>;
		ev$drag?: HTMLEvHandler<DragEvent, T>;
		ev$dragend?: HTMLEvHandler<DragEvent, T>;
		ev$dragenter?: HTMLEvHandler<DragEvent, T>;
		ev$dragleave?: HTMLEvHandler<DragEvent, T>;
		ev$dragover?: HTMLEvHandler<DragEvent, T>;
		ev$dragstart?: HTMLEvHandler<DragEvent, T>;
		ev$drop?: HTMLEvHandler<DragEvent, T>;
		ev$durationchange?: HTMLEvHandler<Event, T>;
		ev$ended?: HTMLEvHandler<Event, T>;
		ev$error?: HTMLEvHandler<Event, T>;
		ev$focus?: HTMLEvHandler<FocusEvent, T>;
		ev$focusin?: HTMLEvHandler<FocusEvent, T>;
		ev$focusout?: HTMLEvHandler<FocusEvent, T>;
		ev$fulllscreenchange?: HTMLEvHandler<Event, T>;
		ev$fullscreenerror?: HTMLEvHandler<Event, T>;
		ev$input?: HTMLEvHandler<InputEvent, T>;
		ev$invalid?: HTMLEvHandler<Event, T>;
		ev$keydown?: HTMLEvHandler<KeyboardEvent, T>;
		ev$keypress?: HTMLEvHandler<KeyboardEvent, T>;
		ev$keyup?: HTMLEvHandler<KeyboardEvent, T>;
		ev$load?: HTMLEvHandler<Event, T>;
		ev$loadeddata?: HTMLEvHandler<Event, T>;
		ev$loadedmetadata?: HTMLEvHandler<Event, T>;
		ev$loadstart?: HTMLEvHandler<ProgressEvent, T>;
		ev$message?: HTMLEvHandler<Event, T>;
		ev$mousedown?: HTMLEvHandler<MouseEvent, T>;
		ev$mouseenter?: HTMLEvHandler<MouseEvent, T>;
		ev$mouseleave?: HTMLEvHandler<MouseEvent, T>;
		ev$mousemove?: HTMLEvHandler<MouseEvent, T>;
		ev$mouseover?: HTMLEvHandler<MouseEvent, T>;
		ev$mouseout?: HTMLEvHandler<MouseEvent, T>;
		ev$mouseup?: HTMLEvHandler<MouseEvent, T>;
		ev$open?: HTMLEvHandler<Event, T>;
		ev$paste?: HTMLEvHandler<ClipboardEvent, T>;
		ev$pause?: HTMLEvHandler<Event, T>;
		ev$play?: HTMLEvHandler<Event, T>;
		ev$playing?: HTMLEvHandler<Event, T>;
		ev$progress?: HTMLEvHandler<Event, T>;
		ev$ratechange?: HTMLEvHandler<Event, T>;
		ev$reset?: HTMLEvHandler<Event, T>;
		ev$seeked?: HTMLEvHandler<Event, T>;
		ev$seeking?: HTMLEvHandler<Event, T>;
		ev$select?: HTMLEvHandler<Event, T>;
		ev$show?: HTMLEvHandler<Event, T>;
		ev$stalled?: HTMLEvHandler<Event, T>;
		ev$suspend?: HTMLEvHandler<Event, T>;
		ev$toggle?: HTMLEvHandler<Event, T>;
		ev$touchcancel?: HTMLEvHandler<TouchEvent, T>;
		ev$touchend?: HTMLEvHandler<TouchEvent, T>;
		ev$touchmove?: HTMLEvHandler<TouchEvent, T>;
		ev$touchstart?: HTMLEvHandler<TouchEvent, T>;
		ev$transitionend?: HTMLEvHandler<TransitionEvent, T>;
		ev$volumechange?: HTMLEvHandler<Event, T>;
		ev$waiting?: HTMLEvHandler<Event, T>;
		ev$wheel?: HTMLEvHandler<WheelEvent, T>;
		ev$submit?: HTMLEvHandler<SubmitEvent, T>;

		css$?: Partial<CSSStyleDeclaration> & Record<string, any>;
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
	type Component = (props: any) => SugiliteNode;

	class Signal<T> {
		constructor(initial: T);
		effect(callback: () => unknown): void;
		get value(): T;
		set value(update: T);
	}

	export class Slot {
		constructor(initial: JQuery);
		effect(callback: () => unknown): void;
		get content(): JQuery;
		set content(update: JQuery);
	}

	export function slot(): Slot;

	interface EachProps {
		array: Signal<any[]>;
		children: (value: any, index: number, array: any[]) => SugiliteNode;
		wrapper?: string | Component | JQuery;
	}

	export function Each(props: EachProps): SugiliteNode;

	interface PatienceProps {
		children: SugiliteNode[];
		fallback: SugiliteNode | undefined;
	}

	export function Patience(props: PatienceProps): SugiliteNode;

	interface CaseProps {
		children: SugiliteNode[];
		predicate: Signal<boolean>;
	}

	export function Case(props: CaseProps): SugiliteNode;

	export function c(
		tag: string,
		props: HTMLProps | null,
		...children: SugiliteNode[]
	): JQuery;
	export function c(
		tag: Component,
		props: Record<string, any> | null,
		...children: SugiliteNode[]
	): JQuery;

	export function f(props: {
		children: SugiliteNode[];
	}): JQuery<DocumentFragment>;

	export function signal<T>(initial: T): Signal<T>;

	export namespace JSX {
		interface Element extends JQuery<HTMLElement> {}
		interface IntrinsicElements {
			a: HTMLProps<HTMLAnchorElement>;
			abbr: HTMLProps;
			address: HTMLProps;
			area: HTMLProps<HTMLAreaElement>;
			article: HTMLProps;
			aside: HTMLProps;
			audio: HTMLProps<HTMLAudioElement>;
			b: HTMLProps;
			base: HTMLProps<HTMLBaseElement>;
			bdi: HTMLProps;
			bdo: HTMLProps;
			blockquote: HTMLProps;
			body: HTMLProps<HTMLBodyElement>;
			br: HTMLProps<HTMLBRElement>;
			button: HTMLProps<HTMLButtonElement>;
			canvas: HTMLProps<HTMLCanvasElement>;
			caption: HTMLProps<HTMLTableCaptionElement>;
			cite: HTMLProps;
			code: HTMLProps;
			col: HTMLProps;
			colgroup: HTMLProps;
			data: HTMLProps<HTMLDataElement>;
			datalist: HTMLProps<HTMLDataListElement>;
			dd: HTMLProps;
			del: HTMLProps;
			details: HTMLProps<HTMLDetailsElement>;
			dfn: HTMLProps;
			dialog: HTMLProps<HTMLDialogElement>;
			div: HTMLProps<HTMLDivElement>;
			dl: HTMLProps;
			dt: HTMLProps;
			em: HTMLProps;
			embed: HTMLProps<HTMLEmbedElement>;
			fieldset: HTMLProps<HTMLFieldSetElement>;
			form: HTMLProps<HTMLFormElement>;
			h1: HTMLProps<HTMLHeadingElement>;
			h2: HTMLProps<HTMLHeadingElement>;
			h3: HTMLProps<HTMLHeadingElement>;
			h4: HTMLProps<HTMLHeadingElement>;
			h5: HTMLProps<HTMLHeadingElement>;
			h6: HTMLProps<HTMLHeadingElement>;
			head: HTMLProps<HTMLHeadElement>;
			hgroup: HTMLProps;
			hr: HTMLProps<HTMLHRElement>;
			html: HTMLProps<HTMLHtmlElement>;
			i: HTMLProps;
			iframe: HTMLProps<HTMLIFrameElement>;
			img: HTMLProps<HTMLImageElement>;
			input: HTMLProps<HTMLInputElement>;
			ins: HTMLProps;
			kbd: HTMLProps;
			label: HTMLProps<HTMLLabelElement>;
			legend: HTMLProps<HTMLLegendElement>;
			li: HTMLProps<HTMLLIElement>;
			link: HTMLProps<HTMLLinkElement>;
			main: HTMLProps;
			map: HTMLProps<HTMLMapElement>;
			mark: HTMLProps;
			menu: HTMLProps<HTMLMenuElement>;
			meta: HTMLProps<HTMLMetaElement>;
			meter: HTMLProps<HTMLMeterElement>;
			nav: HTMLProps<HTMLMeterElement>;
			noscript: HTMLProps;
			object: HTMLProps<HTMLObjectElement>;
			ol: HTMLProps<HTMLOListElement>;
			optgroup: HTMLProps<HTMLOptGroupElement>;
			option: HTMLProps<HTMLOptionElement>;
			output: HTMLProps<HTMLOutputElement>;
			p: HTMLProps<HTMLParagraphElement>;
			param: HTMLProps<HTMLParamElement>;
			picture: HTMLProps<HTMLPictureElement>;
			pre: HTMLProps<HTMLPreElement>;
			progress: HTMLProps<HTMLProgressElement>;
			q: HTMLProps<HTMLQuoteElement>;
			rp: HTMLProps;
			samp: HTMLProps;
			script: HTMLProps<HTMLScriptElement>;
			search: HTMLProps;
			section: HTMLProps;
			select: HTMLProps<HTMLSelectElement>;
			small: HTMLProps;
			source: HTMLProps<HTMLSourceElement>;
			span: HTMLProps<HTMLSpanElement>;
			style: HTMLProps<HTMLStyleElement>;
			sub: HTMLProps;
			summary: HTMLProps;
			sup: HTMLProps;
			svg: HTMLProps;
			table: HTMLProps<HTMLTableElement>;
			tbody: HTMLProps;
			td: HTMLProps<HTMLTableCellElement>;
			template: HTMLProps<HTMLTemplateElement>;
			textarea: HTMLProps<HTMLTextAreaElement>;
			tfoot: HTMLProps;
			th: HTMLProps;
			time: HTMLProps<HTMLTimeElement>;
			title: HTMLProps<HTMLTitleElement>;
			track: HTMLProps<HTMLTrackElement>;
			u: HTMLProps;
			ul: HTMLProps<HTMLUListElement>;
			var: HTMLProps;
			video: HTMLProps<HTMLVideoElement>;
			wbr: HTMLProps;
			[name: string]: any;
		}
		interface ElementAttributesProperty {
			props: any;
		}
	}
}

export = sugilite;
