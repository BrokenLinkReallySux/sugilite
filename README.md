# Sugilite

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm: 0.1.1](https://img.shields.io/badge/npm-0.1.1-B30000.svg?style=flat-square)](https://npmjs.org/package/sugilite)
[![github](https://img.shields.io/badge/github-orange.svg?style=flat-square)](https://github.com/BrokenLinkReallySux/sugilite)

Sugilite is a frontend javascript ui library based on React, and powered by jQuery.

## Include In Your Project

#### Script Tag

```html
<script src="path/to/jquery"></script>
<script src="path/to/sugilite"></script>
```

#### CommonJS

```js
const sugilite = require("sugilite");
```

If sugilite does not detect a browser, it will use the module jsdom.

#### AMD

```js
require(["path/to/sugilite"], function (sugilite) {
	// code here
});
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
