/// <reference path="../../build/linq.d.ts" />
declare namespace BioDeep.Models {
    class IMs2Scan extends IEnumerator<BioDeep.Models.mzInto> {
        readonly mzInto: BioDeep.Models.mzInto[];
        constructor(matrix: BioDeep.Models.mzInto[]);
    }
}
declare namespace BioDeep.IO {
    /**
     * mascot generic format files
     *
     * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
     *
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    class mgf extends Models.IMs2Scan {
        /**
         * PEPMASS
        */
        precursor_mass: number;
        /**
         * CHARGE
        */
        charge: number;
        /**
         * RTINSECONDS
        */
        rt: number;
        /**
         * TITLE
        */
        title: string;
        constructor(meta: object, matrix: BioDeep.Models.mzInto[]);
        static Parse(text: string): IEnumerator<mgf>;
        static readonly fieldMaps: Dictionary<string>;
        static IonParse(data: string[]): mgf;
        toString(): string;
    }
}
declare namespace BioDeep.IO {
    /**
     * The MS2 file format is used to record MS/MS spectra. A full description of the
     * MS2 file format may be found in:
     *
     * > McDonald,W.H. et al. MS1, MS2, and SQT-three unified, compact, and easily
     * > parsed file formats for the storage of shotgun proteomic spectra and
     * > identifications. Rapid Commun. Mass Spectrom. 18, 2162-2168 (2004).
    */
    class Ms2 {
        header: Ms2Header;
        scans: Scan[];
    }
    class Ms2Header {
        /**
         * The date and time when the file was created
        */
        CreationDate: string;
        /**
         * The name of the software used to create the MS2 file
        */
        Extractor: string;
        /**
         * The version number of the Extractor software
        */
        ExtractorVersion: string;
        SourceFile: string;
        /**
         * Remarks. Multiple comment lines are allowed
        */
        Comments: string;
        /**
         * The options used in running the extractor software
        */
        ExtractorOptions: string;
    }
    /**
     * Each scan begins with a few records listing the parameters describing the spectrum.
     * These lines must begin with ``S``, ``I``, ``Z``, or ``D``. The records are followed
     * by pairs of m/z and intensity values, one pair per line.
    */
    class Scan extends Models.IMs2Scan {
        firstScan: number;
        secondScan: number;
        precursorMz: number;
        RTime: number;
        BPI: number;
        BPM: number;
        TIC: number;
        charge: number;
        mass: number;
    }
}
declare namespace BioDeep.Models {
    class mzInto {
        id: string;
        /**
         * m/z
        */
        mz: number;
        /**
         * intensity
        */
        into: number;
        toString(): string;
    }
}
