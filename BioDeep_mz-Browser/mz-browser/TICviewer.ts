namespace BioDeep {

    export class TICviewer {

        private fileTree: fileBrowser.fileIndexTree;
        private chart = new BioDeep.MSMSViewer.TICplot(ion => {
            BioDeep.MSMSViewer.previews("#plot", ion, [800, 500]);
            $ts("#peaks").display(BioDeep.Views.CreateTableFromMgfIon(ion));
        });

        public constructor(fileTree: fileBrowser.fileIndexTree) {
            this.fileTree = fileTree;
        }

        public draw(id: string, src: string = "@mgf") {
            var vm = this;

            layer.load(5);

            $ts.getText(src, function (text) {
                let mgf = BioDeep.IO.mgf.Parse(text);
                let maxInto = mgf.Max(m => m.intensity).intensity;

                // mgf = mgf.Where(m => (m.intensity / maxInto) >= 0.01);

                vm.chart.plot(id, mgf);
                vm.buildMzList(mgf, id);

                layer.closeAll();
            });

            fileBrowser.createTree("#fileTree", vm.fileTree, vm);
        }

        private buildMzList(mgf: IEnumerator<IO.mgf>, id: string) {
            let mzGroup = mgf
                .GroupBy(i => i.precursor_mass, TICviewer.mzTree)
                .ToDictionary(x => x.Key.toString(), x => <IEnumerator<IO.mgf>>x);

            let selects = $ts("#mzlist");
            let vm = this;

            // display all ions
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