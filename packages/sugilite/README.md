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

## Include In Your Project

#### Script Tag

```html
<script src="path/to/jquery"></script>
<script src="path/to/sugilite"></script>
```

The main sugilite file is in a UMD format. If a browser environment is detected without an AMD loader present, the script will export browser globals. If it can't find a definition for jquery, it will export `window.createSugilite`, a factory function which takes an instance of jquery as an argument.

#### CommonJS

```js
const sugilite = require("sugilite");
```

If sugilite does not detect a browser, it will use the module jsdom.

#### Factory

`factory(jquery, window, isBrowser)`

```js
// CommonJS
const factory = require("sugilite/factory");
// Browser ESM
import factory from "https://esm.sh/sugilite/factory";

const sugilite = factory($, window, true);
```

## Buildling and Compilation

#### JSDOM Exclusion

Often, bundlers will bundle jsdom as a dependency. You can get arround this by listing jsdom as an external.

#### JSX Factory

Sugilite's jsx factory function is `c`.

```jsx
/** @jsx sugilite.c */

// this
<h1>hi</h1>;
// gets compiled into
sugilite.c("h1", null, "hi");
```

#### Compiler

You can generally use anything designed for react and configure it to use `sugilite.c`.

**Babel**

`.babelrc`:

```json
{
	"presets": ["@babel/preset-react"]
}
```

jsx files:

```js
/** @jsx sugilite.c */
/** @jsxFrag sugilite.f */
```

**Typescript**

`tsconfig.json`:

```json
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "sugilite.c"
	}
}
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
