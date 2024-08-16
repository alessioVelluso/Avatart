import { Symmetry, Grid } from "../types/generics";
import { IGridGenerator } from "../types/interfaces";

export class GridGenerator implements IGridGenerator {
    // --- Data
    public readonly symmetryOptions:Symmetry[] = ["horizontal", "vertical"];

    protected readonly size:number;
    protected readonly halfSize:number;
    protected readonly isPair:boolean;
    protected readonly evenMiddlePoint:number | null;

    constructor(size?:number) {
        this.size = size ?? 5;
        this.halfSize = Math.floor(this.size / 2);
        this.isPair = this.size - (this.halfSize * 2) === 0;
        this.evenMiddlePoint = this.isPair ? null : this.size - this.halfSize;
    }
    // --- ;


    public createGrid = ():Grid => {
        let finalGrid:Grid = [];

        const symmetry:Symmetry = this.symmetryOptions[Math.floor(Math.random() * this.symmetryOptions.length)];
        const chunk = this.createChunk(symmetry);

        if (symmetry === "horizontal") finalGrid = this.manageHorizontalSymmetry(chunk);
        else finalGrid = this.manageVerticalSymmetry(chunk);

        return finalGrid;
    }


    // --- Symmetry manager
    private createChunk(symmetry:Symmetry):Grid {
        const ySize = symmetry === "horizontal" ? this.halfSize : this.size;
        const xSize = symmetry === "horizontal" ? this.size : this.halfSize;

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

    private manageHorizontalSymmetry(chunk:Grid):Grid {
        const finalGrid:Grid = [];

        let offset:0 | 1 = this.isPair ? 0 : 1;
        for(let y = 0; y < this.size; y++) {
            let row:number[] = [];

            if (this.evenMiddlePoint && y === this.evenMiddlePoint - 1) {
                for(let x = 0; x < this.size; x++) {
                    row.push(Math.floor(Math.random() * 2))
                }
            }
            else {
                let chunkY = (y > this.halfSize) ? (this.size - y - offset) : y;
                for(let x = 0; x < this.size; x++) {
                    row.push(chunk[chunkY][x]);
                }
            }

            finalGrid.push(row);
        }

        return finalGrid;
    }
    private manageVerticalSymmetry(chunk:Grid):Grid {
        const finalGrid:Grid = [];

        let offset:0 | 1 = this.isPair ? 0 : 1;
        for(let y = 0; y < this.size; y++) {
            let row:number[] = [];

            for(let x = 0; x < this.size; x++) {
                if (this.evenMiddlePoint && x === this.evenMiddlePoint - 1) {
                    row.push(Math.floor(Math.random() * 2))
                }
                else {
                    let chunkX = (x > this.halfSize) ? (this.size - x - offset) : x;
                    row.push(chunk[y][chunkX]);
                }

            }

            finalGrid.push(row);
        }

        return finalGrid;
    }
    // --- ;
}
