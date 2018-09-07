/// <reference path="../../build/linq.d.ts" />
declare namespace BioDeep.IO {
    /**
     * mascot generic format files
     *
     * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
     *
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    class mgf extends IEnumerator<BioDeep.Models.mzInto> {
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
        readonly mzInto: BioDeep.Models.mzInto[];
        constructor(meta: object, matrix: BioDeep.Models.mzInto[]);
        static Parse(text: string): IEnumerator<mgf>;
        static readonly fieldMaps: Dictionary<string>;
        static IonParse(data: string[]): mgf;
        toString(): string;
    }
}
declare namespace BioDeep.Models {
    class mzInto {
        id: string;
        mz: number;
        into: number;
        toString(): string;
    }
}
