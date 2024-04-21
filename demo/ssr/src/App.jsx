/** @jsx sugilite.c */
/** @jsxFrag sugilite.f */
import sugilite, { signal } from "../../../packages/sugilite";

export default function App() {
	const number = signal(Math.floor(Math.random() * 10));
	return (
		<>
			<h1>{number}</h1>
			<button ev$click={() => number.value++}>increment</button>
			<button ev$click={() => number.value--}>decrement</button>
		</>
	);
}
