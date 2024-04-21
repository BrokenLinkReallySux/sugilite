/** @jsx sugilite.c */
/** @jsxFrag sugilite.f */
import sugilite from "../../packages/sugilite";
import $ from "jquery";

function App() {
	const count = sugilite.signal(0);

	return (
		<>
			<h1>Hello, World!</h1>
			<button ev$click={() => count.value++}>{count}</button>
		</>
	);
}
$("#root").append(<App />);
