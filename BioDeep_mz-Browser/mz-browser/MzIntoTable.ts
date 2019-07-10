namespace BioDeep {

    export function reorderHandler() {
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
}