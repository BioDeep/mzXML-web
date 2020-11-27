namespace BioDeep {

    function getTitleIndex() {
        let table = $ts("#peakMs2-matrix");
        let headers = $ts(table.getElementsByTagName("thead").item(0).getElementsByTagName("th"));
        let mzIndex: number = <number>headers.Which(r => r.innerText == "mz");
        let intoIndex: number = <number>headers.Which(r => r.innerText == "into");

        return {
            mz: mzIndex,
            into: intoIndex
        };
    }

    export class reorderHandler {

        private tbody: HTMLElement
        private bodyRows: DOMEnumerator<HTMLTableRowElement>
        private preOrders = { field: "mz", order: 1 };
        private index = getTitleIndex();

        public constructor() {
            this.tbody = (<IEnumerator<HTMLElement>><any>$ts("tbody")).ElementAt(0);
            this.bodyRows = $ts(this.tbody.getElementsByTagName("tr"));
        }

        private titleClick(orderBy: string, index: number) {
            let isAsc: boolean;
            let orderRows: IEnumerator<HTMLTableRowElement>;
            let getValue = function (r: HTMLElement) {
                return parseFloat(r.getElementsByTagName("td").item(index).innerText);
            }

            if (this.preOrders.field == orderBy) {
                isAsc = this.preOrders.order == 1;

                this.preOrders.order = this.preOrders.order == 1 ? 0 : 1;
            } else {
                isAsc = false;

                this.preOrders.field = orderBy;
                this.preOrders.order = 1;
            }

            if (isAsc) {
                orderRows = this.bodyRows.OrderBy(r => getValue(r));
            } else {
                orderRows = this.bodyRows.OrderByDescending(r => getValue(r));
            }

            this.tbody.innerHTML = "";

            orderRows.ForEach(r => this.tbody.appendChild(r));
        }

        public addHandle() {
            let vm = this;

            $ts("#mz").display($ts("<a>", {
                href: executeJavaScript, onclick: function () {
                    vm.titleClick("mz", vm.index.mz);
                }
            }).display("mz"));

            $ts("#into").display($ts("<a>", {
                href: executeJavaScript, onclick: function () {
                    vm.titleClick("into", vm.index.into);
                }
            }).display("into"));
        }
    }
}