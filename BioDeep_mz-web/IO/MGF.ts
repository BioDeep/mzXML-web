/// <reference path="../../../build/linq.d.ts" />

namespace BioDeep.IO {

    const mgfBeginIons: string = "BEGIN IONS"
    const mgfEndIons: string = "END IONS";

    /**
     * mascot generic format files
     * 
     * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
     * 
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    export class mgf extends IEnumerator<BioDeep.Models.mzInto> {

        /**
         * PEPMASS
        */
        public precursor_mass: number;
        /**
         * CHARGE
        */
        public charge: number;
        /**
         * RTINSECONDS
        */
        public rt: number;
        /**
         * TITLE
        */
        public title: string;

        public get mzInto(): BioDeep.Models.mzInto[] {
            return [...this.sequence];
        };

        public static Parse(text: string): IEnumerator<mgf> {
            return From(text.split("\n"))
                .ChunkWith(line => line == mgfEndIons)
                .Select(data => mgf.IonParse(data));
        }

        public static IonParse(data: string[]): mgf {

        }

        public toString(): string {
            return this.title;
        }
    }
}