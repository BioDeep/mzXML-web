namespace BioDeep {

    export class RawFileViewer {

        private fileTree: fileBrowser.fileIndexTree;
        private chart = new BioDeep.MSMSViewer.TICplot([800, 350], ion => {
            let maxInto = ion.Select(m => m.into).Max();
            let simple = ion.Where(m => (m.into / maxInto) >= 0.05).ToArray(false);

            RawFileViewer.doSpectrumRender(new IO.mgf(ion, simple));
        });
        private spectrums = new BioDeep.MSMSViewer.Spectrum([800, 350]);

        public constructor(fileTree: fileBrowser.fileIndexTree) {
            this.fileTree = fileTree;
        }

        private static doSpectrumRender(ion: IO.mgf) {
            let matrixTable = BioDeep.Views.CreateTableFromMgfIon(ion, true, {
                id: "peakMs2-matrix",
                style: "width: 100%;"
            });

            BioDeep.MSMSViewer.previews("#plot", ion, [700, 500]);

            matrixTable.style.width = "50%";
            matrixTable.style.textAlign = "left";

            $ts("#peaks").display(matrixTable);
            reorderHandler();
        }

        public draw(id: string, src: string = "@mgf") {
            var vm = this;

            layer.load(5);
            // https://github.com/natewatson999/js-gc
            TypeScript.gc();

            $ts.getText(src, function (text) {
                try {
                    RawFileViewer.doDraw(vm, id, text);
                } catch {

                }

                setTimeout(layer.closeAll, 2000);
            });

            fileBrowser.createTree("#fileTree", vm.fileTree, vm);
        }

        private static doDraw(vm: RawFileViewer, id: string, text: string) {
            let mgf = BioDeep.IO.mgf.Parse(text);
            let maxInto = mgf.Max(m => m.intensity).intensity;
            let doSIM = $ts("#do_SIM");

            doSIM.onclick = function () {
                var min = parseFloat($ts("#sim-min").CType<HTMLInputElement>().value);
                var max = parseFloat($ts("#sim-max").CType<HTMLInputElement>().value);
                var SIM = mgf.Where(ion => ion.precursor_mass >= min && ion.precursor_mass <= max);

                vm.chart.plot("#sim-TIC", SIM);
                vm.spectrums.renderChartFromMgf("#sim-spectrum", SIM, 1 + 2);
            }

            vm.chart.plot(id, mgf);
            vm.buildMzList(mgf, id);
        }

        private buildMzList(mgf: IEnumerator<IO.mgf>, id: string) {
            let mzGroup = mgf
                .GroupBy(i => i.precursor_mass, RawFileViewer.mzTree)
                .ToDictionary(x => x.Key.toString(), x => <IEnumerator<IO.mgf>>x);

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
                    }).display(mz.key);

                    selects.appendChild(opt)
                });

            selects.onchange = function () {
                let mz = (<HTMLSelectElement><any>selects).value;
                let part: IEnumerator<IO.mgf>;

                if (mz == "rawfile" || !mzGroup.ContainsKey(mz)) {
                    part = mgf;
                } else {
                    part = mzGroup.Item(mz);
                }

                vm.chart.plot(id, part);
            }
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