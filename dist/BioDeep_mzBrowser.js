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
    var TICviewer = /** @class */ (function () {
        function TICviewer(fileTree) {
            this.chart = new BioDeep.MSMSViewer.TICplot(function (ion) {
                BioDeep.MSMSViewer.previews("#plot", ion, [700, 500]);
                $ts("#peaks").display(BioDeep.Views.CreateTableFromMgfIon(ion));
            });
            this.fileTree = fileTree;
        }
        TICviewer.prototype.draw = function (id, src) {
            if (src === void 0) { src = "@mgf"; }
            var vm = this;
            layer.load(5);
            $ts.getText(src, function (text) {
                try {
                    var mgf = BioDeep.IO.mgf.Parse(text);
                    var maxInto = mgf.Max(function (m) { return m.intensity; }).intensity;
                    // mgf = mgf.Where(m => (m.intensity / maxInto) >= 0.01);
                    vm.chart.plot(id, mgf);
                    vm.buildMzList(mgf, id);
                }
                catch (_a) {
                }
                setTimeout(layer.closeAll, 2000);
            });
            fileBrowser.createTree("#fileTree", vm.fileTree, vm);
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