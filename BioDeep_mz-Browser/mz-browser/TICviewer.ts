namespace BioDeep {

    export class TICviewer {

        private chart = new BioDeep.MSMSViewer.TICplot();

        public draw(id: string) {
            var vm = this;

            $ts.getText("@mgf", function (text) {
                let mgf = BioDeep.IO.mgf.Parse(text);

                vm.chart.plot(id, mgf);
                vm.buildMzList(mgf, id);
            });
        }

        private buildMzList(mgf: IEnumerator<IO.mgf>, id: string) {
            let mzGroup = mgf
                .GroupBy(i => i.precursor_mass, TICviewer.mzTree)
                .ToDictionary(x => x.Key.toString(), x => <IEnumerator<IO.mgf>>x);

            let selects = $ts("#mzlist");
            let vm = this;

            mzGroup.ForEach(mz => {
                var opt = $ts("<option>", {
                    value: mz.key
                }).display(mz.key);

                selects.appendChild(opt)
            });

            selects.onchange = function () {
                let mz = (<HTMLSelectElement><any>selects).value;
                let part = mzGroup.Item(mz);

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