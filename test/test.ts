import { AvatarGenerator } from "avatart";


const avatarGenerator = new AvatarGenerator({ symmetry:"vertical" });

// --- Buffer
const buffer:Buffer = avatarGenerator.getAvatarBuffer();


// --- Random Colors
for (let i = 0; i < 10; i++) {
    const filePath = `./outputs/cycleOut_${i+1}`
    avatarGenerator.writeAvatarFile(filePath);
}



// --- Overriding Stuff
avatarGenerator.writeAvatarFile("./outputs/custom1", { squareSize: 5, color: [255, 255, 255], backColor: [0,0,0] });
avatarGenerator.writeAvatarFile("./outputs/custom2", { gridSize: 6, color: [168, 168, 199] });
avatarGenerator.writeAvatarFile("./outputs/custom3", { gridSize: 9, color: [32, 168, 199] });
avatarGenerator.writeAvatarFile("./outputs/custom4", { gridSize: 10, color: [199, 32, 199], symmetry:"horizontal" });
avatarGenerator.writeAvatarFile("./outputs/custom5", { squareSize: 20, gridSize: 13 });
avatarGenerator.writeAvatarFile("./outputs/custom6", { squareSize: 20, gridSize: 14 });
avatarGenerator.writeAvatarFile("./outputs/custom7", { squareSize: 10, gridSize: 29 });
avatarGenerator.writeAvatarFile("./outputs/custom8", { squareSize: 10, gridSize: 30 });
avatarGenerator.writeAvatarFile("./outputs/custom9", { squareSize: 40, gridSize: 5 });
avatarGenerator.writeAvatarFile("./outputs/custom10", { squareSize: 40, gridSize: 7 });




// --- Fixed Height
const fixedAvatarGenerator = new AvatarGenerator({ symmetry: "vertical", fixedSize: 300 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed1", { gridSize: 4 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed2", { gridSize: 5 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed3", { gridSize: 7 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed4", { gridSize: 8 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed5", { gridSize: 11 });
fixedAvatarGenerator.writeAvatarFile("./outputs/fixed6", { gridSize: 14 });
