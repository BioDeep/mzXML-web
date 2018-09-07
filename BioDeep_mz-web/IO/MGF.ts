/// <reference path="../../../build/linq.d.ts" />

namespace BioDeep.IO {

    /**
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    export class mgf extends IEnumerator<BioDeep.Models.mzInto> {

        public get mzInto(): BioDeep.Models.mzInto[] {
            return [...this.sequence];
        };

        public static Parse(text: string): mgf {

        }
    }
}