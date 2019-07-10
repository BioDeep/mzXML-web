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

    export function reorderHandler() {
        let tbody = (<IEnumerator<HTMLElement>><any>$ts("tbody")).ElementAt(0);
        let bodyRows = $ts(tbody.getElementsByTagName("tr"));
        let preOrders = { field: "mz", order: 1 };
        let index = getTitleIndex();

        function titleClick(orderBy: string, index: number) {
            let isAsc: boolean;
            let orderRows: IEnumerator<HTMLTableRowElement>;
            let getValue = function (r: HTMLElement) {
                return parseFloat(r.getElementsByTagName("td").item(index).innerText);
            }

            if (preOrders.field == orderBy) {
                isAsc = preOrders.order == 1;
                preOrders.order = preOrders.order == 1 ? 0 : 1;
            } else {
                preOrders.field = orderBy;
                preOrders.order = 1;
                isAsc = false;
            }

            if (isAsc) {
                orderRows = bodyRows.OrderBy(r => getValue(r));
            } else {
                orderRows = bodyRows.OrderByDescending(r => getValue(r));
            }

            tbody.innerHTML = "";
            orderRows.ForEach(r => tbody.appendChild(r));
        }

        $ts("#mz").display($ts("<a>", {
            href: executeJavaScript,
            onclick: function () {
                titleClick("mz", index.mz);
            }
        }).display("mz"));

        $ts("#into").display($ts("<a>", {
            href: executeJavaScript,
            onclick: function () {
                titleClick("into", index.into);
            }
        }).display("into"));
    }
}