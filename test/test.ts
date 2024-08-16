import { AvatarGenerator } from "avatart";

// --- Random Colors
const avatarGenerator = new AvatarGenerator({ squareSize: 40 });
for (let i = 0; i < 10; i++) {
    const filePath = `./outputs/cycleOut_${i+1}`
    avatarGenerator.writeAvatarFile(filePath);
}

// --- Overriding Stuff
avatarGenerator.writeAvatarFile("./outputs/custom1", { squareSize: 5, color: [255, 255, 255], backColor: [0,0,0] });
avatarGenerator.writeAvatarFile("./outputs/custom2", { gridSize: 6, color: [32, 168, 199] });
avatarGenerator.writeAvatarFile("./outputs/custom3", { gridSize: 9, color: [32, 168, 199] });
avatarGenerator.writeAvatarFile("./outputs/custom4", { gridSize: 10, color: [32, 168, 199], symmetry:"horizontal" });

avatarGenerator.writeAvatarFile("./outputs/custom5", { squareSize: 10, gridSize: 13 });
avatarGenerator.writeAvatarFile("./outputs/custom6", { squareSize: 10, gridSize: 14 });
avatarGenerator.writeAvatarFile("./outputs/custom7", { squareSize: 5, gridSize: 29 });
avatarGenerator.writeAvatarFile("./outputs/custom8", { squareSize: 5, gridSize: 30 });

for (let i = 0; i < 5; i++) {
    const filePath = `./outputs/nice_${i+1}`
    avatarGenerator.writeAvatarFile(filePath, { gridSize:13, symmetry:"vertical" });
}


const buffer:Buffer = avatarGenerator.getAvatarBuffer();
