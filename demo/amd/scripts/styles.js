define(function () {
	let styles = {
		todolist: {
			listStyleType: "none",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			width: "100vw",
			gap: "1rem",
		},
		todoitem: {
			fontFamily: "monospace",
			padding: "1.3rem",
			boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
			borderRadius: "1rem",
			cursor: "pointer",
		},
		todolow: {
			backgroundColor: "mediumspringgreen",
		},
		todomedium: {
			backgroundColor: "gold",
		},
		todohigh: {
			backgroundColor: "tomato",
		},
	};
	styles.todovariant = function (imp) {
		return { ...styles.todoitem, ...styles["todo" + imp] };
	};
	Object.freeze(styles);
	return styles;
});
