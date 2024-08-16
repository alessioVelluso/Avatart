export type Size = { width:number, height:number }
export type IdatAndIendChunks = { idatChunk:Buffer, iendChunk:Buffer }
export type Grid = Array< Array<number> >
export type Symmetry = "vertical" | "horizontal"
export type RgbArray = [number, number, number]
export type SizeDetails = { size:number, halfSize:number, isPair:boolean, evenMiddlePoint:number | null }
export type PngDetails = { squareSize:number, padding:number, color?:RgbArray, backColor?:RgbArray }
