/// <reference path="../../build/linq.d.ts" />
declare namespace BioDeep.IO {
    /**
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    class mgf extends IEnumerator<BioDeep.Models.mzInto> {
        readonly mzInto: BioDeep.Models.mzInto[];
        static Parse(text: string): mgf;
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
