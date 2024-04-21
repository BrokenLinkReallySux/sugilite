import c from "../elem-factory";
import f from "../fragment";
import { slot } from "../reactivity/slot";

export default function Patience({ children, fallback = null }) {
	const contentslot = slot(fallback || $(document.createTextNode("")));
	Promise.all(children).then(values => {
		contentslot.content = c(f, null, ...values);
	});
	return contentslot.content;
}
