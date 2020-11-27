namespace BioDeep.Models {

    export interface ChromatogramTick {
        rt: number;
        intensity: number;
        /**
         * The source data object of current tick point
        */
        raw: any;
    }

    export function TIC(ions: IEnumerator<BioDeep.IO.mgf>): IEnumerator<ChromatogramTick> {
        return ions
            .OrderBy(i => i.rt)
            .Select(i => <ChromatogramTick>{
                rt: i.rt,
                intensity: i.intensity,
                raw: i
            });
    }

    export function Chromatogram(rt: number[], intensity: number[], tags: any[] = null): IEnumerator<ChromatogramTick> {
        let isNullTags: boolean = isNullOrUndefined(tags);

        return $from(rt).Select(function (rti, i) {
            return <ChromatogramTick>{
                rt: rti,
                intensity: intensity[i],
                raw: isNullTags ? null : tags[i]
            }
        })
    }
}