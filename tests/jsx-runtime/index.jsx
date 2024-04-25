import $ from "jquery";

function App() {
	return (
		<>
			<h1>hello</h1>
			<h2>world</h2>
		</>
	);
}

$("#root").append(<App />);
