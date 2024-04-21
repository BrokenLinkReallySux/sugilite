export class Signal {
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
		if (isBrowser) {
			this.#value = update;
			this.#effects.forEach(effect => effect());
		}
	}
}

export function signal(inital) {
	return new Signal(inital);
}

signal.depends = function (deps, callback) {
	const result = new Signal(callback());
	deps.forEach(dep => {
		if (!dep instanceof Signal) {
			throw new Error("dependencies must be a signal");
		}
		dep.effect(() => (result.value = callback()));
	});
	return result;
};
