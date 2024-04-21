export class Slot {
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

export function slot(inital) {
	return new Slot(inital);
}
