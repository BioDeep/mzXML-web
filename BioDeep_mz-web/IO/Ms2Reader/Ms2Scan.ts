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
        public get secondScan(): number {
            return this.meta.GetValue();
        };
        public get precursorMz(): number {
            return this.meta.GetValue();
        };
        //#endregion

        //#region "I"
        public get RTime(): number {
            return this.meta.GetValue();
        };
        public get BPI(): number {
            return this.meta.GetValue();
        };
        public get BPM(): number {
            return this.meta.GetValue();
        };
        public get TIC(): number {
            return this.meta.GetValue();
        };
        //#endregion

        //#region "Z"
        public get charge(): number {
            return this.meta.GetValue();
        };
        public get mass(): number {
            return this.meta.GetValue();
        };
        //#endregion

        private readonly meta: TypeScript.Data.MetaReader;

        public constructor(meta: object, matrix: BioDeep.Models.mzInto[]) {
            super(matrix);
            // read meta object value by call name
            this.meta = new TypeScript.Data.MetaReader(meta);
        }
    }
}