/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />

namespace BioDeep.IO {

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
    }

    export class Ms2Header {

        /**
         * The date and time when the file was created
        */
        public CreationDate: string;
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
    }

    /**
     * Each scan begins with a few records listing the parameters describing the spectrum. 
     * These lines must begin with ``S``, ``I``, ``Z``, or ``D``. The records are followed 
     * by pairs of m/z and intensity values, one pair per line.
    */
    export class Scan extends Models.IMs2Scan {

        //#region "S"
        public firstScan: number;
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
    }
}