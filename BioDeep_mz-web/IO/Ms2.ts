/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />

/**
 * The ``*.ms2`` file format reader
*/
namespace BioDeep.IO.Ms2Reader {

    /**
     * The MS2 file format is used to record MS/MS spectra. A full description of the 
     * MS2 file format may be found in:
     * 
     * > McDonald,W.H. et al. MS1, MS2, and SQT-three unified, compact, and easily 
     * > parsed file formats for the storage of shotgun proteomic spectra and 
     * > identifications. Rapid Commun. Mass Spectrom. 18, 2162-2168 (2004).
    */
    export class Ms2 {

        public header: Ms2Header;
        public scans: Scan[];

        public static Parse(text: string): Ms2 {
            var lines: IEnumerator<string> = From(BioDeep.lineTokens(text));
            var headers = lines
                .TakeWhile(s => s.charAt(0) == "H")
                .ToArray();
            var scans = lines
                .Skip(headers.length)
                .ChunkWith(line => line.charAt(0) == "S", true)
                .Where(block => block.length > 0)
                .Select(Ms2.ParseScan)
                .ToArray();

            return <Ms2>{
                header: new Ms2Header(headers),
                scans: scans
            };
        }

        private static ParseScan(data: string[]): Scan {
            var line: number = -1;
            var meta: object = {};
            
            for (var i: number = 0; i < data.length; i++) {
                var first = data[i].charAt(0);

                if (BioDeep.isNumber(first)) {
                    line = i;
                    break;
                }

                var tokens: string[] = data[i].split("\t");

                switch (first) {
                    case "S":

                        // S	2	2	0
                        meta["firstScan"] = parseFloat(tokens[1]);
                        meta["secondScan"] = parseFloat(tokens[2]);
                        meta["precursorMz"] = parseFloat(tokens[3]);
                        break;

                    case "I":

                        // I	RTime	0.01252833
                        meta[tokens[1]] = tokens[2];
                        break;

                    case "Z":

                        // Z	1	482.4038
                        meta["charge"] = parseFloat(tokens[1]);
                        meta["mass"] = parseFloat(tokens[2]);
                        break;

                    default:
                        throw `Parser for ${first} not implements yet.`;
                }
            }

            var matrix: BioDeep.Models.mzInto[];

            if (line == -1) {
                matrix = [];
            } else {
                matrix = From(data)
                    .Skip(line)
                    .Select((text, i) => {
                        var tokens: string[] = text.split(" ");
                        var mz: number = parseFloat(tokens[0]);
                        var into: number = parseFloat(tokens[1]);

                        return <BioDeep.Models.mzInto>{
                            mz: mz,
                            into: into,
                            id: (i + 1).toString()
                        };
                    })
                    .ToArray();
            }

            return new Scan(meta, matrix);
        }
    }

    export class Ms2Header {

        /**
         * The date and time when the file was created
        */
        public get CreationDate(): string {
            console.log(BioDeep.stackTrace());
            return this.meta.GetValue();
        };
        /**
         * The name of the software used to create the MS2 file
        */
        public Extractor: string;
        /**
         * The version number of the Extractor software
        */
        public ExtractorVersion: string;
        public SourceFile: string;
        /**
         * Remarks. Multiple comment lines are allowed
        */
        public Comments: string;
        /**
         * The options used in running the extractor software
        */
        public ExtractorOptions: string;

        private static readonly fieldMaps = {
            "Extractor version": "ExtractorVersion",
            "Source file": "SourceFile"
        };

        private readonly meta: TsLinq.MetaReader;

        public constructor(data: string[]) {
            var tags = From(data)
                .Select(s => s.substr(2))
                .Select(s => {
                    if (s.indexOf("\t") > -1) {
                        return Strings.GetTagValue(s, "\t");
                    } else {
                        return Strings.GetTagValue(s, " ");
                    }
                });

            this.meta = TypeInfo.CreateMetaReader(tags);
        }
    }

    /**
     * Each scan begins with a few records listing the parameters describing the spectrum. 
     * These lines must begin with ``S``, ``I``, ``Z``, or ``D``. The records are followed 
     * by pairs of m/z and intensity values, one pair per line.
    */
    export class Scan extends Models.IMs2Scan {

        //#region "S"
        public get firstScan(): number {
            return this.meta.GetValue();
        };
        public secondScan: number;
        public precursorMz: number;
        //#endregion

        //#region "I"
        public RTime: number;
        public BPI: number;
        public BPM: number;
        public TIC: number;
        //#endregion

        //#region "Z"
        public charge: number;
        public mass: number;
        //#endregion

        private readonly meta: TsLinq.MetaReader;

        public constructor(meta: object, matrix: BioDeep.Models.mzInto[]) {
            super(matrix);
            // read meta object value by call name
            this.meta = new TsLinq.MetaReader(meta);
        }
    }
}