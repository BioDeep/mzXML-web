/// <reference path="../../../../build/linq.d.ts" />
/// <reference path="../../Models/Abstract.ts" />

/**
 * The ``*.ms2`` file format reader
*/
namespace BioDeep.IO.Ms2Reader {

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