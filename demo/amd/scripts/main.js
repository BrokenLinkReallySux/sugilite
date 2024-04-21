define(["require", "jquery", "./jsx", "./App"], function (require) {
	const jsx = require("./jsx");
	const $ = require("jquery");
	const App = require("./App");
	$("#root").append(jsx`<${App} />`);
});
