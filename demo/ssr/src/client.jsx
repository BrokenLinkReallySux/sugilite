/** @jsx sugilite.c */
import App from "./App";
import $ from "jquery";
import sugilite from "../../../packages/sugilite";

$("<div></div>")
	.append(<App />)
	.replaceAll("#root");
