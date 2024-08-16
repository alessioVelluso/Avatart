import { Symmetry, Grid, SizeDetails } from "../types/generics";
import { IGridGenerator } from "../types/interfaces";

export class GridGenerator implements IGridGenerator {
    // --- Data
    public readonly symmetryOptions:Symmetry[] = ["horizontal", "vertical"];

    protected readonly size:number;
    protected readonly symmetry:Symmetry | undefined;

    constructor(gridSize:number, symmetry?:Symmetry) {
        this.size = gridSize;
        this.symmetry = symmetry ?? undefined
    }
    // --- ;


    public createGrid = (gridSize?:number, symmetry?:Symmetry):Grid => {
        let finalGrid:Grid = [];

        const sizeDetails = this.getSizeDetails(gridSize);

        const finalSymmetry:Symmetry = symmetry ?? this.symmetry ?? this.symmetryOptions[Math.floor(Math.random() * this.symmetryOptions.length)];
        const chunk = this.createChunk(finalSymmetry, sizeDetails.size, sizeDetails.halfSize);

        if (finalSymmetry === "horizontal") finalGrid = this.manageHorizontalSymmetry(chunk, sizeDetails);
        else finalGrid = this.manageVerticalSymmetry(chunk, sizeDetails);

        return finalGrid;
    }


    // --- Symmetry manager
    private createChunk(symmetry:Symmetry, size:number, halfSize:number):Grid {
        const ySize = symmetry === "horizontal" ? halfSize : size;
        const xSize = symmetry === "horizontal" ? size : halfSize;

        let chunk:Grid = [];
        for(let y = 0; y < ySize; y++) {
            let row = [];
            for(let x = 0; x < xSize; x++) {
                row.push(Math.floor(Math.random() * 2));
            }

            chunk.push(row);
        }

        return chunk;
    }

    private manageHorizontalSymmetry(chunk:Grid, sizeDetails:SizeDetails):Grid {
        const finalGrid:Grid = [];

        const offset: 0 | 1 = sizeDetails.isPair ? 1 : 0
        for(let y = 0; y < sizeDetails.size; y++) {
            let row:number[] = [];
            if (sizeDetails.evenMiddlePoint && y === sizeDetails.evenMiddlePoint - 1) {
                for(let x = 0; x < sizeDetails.size; x++) {
                    row.push(Math.floor(Math.random() * 2))
                }
            }
            else {
                let chunkY = (y > sizeDetails.halfSize - offset) ? (sizeDetails.size - y - 1) : y;
                for(let x = 0; x < sizeDetails.size; x++) {
                    row.push(chunk[chunkY][x]);
                }
            }

            finalGrid.push(row);
        }

        return finalGrid;
    }
    private manageVerticalSymmetry(chunk:Grid, sizeDetails:SizeDetails):Grid {
        const finalGrid:Grid = [];

        const offset: 0 | 1 = sizeDetails.isPair ? 1 : 0
        for(let y = 0; y < sizeDetails.size; y++) {
            let row:number[] = [];

            for(let x = 0; x < sizeDetails.size; x++) {
                if (sizeDetails.evenMiddlePoint && x === sizeDetails.evenMiddlePoint - 1) {
                    row.push(Math.floor(Math.random() * 2))
                }
                else {
                    let chunkX = (x > sizeDetails.halfSize - offset) ? (sizeDetails.size - x - 1) : x;
                    row.push(chunk[y][chunkX]);
                }

            }

            finalGrid.push(row);
        }

        return finalGrid;
    }
    // --- ;


    // --- Utils
    private getSizeDetails(gridSize?:number):SizeDetails {
        const size = gridSize ?? this.size;
        const halfSize = Math.floor(size / 2);
        const isPair = size - (halfSize * 2) === 0;
        const evenMiddlePoint = isPair ? null : size - halfSize;

        return { size, halfSize, isPair, evenMiddlePoint }
    }
    // --- ;
}
