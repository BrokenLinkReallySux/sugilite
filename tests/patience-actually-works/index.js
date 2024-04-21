/** @jsx sugilite.c */
/** @jsxFrag sugilite.f */
import $ from "jquery";
import sugilite from "../../packages/sugilite/";
const {
  Patience
} = sugilite;
function Wait({
  children,
  time
}) {
  return new Promise(res => {
    setTimeout(() => res(children), time);
  });
}
function App() {
  return sugilite.c(sugilite.f, null, sugilite.c("h1", null, "Promises"), sugilite.c(Patience, null, sugilite.c("div", null, sugilite.c(Wait, {
    time: 1000
  }, sugilite.c("h1", null, "1000 ms")))), sugilite.c(Patience, null, sugilite.c(Wait, {
    time: 2000
  }, sugilite.c("h1", null, "2000 ms"))), sugilite.c(Patience, null, sugilite.c(Wait, {
    time: 3000
  }, sugilite.c("h1", null, "3000 ms"))));
}
$("#root").append(sugilite.c(App, null));
