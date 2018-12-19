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
}