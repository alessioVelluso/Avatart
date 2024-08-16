import { configDotenv } from "dotenv";
import path from "path";
configDotenv(); // --- DOTENV INIT, MOVE IT ELSEWHERE BUT DONT REMOVE IT

import express, { Express } from "express";


const app:Express = express();
const port:string = process.env["SERVER_PORT"]!;

app.use(express.static("client"));

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "client", "index.html"));
});


app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
