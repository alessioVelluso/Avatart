import path from "path";
import express, { Express, Request } from "express";
import cors from "cors";
import { AvatarGenerator } from "avatart";


const app:Express = express();
app.use(cors());
app.use(express.static("client"));


const avatarGenerator:AvatarGenerator = new AvatarGenerator({
	fixedSize: 300,
	symmetry:"vertical"
});


app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/avatar", function(req:Request, res) {
	const buffer:Buffer = avatarGenerator.getAvatarBuffer({ gridSize: req.query.gridSize ? parseInt(req.query.gridSize as string) : undefined });
	res.send(buffer);
});



app.listen(3000, () => {
	console.log("Listening on port 3000");
});
