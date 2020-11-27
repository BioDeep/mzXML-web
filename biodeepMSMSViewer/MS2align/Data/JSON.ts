namespace BioDeep.MSMSViewer.Data {

    /**
     * Demo test data
     * 
     * ```js
     * var data = {
     *    query: "CH<sub>3</sub>H<sub>2</sub>O",
     *    reference: "CO<sub>2</sub>NH<sub>4</sub>",
     *    align : [
     *        {mz: 10, int1:15,  int2: 20},
     *        {mz:125, int1:20,  int2: 30},
     *        {mz:200, int1:0,   int2:100},
     *        {mz:273, int1:0,   int2:100},
     *        {mz:300, int1:22,  int2:100},
     *        {mz:400, int1:100, int2: 18},
     *        {mz:600, int1:2,   int2:  6},
     *        {mz:800, int1:26,  int2: 18}
     *    ]}; 
     * ```
    */
    export interface JSONrespon {
        query: string;
        reference: string;
        align: align[] | string;
        xref: string;
    }

    export interface align {
        mz: number;
        into1: number;
        into2: number;
    }
}