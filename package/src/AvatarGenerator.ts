import { Grid, Size, IdatAndIendChunks, RgbObject, AvatarGeneratorConstructor } from "../types/generics";
import fs from 'fs';
import zlib from 'zlib'
import { GridGenerator } from "./GridGenerator";
import { IAvatarGenerator } from "../types/interfaces";

export class AvatarGenerator extends GridGenerator implements IAvatarGenerator {
    // --- Data
    private readonly crcTable:Uint32Array;

    public readonly pngSignature:Buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    public readonly squareSize:number = 10;
    public readonly padding:number;
    public readonly color:RgbObject | null;
    public readonly backColor:RgbObject | null;

    constructor(constructor?:AvatarGeneratorConstructor) {
        super(constructor?.gridSize);

        this.squareSize = constructor?.squareSize ?? this.squareSize;
        this.padding = Math.ceil(this.squareSize / 2);

        this.color = constructor?.color ?? null;
        this.backColor = constructor?.backColor ?? null;

        this.crcTable = this.createCrcTable();
    }
    // --- ;

    // --- Public Methods
    public writePngFile = (grid:Grid, fileTitle:string) => {
        const outputBuffer:Buffer = this.getPngBuffer(grid);
        fs.writeFileSync(`${fileTitle}.png`, outputBuffer);
    }
    public writeRandomPngFile = (fileTitle:string) => {
        const grid = this.createGrid();
        this.writePngFile(grid, fileTitle);
    }

    public getPngBuffer = (grid:Grid):Buffer => {
        const { width, height } = this.getSize(grid);
        const ihdrChunk = this.writePngChunk(width, height);
        const { idatChunk, iendChunk } = this.writeIDATandIENDChunks(grid, width, height)

        return Buffer.concat([
            this.pngSignature,
            ihdrChunk,
            idatChunk,
            iendChunk
        ]);
    }
    public getRandomPngBuffer = ():Buffer => {
        const grid = this.createGrid();
        return this.getPngBuffer(grid);
    }

    public getRandomColor():RgbObject {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        return { r, g, b }
    }
    // --- ;

    // --- Build PNG Buffer
    private getSize = (grid:Grid):Size => {
        const width = (grid[0].length * this.squareSize) + (2 * this.padding);
        const height = (grid.length * this.squareSize) + (2 * this.padding);

        return { width, height }
    }

    private writePngChunk = (width:number, height:number):Buffer =>
    {
        const ihdrChunk = Buffer.alloc(25);             // Creare intestazione IHDR (13 byte + 12 byte di overhead)
        this.writeUint32(ihdrChunk, 13, 0);             // Lunghezza
        ihdrChunk.write('IHDR', 4);                     // Tipo di chunk
        this.writeUint32(ihdrChunk, width, 8);          // Larghezza
        this.writeUint32(ihdrChunk, height, 12);        // Altezza
        ihdrChunk[16] = 8;                              // Bit depth
        ihdrChunk[17] = 2;                              // Color type: RGB
        ihdrChunk[18] = 0;                              // Compression method
        ihdrChunk[19] = 0;                              // Filter method
        ihdrChunk[20] = 0;                              // Interlace method

        // CRC
        this.writeUint32(
            ihdrChunk,
            this.crc32(ihdrChunk.slice(4, 21)),
            21
        );

        return ihdrChunk;
    }

    private writeIDATandIENDChunks = (grid:Grid, width:number, height:number):IdatAndIendChunks =>
    {
        // Creare chunk IDAT
        let idatData = Buffer.alloc(width * height * 3 + height); // Data con filtri
        let pos = 0;

        const randomColor = this.getRandomColor();
        for (let y = 0; y < height; y++) {
            idatData[pos++] = 0; // Nessun filtro
            for (let x = 0; x < width; x++) {
                let { r, g, b } = this.backColor ?? { r:255, g:255, b:255 };
                if
                (
                    x >= this.padding
                    && x < width - this.padding
                    && y >= this.padding
                    && y < height - this.padding
                )
                {
                    const gridX = Math.floor((x - this.padding) / this.squareSize);
                    const gridY = Math.floor((y - this.padding) / this.squareSize);
                    if (grid[gridY][gridX] === 1) {
                        r = this.color?.r ?? randomColor.r;
                        g = this.color?.g ?? randomColor.g;
                        b = this.color?.b ?? randomColor.b;
                    }
                }


                idatData[pos++] = r; // R
                idatData[pos++] = g; // G
                idatData[pos++] = b; // B
            }
        }

        // Compress IDAT chunk data using zlib
        idatData = zlib.deflateSync(idatData);

        // Create IDAT chunk
        const idatChunk = Buffer.alloc(idatData.length + 12);
        this.writeUint32(idatChunk, idatData.length, 0);
        idatChunk.write('IDAT', 4);
        idatData.copy(idatChunk, 8);
        this.writeUint32(idatChunk, this.crc32(idatChunk.slice(4, idatChunk.length - 4)), idatChunk.length - 4);

        // Creare chunk IEND
        const iendChunk = Buffer.alloc(12);
        this.writeUint32(iendChunk, 0, 0); // Lunghezza
        iendChunk.write('IEND', 4);
        this.writeUint32(iendChunk, this.crc32(iendChunk.slice(4, 8)), 8); // CRC

        return { idatChunk, iendChunk }
    }
    // --- ;

    // --- Funzione per scrivere un intero come 4 byte big-endian
    private writeUint32 = (buffer:Buffer, value:number, offset:number) => {
        buffer[offset] = (value >> 24) & 0xff;
        buffer[offset + 1] = (value >> 16) & 0xff;
        buffer[offset + 2] = (value >> 8) & 0xff;
        buffer[offset + 3] = value & 0xff;
    }
    // --- ;

    // --- CRC32
    private createCrcTable():Uint32Array {
        const table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
            }
            table[i] = c;
        }

        return table;
    }
    private crc32(buf:Buffer):number {
        let crc = 0xffffffff;
        for (let i = 0; i < buf.length; i++) {
            crc = (crc >>> 8) ^ this.crcTable[(crc ^ buf[i]) & 0xff];
        }

        return (crc ^ 0xffffffff) >>> 0;
    }
    // --- ;
}
