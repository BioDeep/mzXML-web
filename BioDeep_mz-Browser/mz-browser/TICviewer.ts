namespace BioDeep {

    function reorderHandler() {
        let tbody = (<IEnumerator<HTMLElement>><any>$ts("tbody")).ElementAt(0);
        console.log(tbody);
        let bodyRows = $ts(tbody.getElementsByTagName("tr"));
        let preOrders = { field: "mz", order: 1 };
        console.log(bodyRows);

        let table = $ts("#peakMs2-matrix");
        let headers = $ts(table.getElementsByTagName("thead").item(0).getElementsByTagName("th"));

        let mzIndex: number;
        let intoIndex: number;

        headers.ForEach(function (r, i) {
            if (r.innerText == "mz") {
                mzIndex = i;
            }
        });
        headers.ForEach(function (r, i) {
            if (r.innerText == "into") {
                intoIndex = i;
            }
        })

        $ts("#mz").display($ts("<a>", {
            href: executeJavaScript,
            onclick: function () {
                let isAsc: boolean;
                let orderRows: IEnumerator<HTMLTableRowElement>;

                if (preOrders.field == "mz") {
                    isAsc = preOrders.order == 1;
                    preOrders.order = preOrders.order == 1 ? 0 : 1;
                } else {
                    preOrders.field = "mz";
                    preOrders.order = 1;
                    isAsc = false;
                }

                if (isAsc) {
                    orderRows = bodyRows.OrderBy(r => parseFloat(r.getElementsByTagName("td").item(mzIndex).innerText));
                } else {
                    orderRows = bodyRows.OrderByDescending(r => parseFloat(r.getElementsByTagName("td").item(mzIndex).innerText));
                }

                tbody.innerHTML = "";
                orderRows.ForEach(r => tbody.appendChild(r));
            }
        }).display("mz"));

        $ts("#into").display($ts("<a>", {
            href: executeJavaScript,
            onclick: function () {
                let isAsc: boolean;
                let orderRows: IEnumerator<HTMLTableRowElement>;

                if (preOrders.field == "into") {
                    isAsc = preOrders.order == 1;
                    preOrders.order = preOrders.order == 1 ? 0 : 1;
                } else {
                    preOrders.field = "into";
                    preOrders.order = 1;
                    isAsc = false;
                }

                if (isAsc) {
                    orderRows = bodyRows.OrderBy(r => parseFloat(r.getElementsByTagName("td").item(intoIndex).innerText));
                } else {
                    orderRows = bodyRows.OrderByDescending(r => parseFloat(r.getElementsByTagName("td").item(intoIndex).innerText));
                }

                tbody.innerHTML = "";
                orderRows.ForEach(r => tbody.appendChild(r));
            }
        }).display("into"));
    }

    export class TICviewer {

        private fileTree: fileBrowser.fileIndexTree;
        private chart = new BioDeep.MSMSViewer.TICplot([800, 350], ion => {
            let matrixTable = BioDeep.Views.CreateTableFromMgfIon(ion, true, {
                id: "peakMs2-matrix"
            });

            BioDeep.MSMSViewer.previews("#plot", ion, [700, 500]);

            $ts("#peaks").display(matrixTable);
            reorderHandler();
        });

        public constructor(fileTree: fileBrowser.fileIndexTree) {
            this.fileTree = fileTree;
        }

        public draw(id: string, src: string = "@mgf") {
            var vm = this;

            layer.load(5);

            $ts.getText(src, function (text) {
                try {
                    let mgf = BioDeep.IO.mgf.Parse(text);
                    let maxInto = mgf.Max(m => m.intensity).intensity;
                    let doSIM = $ts("#do_SIM");

                    doSIM.onclick = function () {
                        var min = parseFloat($ts("#sim-min").CType<HTMLInputElement>().value);
                        var max = parseFloat($ts("#sim-max").CType<HTMLInputElement>().value);
                        var SIM = mgf.Where(ion => ion.precursor_mass >= min && ion.precursor_mass <= max);

                        vm.chart.plot("#sim-TIC", SIM);
                    }

                    vm.chart.plot(id, mgf);
                    vm.buildMzList(mgf, id);
                } catch {

                }

                setTimeout(layer.closeAll, 2000);
            });

            fileBrowser.createTree("#fileTree", vm.fileTree, vm);
        }

        private buildMzList(mgf: IEnumerator<IO.mgf>, id: string) {
            let mzGroup = mgf
                .GroupBy(i => i.precursor_mass, TICviewer.mzTree)
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