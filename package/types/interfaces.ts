import { Grid, RgbObject, Symmetry } from "./generics";

export interface IAvatarGenerator extends IGridGenerator {
    readonly pngSignature:Buffer;
    readonly squareSize:number;
    readonly padding:number;
    readonly color:RgbObject | null;
    readonly backColor:RgbObject | null;

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
