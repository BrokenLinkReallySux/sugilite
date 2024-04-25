import sugilite from "../../packages/sugilite/";
import $ from "jquery";

function App(props: { color: string }) {
	return (
		<>
			<h2 css$={{ color: props.color }}>I am {props.color}</h2>
		</>
	);
}

$("#root").append;
