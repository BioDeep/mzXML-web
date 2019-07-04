namespace BioDeep.Models {

    export interface ChromatogramTick {
        rt: number;
        intensity: number;
    }

    export function TIC(ions: IEnumerator<BioDeep.IO.mgf>): IEnumerator<ChromatogramTick> {
        return ions
            .OrderBy(i => i.rt)
            .Select(i => <ChromatogramTick>{
                rt: i.rt,
                intensity: i.intensity
            });
    }
}