"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const avatart_1 = require("avatart");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("client"));
const avatarGenerator = new avatart_1.AvatarGenerator({
    fixedSize: 300,
    symmetry: "vertical"
});
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "client", "index.html"));
});
app.get("/avatar", function (req, res) {
    const buffer = avatarGenerator.getAvatarBuffer({ gridSize: req.query.gridSize ? parseInt(req.query.gridSize) : undefined });
    res.send(buffer);
});
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
