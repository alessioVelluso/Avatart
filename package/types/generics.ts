export type Size = { width:number, height:number }
export type IdatAndIendChunks = { idatChunk:Buffer, iendChunk:Buffer }
export type Grid = Array< Array<number> >
export type Symmetry = "vertical" | "horizontal"
export type RgbObject = {r:number, g:number, b:number }

export type AvatarGeneratorConstructor = {
    squareSize?:number,
    gridSize?:number,
    color?:RgbObject,
    backColor?:RgbObject
}
