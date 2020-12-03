namespace BioDeep.IO.MzWebCache {

    export class Stream {

        private index: string[] = [];
        private blocks: {} = {};
        private i: number = 0;

        public scantime_range: number[];

        public constructor(public label: string) { }

        public get done(): boolean {
            return this.i == this.index.length;
        }

        public item(i: number): StreamCacheBlock[] {
            return this.blocks[this.index[i]];
        }

        /**
         * @returns this function returns the ``scan_time`` value of
         *      current ms1 scan data
        */
        public add(block: StreamCacheBlock[]): number {
            let scan_id: string = block[0].scan_id;

            this.blocks[scan_id] = block;
            this.index.push(scan_id);

            return parseMs1Vector(block[0]).rt;
        }

        public reset() {
            this.i = 0;
        }

        public toString(): string {
            return `${this.label}: ${this.blocks[this.i][0].scan_id}`;
        }

        public seek(scan_id: string): StreamCacheBlock[] {
            return this.blocks[scan_id];
        }

        public getSummary(): {} {
            let summary: {} = {};

            for (let scan_id of this.index) {
                summary[scan_id] = $from(<StreamCacheBlock[]>this.blocks[scan_id])
                    .Skip(1)
                    .Select(a => a.scan_id)
                    .ToArray()
                    ;
            }

            return summary;
        }

        public load(ticks: IEnumerator<XICTick>): IEnumerator<mgf> {
            return ticks.Select(tick => this.read(tick));
        }

        public read(tick: XICTick): mgf {
            let raw = $from(this.seek(tick.ms1_scan)).Where(i => i.scan_id == tick.scan_id).First;
            let ms2 = parseMs2(raw);
            let meta = mgf.meta(1, ms2.rt, tick.scan_id, ms2.parentMz, ms2.intensity);
            let ions = $from(ms2.mz).Select((mzi, i) => new Models.mzInto(<any>(i + 1), mzi, ms2.into[i])).ToArray();

            return new mgf(meta, ions, tick.ms1_scan);
        }

        public XIC(): XICTick[] {
            let ticks: XICTick[] = [];

            for (let id of this.index) {
                let ms1: StreamCacheBlock[] = this.seek(id);

                for (let ms2 of ms1.slice(1)) {
                    let info = parseMs2Vector(ms2);
                    let tick = <XICTick>{
                        mz: info.mz,
                        rt: info.rt,
                        intensity: info.intensity,
                        ms1_scan: id,
                        scan_id: ms2.scan_id
                    };

                    ticks.push(tick);
                }
            }

            return ticks;
        }

        public selects(predicate: XICPredicate): IEnumerator<XICTick> {
            return $from(this.XIC()).Where(tick => predicate(tick));
        }

        public TIC(isBPC: boolean = false): { rt: number[], intensity: number[], tags: string[] } {
            let rt: number[] = [];
            let intensity: number[] = [];
            let tags: string[] = [];

            for (let id of this.index) {
                let ms1: StreamCacheBlock = this.seek(id)[0];
                let info = parseMs1Vector(ms1);

                rt.push(info.rt);
                intensity.push(isBPC ? info.BPC : info.TIC);
                tags.push(id);
            }

            return { rt: rt, intensity: intensity, tags: tags };
        }

        public Ms1Scan(scan_id: string): ScanMs1 {
            return parseMs1(this.seek(scan_id)[0]);
        }

        public loadNextScan(): ScanMs1 {
            let block: StreamCacheBlock[] = this.item(this.i++);
            let ms1: ScanMs1 = parseMs1(block[0]);
            let ms2: ScanMs2[] = $from(block).Skip(1).Select(c => parseMs2(c)).ToArray();

            ms1.products = ms2;

            return ms1;
        }
    }

    export interface XICPredicate { (tick: XICTick): boolean; }

    export interface XICTick {
        ms1_scan: string;
        scan_id: string;
        mz: number;
        rt: number;
        intensity: number;
    }

    export interface StreamCacheBlock {
        scan_id: string;
        data: string;
        mz_base64: string;
        into_base64: string;
    }
}