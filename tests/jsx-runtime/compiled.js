import $ from "jquery";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../../packages/sugilite/jsx-runtime";
function App() {
  return _jsxs(_Fragment, {
    children: [_jsx("h1", {
      children: "hello"
    }), _jsx("h2", {
      children: "world"
    })]
  });
}
$("#root").append(_jsx(App, {}));
