/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../../../build/svg.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
/// <reference path="../../../layer.d.ts" />
$ts(function () {
    // initial spectrum viewer css style
    BioDeep.MSMSViewer.loadStyles();
    $ts.getText("index.json", function (text) {
        var indexTree = JSON.parse(text);
        var viewer = new BioDeep.TICviewer(indexTree);
        viewer.draw("#TIC");
    });
});
var fileBrowser;
(function (fileBrowser) {
    function createTree(display, indexTree, viewer) {
        var jsTree = buildjsTree(indexTree, new uid());
        $(display).jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": { "stripes": true },
                'data': jsTree
            }
        });
        $(display).on('changed.jstree', function (e, data) {
            var path = data.instance.get_path(data.node, '/');
            console.log('Selected: ' + path);
            viewer.draw("#TIC", path.replace("//", "/"));
        });
        console.log(indexTree);
        console.log(jsTree);
    }
    fileBrowser.createTree = createTree;
    function buildjsTree(fileIndex, uid) {
        var root = {
            id: uid.nextGuid,
            text: fileIndex.Label,
            children: []
        };
        for (var name in fileIndex.Childs) {
            var childIndex = fileIndex.Childs[name];
            var childTree = buildjsTree(childIndex, uid);
            root.children.push(childTree);
        }
        return root;
    }
    var uid = /** @class */ (function () {
        function uid() {
            this.guid = 0;
        }
        Object.defineProperty(uid.prototype, "nextGuid", {
            get: function () {
                return ++this.guid;
            },
            enumerable: true,
            configurable: true
        });
        return uid;
    }());
})(fileBrowser || (fileBrowser = {}));
var BioDeep;
(function (BioDeep) {
    function getTitleIndex() {
        var table = $ts("#peakMs2-matrix");
        var headers = $ts(table.getElementsByTagName("thead").item(0).getElementsByTagName("th"));
        var mzIndex = headers.Which(function (r) { return r.innerText == "mz"; });
        var intoIndex = headers.Which(function (r) { return r.innerText == "into"; });
        return {
            mz: mzIndex,
            into: intoIndex
        };
    }
    function reorderHandler() {
        var tbody = $ts("tbody").ElementAt(0);
        var bodyRows = $ts(tbody.getElementsByTagName("tr"));
        var preOrders = { field: "mz", order: 1 };
        var index = getTitleIndex();
        function titleClick(orderBy, index) {
            var isAsc;
            var orderRows;
            var getValue = function (r) {
                return parseFloat(r.getElementsByTagName("td").item(index).innerText);
            };
            if (preOrders.field == orderBy) {
                isAsc = preOrders.order == 1;
                preOrders.order = preOrders.order == 1 ? 0 : 1;
            }
            else {
                preOrders.field = orderBy;
                preOrders.order = 1;
                isAsc = false;
            }
            if (isAsc) {
                orderRows = bodyRows.OrderBy(function (r) { return getValue(r); });
            }
            else {
                orderRows = bodyRows.OrderByDescending(function (r) { return getValue(r); });
            }
            tbody.innerHTML = "";
            orderRows.ForEach(function (r) { return tbody.appendChild(r); });
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
    BioDeep.reorderHandler = reorderHandler;
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var TICviewer = /** @class */ (function () {
        function TICviewer(fileTree) {
            this.chart = new BioDeep.MSMSViewer.TICplot([800, 350], function (ion) {
                var matrixTable = BioDeep.Views.CreateTableFromMgfIon(ion, true, {
                    id: "peakMs2-matrix"
                });
                BioDeep.MSMSViewer.previews("#plot", ion, [700, 500]);
                $ts("#peaks").display(matrixTable);
                BioDeep.reorderHandler();
            });
            this.spectrums = new BioDeep.MSMSViewer.Spectrum([800, 350]);
            this.fileTree = fileTree;
        }
        TICviewer.prototype.draw = function (id, src) {
            if (src === void 0) { src = "@mgf"; }
            var vm = this;
            layer.load(5);
            $ts.getText(src, function (text) {
                try {
                    TICviewer.doDraw(vm, id, text);
                }
                catch (_a) {
                }
                setTimeout(layer.closeAll, 2000);
            });
            fileBrowser.createTree("#fileTree", vm.fileTree, vm);
        };
        TICviewer.doDraw = function (vm, id, text) {
            var mgf = BioDeep.IO.mgf.Parse(text);
            var maxInto = mgf.Max(function (m) { return m.intensity; }).intensity;
            var doSIM = $ts("#do_SIM");
            doSIM.onclick = function () {
                var min = parseFloat($ts("#sim-min").CType().value);
                var max = parseFloat($ts("#sim-max").CType().value);
                var SIM = mgf.Where(function (ion) { return ion.precursor_mass >= min && ion.precursor_mass <= max; });
                vm.chart.plot("#sim-TIC", SIM);
                vm.spectrums.renderChartFromMgf("#sim-spectrum", SIM, 1 + 2);
            };
            vm.chart.plot(id, mgf);
            vm.buildMzList(mgf, id);
        };
        TICviewer.prototype.buildMzList = function (mgf, id) {
            var mzGroup = mgf
                .GroupBy(function (i) { return i.precursor_mass; }, TICviewer.mzTree)
                .ToDictionary(function (x) { return x.Key.toString(); }, function (x) { return x; });
            var selects = $ts("#mzlist");
            var vm = this;
            // clear all of its previous data
            // then display all ions
            selects.clear();
            selects.appendChild($ts("<option>", { value: "rawfile" }).display("Raw File"));
            mzGroup.OrderBy(function (mz) { return parseFloat(mz.key); })
                .ForEach(function (mz) {
                var opt = $ts("<option>", {
                    value: mz.key
                }).display(mz.key);
                selects.appendChild(opt);
            });
            selects.onchange = function () {
                var mz = selects.value;
                var part;
                if (mz == "rawfile" || !mzGroup.ContainsKey(mz)) {
                    part = mgf;
                }
                else {
                    part = mzGroup.Item(mz);
                }
                vm.chart.plot(id, part);
            };
        };
        TICviewer.mzTree = function (m1, m2) {
            if (Math.abs(m1 - m2) <= 0.1) {
                return 0;
            }
            else {
                return m1 > m2 ? 1 : -1;
            }
        };
        return TICviewer;
    }());
    BioDeep.TICviewer = TICviewer;
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=BioDeep_mzBrowser.js.map