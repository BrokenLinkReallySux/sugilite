define(["require", "sugilite"], function (require) {
	const { signal } = require("sugilite");
	function localsignal(key, defaultvalue) {
		let initial = defaultvalue;
		if (localStorage.getItem(key)) {
			initial = JSON.parse(localStorage.getItem(key));
		} else {
			localStorage.setItem(key, JSON.stringify(initial));
		}
		const stored = signal(initial);
		stored.effect(() =>
			localStorage.setItem(key, JSON.stringify(stored.value))
		);
		console.log(localStorage);
		return stored;
	}
	return localsignal;
});
