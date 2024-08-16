# Node Avatar Generator
`v0.0.1`

```bash
npm i node-avatar-generator
```

```ts
import { AvatarGenerator } from "node-avatar-generator";

const avatarGenerator = new AvatarGenerator();

// Write a png
avatarGenerator.writeRandomPngFile("./outputs/output2a");

// Or get it as a buffer
const avatarBuffer:Buffer = avatarGenerator.getRandomPngBuffer();
```

The export is a class extending another one. Here are the interfaces.
```ts
export interface IAvatarGenerator extends IGridGenerator {
    readonly pngSignature:Buffer;
    readonly squareSize:number;
    readonly padding:number;
    readonly color:RgbObject;
    readonly backColor:RgbObject;

    writePngFile: (grid:Grid, fileTitle:string) => void;
    writeRandomPngFile: (fileTitle:string) => void;
    getPngBuffer: (grid:Grid) => Buffer;
    getRandomPngBuffer: () => Buffer;
    getRandomColor: () => RgbObject;
}

export interface IGridGenerator {
    readonly symmetryOptions:Symmetry[];
    createGrid: () => Grid;
}
```

This is the constructor:
```ts
export type AvatarGeneratorConstructor = {
    squareSize?:number,
    gridSize?:number,
    color?:RgbObject,
    backColor?:RgbObject
}
```

Have fun.
