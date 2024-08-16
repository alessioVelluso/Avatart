import { Grid, Size, IdatAndIendChunks, RgbArray, PngDetails } from "../types/generics";
import { AvatarGeneratorConstructor } from "../types/interfaces";
import fs from 'fs';
import zlib from 'zlib'
import { GridGenerator } from "./GridGenerator";
import { IAvatarGenerator } from "../types/interfaces";

export class AvatarGenerator extends GridGenerator implements IAvatarGenerator {
    // --- Data
    private readonly crcTable:Uint32Array;

    public readonly pngSignature:Buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    public readonly squareSize:number = 40;
    public readonly padding:number;
    public readonly color:RgbArray | undefined = undefined;
    public readonly backColor:RgbArray | undefined = undefined;

    constructor(constructor?:AvatarGeneratorConstructor) {
        super(constructor?.gridSize, constructor?.symmetry);

        const { squareSize, padding, color, backColor } = this.getDefaultOptions(constructor);
        this.squareSize = squareSize;
        this.padding = padding;
        this.color = color;
        this.backColor = backColor;

        this.crcTable = this.createCrcTable();
    }
    // --- ;

    // --- Public Methods
    public writeGridAvatarFile = (grid:Grid, fileTitle:string, options?:AvatarGeneratorConstructor) => {
        const outputBuffer:Buffer = this.getGridAvatarBuffer(grid, options);
        fs.writeFileSync(`${fileTitle}.png`, outputBuffer);
    }
    public writeAvatarFile = (fileTitle:string, options?:AvatarGeneratorConstructor) => {
        const grid = this.createGrid(options?.gridSize, options?.symmetry);
        this.writeGridAvatarFile(grid, fileTitle, options);
    }

    public getGridAvatarBuffer = (grid:Grid, options?:AvatarGeneratorConstructor):Buffer => {
        const pgnDetails = this.getDefaultOptions(options);

        const { width, height } = this.getSize(grid, pgnDetails);
        const ihdrChunk = this.writePngChunk(width, height);
        const { idatChunk, iendChunk } = this.writeIDATandIENDChunks(grid, width, height, pgnDetails)

        return Buffer.concat([
            this.pngSignature,
            ihdrChunk,
            idatChunk,
            iendChunk
        ]);
    }
    public getAvatarBuffer = (options?:AvatarGeneratorConstructor):Buffer => {
        const grid = this.createGrid(options?.gridSize, options?.symmetry);
        return this.getGridAvatarBuffer(grid, options);
    }

    public getRandomColor():RgbArray {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        return [ r, g, b ]
    }
    // --- ;

    // --- Build PNG Buffer
    private getSize = (grid:Grid, pngDetails:PngDetails):Size => {
        const width = (grid[0].length * pngDetails.squareSize) + (2 * pngDetails.padding);
        const height = (grid.length * pngDetails.squareSize) + (2 * pngDetails.padding);

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

    private writeIDATandIENDChunks = (grid:Grid, width:number, height:number, pngDetails:PngDetails):IdatAndIendChunks =>
    {
        // Creare chunk IDAT
        let idatData = Buffer.alloc(width * height * 3 + height); // Data con filtri
        let pos = 0;

        const randomColor = this.getRandomColor();
        const frontColor = {
            r: pngDetails.color ? pngDetails.color[0] : randomColor[0],
            g: pngDetails.color ? pngDetails.color[1] : randomColor[1],
            b: pngDetails.color ? pngDetails.color[2] : randomColor[2]
        }
        for (let y = 0; y < height; y++) {
            idatData[pos++] = 0; // Nessun filtro
            for (let x = 0; x < width; x++) {
                let [r, g, b] = pngDetails.backColor ?? [255,255,255];
                if
                (
                    x >= pngDetails.padding
                    && x < width - pngDetails.padding
                    && y >= pngDetails.padding
                    && y < height - pngDetails.padding
                )
                {
                    // Here we are inside the grid (excluding padding)
                    const gridX = Math.floor((x - pngDetails.padding) / pngDetails.squareSize);
                    const gridY = Math.floor((y - pngDetails.padding) / pngDetails.squareSize);
                    if (grid[gridY][gridX] === 1) {
                        // Here we found a colored spot and set the color to the required one | the default one | random one
                        r = frontColor.r;
                        g = frontColor.g;
                        b = frontColor.b;
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


    private getDefaultOptions(options?:AvatarGeneratorConstructor):PngDetails {
        const squareSize = options?.squareSize ?? this.squareSize;
        const padding = Math.ceil(squareSize / 2);

        const color = options?.color ?? this.color ?? undefined;
        const backColor = options?.backColor ?? this.color ?? undefined;

        return { squareSize, padding, color, backColor }
    }
}
