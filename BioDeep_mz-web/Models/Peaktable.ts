namespace BioDeep.Models {

    /**
     * 一个一级母离子的峰
    */
    export class IonPeak {

        public id: string;
        public mz: number;
        public rt: number;
        public name: string;
        public intensity: number;

    }
}