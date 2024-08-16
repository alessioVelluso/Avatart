import { Grid, RgbArray, Symmetry } from "./generics";

export interface IAvatarGenerator extends IGridGenerator {
    readonly pngSignature:Buffer;
    readonly squareSize:number;
    readonly padding:number;
    readonly color:RgbArray | undefined;
    readonly backColor:RgbArray | undefined;

    writeGridAvatarFile: (grid:Grid, fileTitle:string, options?:AvatarGeneratorConstructor) => void;
    writeAvatarFile: (fileTitle:string, options?:AvatarGeneratorConstructor) => void;
    getGridAvatarBuffer: (grid:Grid, options?:AvatarGeneratorConstructor) => Buffer;
    getAvatarBuffer: (options?:AvatarGeneratorConstructor) => Buffer;
    getRandomColor: () => RgbArray;
}

export interface IGridGenerator {
    readonly symmetryOptions:Symmetry[];
    createGrid: (gridSize?:number, symmetry?:Symmetry) => Grid;
}


export type AvatarGeneratorConstructor = {
    squareSize?:number,
    gridSize?:number,
    color?:RgbArray,
    backColor?:RgbArray,
    symmetry?:Symmetry
}
