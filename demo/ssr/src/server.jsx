/** @jsx sugilite.c */
import sugilite from "../../../packages/sugilite";
import express from "express";
import App from "./App";
import path from "path";
import $ from "jquery";

function template() {
	const code = $('<div id="root"></div>').append(<App />)[0].outerHTML;
	return `
        <!DOCTYPE html>
        <html>
            <head></head>
            <body>
                ${code}
                <script src="app.js" async=""></script>
            </body>
        </html>
    `;
}

const app = express();

app.get("/app.js", (req, res) => {
	res.sendFile(path.resolve("./client/app.js"));
});

app.get("/", (req, res) => {
	res.send(template());
});

app.listen(3000);
