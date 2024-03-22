# Sugilite

Sugilite is a frontend javascript ui library based on React, and powered by jQuery.

```jsx
/** @jsx Sugilite.c */
/** @jsxFrag Sugilite.f */
import * as Sugilite from "sugilite";
import $ from "jquery";
import { signal } from "sugilite";

function App() {
	const count = signal(0);

	// Subscribe to changes
	count.effect(() => console.log(count.value));

	return <button ev$click={() => count.value++}>{count}</button>;
}

// render to page
$("#root").append(<App />);
```

## Signals

Sugilite uses signals, which can be used as jsx children.

#### signal(initial)

Creates a new signal based with the passed initial value

```js
const mysignal = signal(0);
```

#### .effect(callback)

Fires a callback whenever the value of a signal changes

```js
mysignal.effect(() => console.log(mysignal.value));
```

#### .value

```js
const mysignal = signal(0);
console.log(mysignal.value); // 0
mysignal.value = 1;
console.log(mysignal.value); // 1
```
