namespace BioDeep.Models {

    /**
     * 一个一级母离子的峰
    */
    export interface IonPeak {

        id: string;
        mz: number;
        rt: number;
        name: string;
        intensity: number;

    }
}