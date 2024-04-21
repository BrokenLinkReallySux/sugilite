/** @jsx sugilite.c */
/** @jsxFrag sugilite.f */
import $ from "jquery";
import sugilite from "../../packages/sugilite/";
const { Patience } = sugilite;

function Wait({ children, time }) {
	return new Promise(res => {
		setTimeout(() => res(children), time);
	});
}

function App() {
	return (
		<>
			<h1>Promises</h1>
			<Patience>
				{/** intrinsic elements have been modified to return promises if any of there children are promises */}
				<div>
					<Wait time={1000}>
						<h1>1000 ms</h1>
					</Wait>
				</div>
			</Patience>
			<Patience>
				<Wait time={2000}>
					<h1>2000 ms</h1>
				</Wait>
			</Patience>
			<Patience>
				<Wait time={3000}>
					<h1>3000 ms</h1>
				</Wait>
			</Patience>
		</>
	);
}

$("#root").append(<App />);
