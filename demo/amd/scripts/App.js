define(["require", "./jsx", "sugilite", "./localsignal", "./styles"], function (
	require
) {
	const html = require("./jsx");
	const { signal, Each, Case } = require("sugilite");
	const localsignal = require("./localsignal");
	const styles = require("./styles");

	function App() {
		const todos = localsignal("todos", []);
		const newtodoName = signal("");
		const newtodoImp = signal("low");
		const predicate = signal.depends([todos], () => todos.value.length > 0);
		const wrappercomponent = html`<ul css$=${styles.todolist}></ul>`;
		function handlesubmit(e) {
			e.preventDefault();
			if (newtodoName.value === "") {
				alert("error");
			}
			todos.value = todos.value.concat({
				name: newtodoName.value,
				importance: newtodoImp.value,
			});
			newtodoName.value = "";
		}
		function rmtodo(index) {
			todos.value = todos.value.filter((v, i) => i !== index);
		}
		return html`<div>
			<form ev$submit=${handlesubmit}>
				<input bindVal$=${newtodoName} />
				<button type="submit">Create</button>
                <select bindVal$=${newtodoImp}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
			</form>
            <${Each} array=${todos} wrapper=${wrappercomponent}>
                ${(todo, ind) =>
									html`<li
										css$=${styles.todovariant(todo.importance)}
										ev$click=${() => rmtodo(ind)}
									>
										${todo.name}
									</li>`}
            </${Each}>
			<${Case} predicate=${predicate}>
					<h1>true</h1>
					<h1>false</h1>
			</${Case}>
		</div>`;
	}
	return App;
});
