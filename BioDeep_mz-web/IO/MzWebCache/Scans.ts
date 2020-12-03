namespace BioDeep.IO.MzWebCache {

    export interface MSScan {
        rt: number;
        scan_id: string;
        mz: number[];
        into: number[];
    }

    export interface ScanMs1 extends MSScan {
        TIC: number;
        BPC: number;
        products: ScanMs2[];
    }

    export interface ScanMs2 extends MSScan {
        parentMz: number;
        intensity: number;
        polarity: number;
    }
}