namespace BioDeep.Models {

    /**
     * ``[mz, into]``行，即一个质谱图碎片
    */
    export class mzInto {

        public id: string;

        /**
         * m/z
         * 
         * X 坐标轴数据
        */
        public mz: number;
        /**
         * intensity
         * 
         * 进行绘图操作的时候所需要的Y坐标轴数据，以及鼠标提示
         * 显示所需要用到的原始的质谱信号强度数据
        */
        public into: number;

        public constructor(id: string, mz: number, into: number) {
            this.id = id;
            this.mz = mz;
            this.into = into;
        }

        public toString(): string {
            return `${this.mz}/${this.into}`;
        }
    }

    export enum SpectrumLevels {
        MS1 = 1,
        MS2 = 2,
        MS3 = 10
    }

    export function SpectrumMatrix(data: IEnumerator<IO.mgf>, levels: number): IEnumerator<mzInto> {
        if (levels == SpectrumLevels.MS1) {
            // only ms1
            return data.Select(ion => new mzInto("", ion.precursor_mass, ion.intensity));
        } else if (levels == SpectrumLevels.MS2) {
            // only ms2
            return data.Select(ion => ion.mzInto).Unlist(ms2 => ms2);
        } else if (levels == SpectrumLevels.MS1 + SpectrumLevels.MS2) {
            return data.Select(function (ion) {
                let union = [...ion.mzInto];
                let ms1 = new mzInto("", ion.precursor_mass, ion.intensity);

                // union ms1 and ms2
                union.push(ms1);

                return union;
            }).Unlist(sp => sp);
        } else {
            throw "not implements yet!";
        }
    }
}