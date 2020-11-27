namespace BioDeep {

    export class RawFileViewer {

        private chart: BioDeep.MSMSViewer.TICplot;
        private spectrums = new BioDeep.MSMSViewer.Spectrum([730, 350], new Canvas.Margin(50, 10, 10, 30));

        public constructor(public fileTree: BioDeep.IO.MzWebCache.Stream, private viewer: pages.mzwebViewer) { }

        private static doSpectrumRender(ion: IO.mgf) {
            let matrixTable = BioDeep.Views.CreateTableFromMgfIon(ion, true, {
                id: "peakMs2-matrix",
                style: "width: 100%;"
            });

            BioDeep.MSMSViewer.previews("#plot", ion, [690, 400], ion.title);

            matrixTable.style.width = "50%";
            matrixTable.style.textAlign = "left";

            $ts("#peaks").display(matrixTable);

            return new reorderHandler().addHandle();
        }

        public draw(id: string, isBPC: boolean) {
            let vm = this;
            let TIC = this.fileTree.TIC(isBPC);

            layer.load(5);
            // https://github.com/natewatson999/js-gc
            TypeScript.gc();

            vm.chart = new BioDeep.MSMSViewer.TICplot([700, 350], scan_id => this.ViewMs1(scan_id));
            vm.chart.plotData(id, TIC.rt, TIC.intensity, TIC.tags);
            vm.buildMzList(id);

            layer.closeAll();
        }

        public ViewMs1(scan_id: string) {
            let ms1 = this.fileTree.Ms1Scan(scan_id);
            let meta = IO.mgf.meta(0, ms1.rt, scan_id, "MS1", ms1.TIC);
            let ions = $from(ms1.mz).Select((mzi, i) => new Models.mzInto(<any>(i + 1), mzi, ms1.into[i]));
            let maxinto = ions.Max(i => i.into).into;
            let mgf = new IO.mgf(meta, ions.Where(i => (i.into / maxinto) >= 0.05));

            RawFileViewer.doSpectrumRender(mgf);
        }

        public ViewMs2(parent: string, scan_id: string) {
            let ms2 = $from(this.fileTree.seek(parent)).Where(i => i.scan_id == scan_id).First;
            let ms2Val = IO.MzWebCache.parseMs2(ms2);
            let meta = IO.mgf.meta(1, ms2Val.rt, scan_id, ms2Val.parentMz, ms2Val.intensity);
            let ions = $from(ms2Val.mz).Select((mzi, i) => new Models.mzInto(<any>(i + 1), mzi, ms2Val.into[i]));
            let mgf = new IO.mgf(meta, ions);

            RawFileViewer.doSpectrumRender(mgf);
        }

        public ViewIon(ion: IO.mgf) {
            let ms1 = this.fileTree.Ms1Scan(ion.parent_id);
            let ions = [...ion.mzInto];

            for (let fragment of $from(ms1.mz)
                .Select((mzi, i) => new Models.mzInto(<any>(i + 1), mzi, ms1.into[i]))
                .ToArray()) {

                ions.push(fragment);
            }

            this.spectrums.renderChart("#sim-spectrum", $from(ions));

            let maxInto = ion.Select(m => m.into).Max();
            let simple = ion.Where(m => (m.into / maxInto) >= 0.05).ToArray(false);

            RawFileViewer.doSpectrumRender(new IO.mgf(ion, simple));
        }

        /**
         * XIC
        */
        private buildMzList(id: string) {
            let mzGroup = $from(this.fileTree.XIC())
                .GroupBy(i => i.mz, RawFileViewer.mzTree)
                .Where(mzgroup => mzgroup.Count > 2)
                .ToDictionary(
                    x => x.Key.toString(),
                    x => <IEnumerator<IO.MzWebCache.XICTick>>x
                );

            let selects = $ts("#mzlist");
            let vm = this;

            // clear all of its previous data
            // then display all ions
            selects.clear();
            selects.appendChild($ts("<option>", { value: "rawfile" }).display("Raw File"));

            mzGroup.OrderBy(mz => parseFloat(mz.key))
                .ForEach(mz => {
                    var opt = $ts("<option>", {
                        value: mz.key
                    }).display(Strings.round(parseFloat(mz.key), 4).toString());

                    selects.appendChild(opt)
                });

            selects.onchange = function () {
                let mz = (<HTMLSelectElement><any>selects).value;

                if (mz == "rawfile" || !mzGroup.ContainsKey(mz)) {
                    vm.draw(id, $input("#bpc").checked);
                } else {
                    vm.showXIC(id, mzGroup.Item(mz));
                }

                vm.viewer.showTIC();
            }
        }

        public showXIC(id: string, xic: IEnumerator<IO.MzWebCache.XICTick>) {
            let mgf: IEnumerator<IO.mgf> = this.fileTree.load(xic);

            this.chart = new BioDeep.MSMSViewer.TICplot([700, 350], ion => this.ViewIon(ion));
            this.chart.plot(id, mgf);
        }

        private static mzTree(m1: number, m2: number): number {
            if (Math.abs(m1 - m2) <= 0.1) {
                return 0;
            } else {
                return m1 > m2 ? 1 : -1;
            }
        }
    }
}