namespace BioDeep.MSMSViewer {

    /**
     * 一级母离子的``[rt, intensity]``峰面积图
    */
    export class TICplot extends SvgChart {

        plot(id: string, ticks: IEnumerator<BioDeep.Models.ChromatogramTick> | IEnumerator<BioDeep.IO.mgf>) {
            if (ticks.ElementType.class == "mgf") {
                ticks = BioDeep.Models.TIC(<IEnumerator<BioDeep.IO.mgf>>ticks);
            }


        }
    }
}