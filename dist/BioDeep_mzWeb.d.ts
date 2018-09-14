/// <reference path="../../build/linq.d.ts" />
declare namespace BioDeep {
    /**
     * 一个比较通用的二级质谱矩阵解析函数
     *
     * @param text 要求这个文本之中的每一行数据都应该是mz into的键值对
     *            mz和into之间的空白可以是任意空白
    */
    function GenericMatrixParser(text: string): Models.mzInto[];
}
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
        constructor(id: string, mz: number, into: number);
        toString(): string;
    }
}
/**
 * The ``*.ms2`` file format reader
*/
declare namespace BioDeep.IO.Ms2Reader {
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
        static Parse(text: string): Ms2;
        private static ParseScan;
    }
}
/**
 * The ``*.ms2`` file format reader
*/
declare namespace BioDeep.IO.Ms2Reader {
    class Ms2Header {
        /**
         * The date and time when the file was created
        */
        readonly CreationDate: string;
        /**
         * The name of the software used to create the MS2 file
        */
        readonly Extractor: string;
        /**
         * The version number of the Extractor software
        */
        readonly ExtractorVersion: string;
        readonly SourceFile: string;
        /**
         * Remarks. Multiple comment lines are allowed
        */
        readonly Comments: string;
        /**
         * The options used in running the extractor software
        */
        readonly ExtractorOptions: string;
        private static readonly fieldMaps;
        private readonly meta;
        constructor(data: string[]);
    }
}
/**
 * The ``*.ms2`` file format reader
*/
declare namespace BioDeep.IO.Ms2Reader {
    /**
     * Each scan begins with a few records listing the parameters describing the spectrum.
     * These lines must begin with ``S``, ``I``, ``Z``, or ``D``. The records are followed
     * by pairs of m/z and intensity values, one pair per line.
    */
    class Scan extends Models.IMs2Scan {
        readonly firstScan: number;
        readonly secondScan: number;
        readonly precursorMz: number;
        readonly RTime: number;
        readonly BPI: number;
        readonly BPM: number;
        readonly TIC: number;
        readonly charge: number;
        readonly mass: number;
        private readonly meta;
        constructor(meta: object, matrix: BioDeep.Models.mzInto[]);
    }
}
