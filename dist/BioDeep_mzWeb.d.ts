/// <reference path="vendor/linq.d.ts" />
declare namespace BioDeep {
    /**
     * 一个比较通用的二级质谱矩阵解析函数
     *
     * ```
     * mz1 into1
     * mz2 into2
     * mz3 into3
     * ...
     * ```
     *
     * @param text 要求这个文本之中的每一行数据都应该是mz into的键值对
     *            mz和into之间的空白可以是任意空白
    */
    function GenericMatrixParser(text: string): Models.mzInto[];
    /**
     * 这个函数输入的文本内容是``base64``字符串
    */
    function GenericBase64MatrixParser(base64Stream: string): Models.mzInto[];
    function ppm_primitive(x: number, y: number): number;
    function ppm(x: number | IEnumerator<number> | number[], y: number | IEnumerator<number> | number[]): number | number[];
}
declare namespace BioDeep.Models {
    class IMs2Scan extends IEnumerator<BioDeep.Models.mzInto> {
        get mzInto(): BioDeep.Models.mzInto[];
        constructor(matrix: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>);
    }
}
declare namespace BioDeep.IO {
    const mgfBeginIons: string;
    const mgfEndIons: string;
    /**
     * mascot generic format files.(一个二级碎片集合对象)
     *
     * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
     *
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    class mgf extends Models.IMs2Scan {
        parent_id: string;
        /**
         * PEPMASS
        */
        precursor_mass: number | string;
        intensity: number;
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
        get xcms_uid(): string;
        get ionPeak(): Models.IonPeak;
        /**
         * @param meta 可以在进行复制的时候，直接传递其自身进来，只需要保持属性名称一致即可
        */
        constructor(meta: object, matrix: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>, parent_id?: string);
        static meta(charge: number, rt: number, title: string, precursor_mass: number | string, intensity: number): {
            charge: number;
            rt: number;
            title: string;
            precursor_mass: string | number;
            intensity: number;
        };
        static Clone(ion: mgf): mgf;
        static Parse(text: string): IEnumerator<mgf>;
        static readonly fieldMaps: Dictionary<string>;
        static IonParse(data: any): mgf;
        toString(): string;
    }
}
declare namespace BioDeep.IO {
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
        get CreationDate(): string;
        /**
         * The name of the software used to create the MS2 file
        */
        get Extractor(): string;
        /**
         * The version number of the Extractor software
        */
        get ExtractorVersion(): string;
        get SourceFile(): string;
        /**
         * Remarks. Multiple comment lines are allowed
        */
        get Comments(): string;
        /**
         * The options used in running the extractor software
        */
        get ExtractorOptions(): string;
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
        get firstScan(): number;
        get secondScan(): number;
        get precursorMz(): number;
        get RTime(): number;
        get BPI(): number;
        get BPM(): number;
        get TIC(): number;
        get charge(): number;
        get mass(): number;
        private readonly meta;
        constructor(meta: object, matrix: BioDeep.Models.mzInto[]);
    }
}
declare namespace BioDeep.IO.MzWebCache {
    function loadStream(text: string, name?: string): Stream;
    function blockBuffer(buffer: string[]): StreamCacheBlock[];
    function parseMs2Vector(cache: StreamCacheBlock): {
        mz: number;
        rt: number;
        intensity: number;
    };
    function parseMs1Vector(cache: StreamCacheBlock): {
        rt: number;
        BPC: number;
        TIC: number;
    };
    function parseMs1(cache: StreamCacheBlock): ScanMs1;
    function parseMs2(cache: StreamCacheBlock): ScanMs2;
}
declare namespace BioDeep.IO.MzWebCache {
    interface MSScan {
        rt: number;
        scan_id: string;
        mz: number[];
        into: number[];
    }
    interface ScanMs1 extends MSScan {
        TIC: number;
        BPC: number;
        products: ScanMs2[];
    }
    interface ScanMs2 extends MSScan {
        parentMz: number;
        intensity: number;
    }
}
declare namespace BioDeep.IO.MzWebCache {
    class Stream {
        label: string;
        private index;
        private blocks;
        private i;
        constructor(label: string);
        get done(): boolean;
        item(i: number): StreamCacheBlock[];
        add(block: StreamCacheBlock[]): void;
        reset(): void;
        toString(): string;
        seek(scan_id: string): StreamCacheBlock[];
        getSummary(): {};
        load(ticks: IEnumerator<XICTick>): IEnumerator<mgf>;
        read(tick: XICTick): mgf;
        XIC(): XICTick[];
        selects(predicate: XICPredicate): IEnumerator<XICTick>;
        TIC(isBPC?: boolean): {
            rt: number[];
            intensity: number[];
            tags: string[];
        };
        Ms1Scan(scan_id: string): ScanMs1;
        loadNextScan(): ScanMs1;
    }
    interface XICPredicate {
        (tick: XICTick): boolean;
    }
    interface XICTick {
        ms1_scan: string;
        scan_id: string;
        mz: number;
        rt: number;
        intensity: number;
    }
    interface StreamCacheBlock {
        scan_id: string;
        data: string;
        mz_base64: string;
        into_base64: string;
    }
}
declare namespace BioDeep.Models {
    interface ChromatogramTick {
        rt: number;
        intensity: number;
        /**
         * The source data object of current tick point
        */
        raw: any;
    }
    function TIC(ions: IEnumerator<BioDeep.IO.mgf>): IEnumerator<ChromatogramTick>;
    function Chromatogram(rt: number[], intensity: number[], tags?: any[]): IEnumerator<ChromatogramTick>;
}
declare namespace BioDeep.Models {
    /**
     * 一个一级母离子的峰
    */
    interface IonPeak {
        id: string;
        mz: number;
        rt: number;
        name: string;
        intensity: number;
    }
}
declare namespace BioDeep.Models {
    /**
     * ``[mz, into]``行，即一个质谱图碎片
    */
    class mzInto {
        id: string;
        mz: number;
        into: number;
        /**
         * @param id
         * @param mz ``m/z`` X 坐标轴数据
         * @param into intensity 进行绘图操作的时候所需要的Y坐标轴数据，以及鼠标提示
         *             显示所需要用到的原始的质谱信号强度数据
        */
        constructor(id: string, mz: number, into: number);
        toString(): string;
    }
    enum SpectrumLevels {
        MS1 = 1,
        MS2 = 2,
        MS3 = 10
    }
    function SpectrumMatrix(data: IEnumerator<IO.mgf>, levels: number): IEnumerator<mzInto>;
}
declare namespace BioDeep.Views {
    function CreateTableFromMgfIon(ion: IO.mgf, relative?: boolean, attrs?: Internal.TypeScriptArgument): HTMLElement;
    function CreateTableFromMatrix(matrix: IEnumerator<Models.mzInto>, relative?: boolean, attrs?: Internal.TypeScriptArgument): HTMLElement;
}
