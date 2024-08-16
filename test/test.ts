import { AvatarGenerator } from "node-avatar-generator";

const avatarGenerator = new AvatarGenerator({ squareSize: 40 });
for (let i = 0; i < 15; i++) {
    const filePath = `./outputs/cycleOut_${i+1}`
    avatarGenerator.writeRandomPngFile(filePath);
}
