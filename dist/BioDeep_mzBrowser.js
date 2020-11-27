var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../dist/vendor/linq.d.ts" />
/// <reference path="../../dist/vendor/svg.d.ts" />
/// <reference path="../../dist/vendor/layer.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
var biodeep;
(function (biodeep) {
    function start() {
        Router.AddAppHandler(new pages.mzwebViewer());
        Router.RunApp();
    }
    biodeep.start = start;
})(biodeep || (biodeep = {}));
$ts.mode = Modes.debug;
$ts(biodeep.start);
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
    var reorderHandler = /** @class */ (function () {
        function reorderHandler() {
            this.preOrders = { field: "mz", order: 1 };
            this.index = getTitleIndex();
            this.tbody = $ts("tbody").ElementAt(0);
            this.bodyRows = $ts(this.tbody.getElementsByTagName("tr"));
        }
        reorderHandler.prototype.titleClick = function (orderBy, index) {
            var _this = this;
            var isAsc;
            var orderRows;
            var getValue = function (r) {
                return parseFloat(r.getElementsByTagName("td").item(index).innerText);
            };
            if (this.preOrders.field == orderBy) {
                isAsc = this.preOrders.order == 1;
                this.preOrders.order = this.preOrders.order == 1 ? 0 : 1;
            }
            else {
                isAsc = false;
                this.preOrders.field = orderBy;
                this.preOrders.order = 1;
            }
            if (isAsc) {
                orderRows = this.bodyRows.OrderBy(function (r) { return getValue(r); });
            }
            else {
                orderRows = this.bodyRows.OrderByDescending(function (r) { return getValue(r); });
            }
            this.tbody.innerHTML = "";
            orderRows.ForEach(function (r) { return _this.tbody.appendChild(r); });
        };
        reorderHandler.prototype.addHandle = function () {
            var vm = this;
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
        };
        return reorderHandler;
    }());
    BioDeep.reorderHandler = reorderHandler;
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var RawFileViewer = /** @class */ (function () {
        function RawFileViewer(fileTree, viewer) {
            this.fileTree = fileTree;
            this.viewer = viewer;
            this.spectrums = new BioDeep.MSMSViewer.Spectrum([730, 350], new Canvas.Margin(50, 10, 10, 30));
        }
        RawFileViewer.doSpectrumRender = function (ion) {
            var matrixTable = BioDeep.Views.CreateTableFromMgfIon(ion, true, {
                id: "peakMs2-matrix",
                style: "width: 100%;"
            });
            BioDeep.MSMSViewer.previews("#plot", ion, [690, 400], ion.title);
            matrixTable.style.width = "50%";
            matrixTable.style.textAlign = "left";
            $ts("#peaks").display(matrixTable);
            return new BioDeep.reorderHandler().addHandle();
        };
        RawFileViewer.prototype.draw = function (id, isBPC) {
            var _this = this;
            var vm = this;
            var TIC = this.fileTree.TIC(isBPC);
            layer.load(5);
            // https://github.com/natewatson999/js-gc
            TypeScript.gc();
            vm.chart = new BioDeep.MSMSViewer.TICplot([700, 350], function (scan_id) { return _this.ViewMs1(scan_id); });
            vm.chart.plotData(id, TIC.rt, TIC.intensity, TIC.tags);
            vm.buildMzList(id);
            layer.closeAll();
        };
        RawFileViewer.prototype.ViewMs1 = function (scan_id) {
            var ms1 = this.fileTree.Ms1Scan(scan_id);
            var meta = BioDeep.IO.mgf.meta(0, ms1.rt, scan_id, "MS1", ms1.TIC);
            var ions = $from(ms1.mz).Select(function (mzi, i) { return new BioDeep.Models.mzInto((i + 1), mzi, ms1.into[i]); });
            var maxinto = ions.Max(function (i) { return i.into; }).into;
            var mgf = new BioDeep.IO.mgf(meta, ions.Where(function (i) { return (i.into / maxinto) >= 0.05; }));
            RawFileViewer.doSpectrumRender(mgf);
        };
        RawFileViewer.prototype.ViewMs2 = function (parent, scan_id) {
            var ms2 = $from(this.fileTree.seek(parent)).Where(function (i) { return i.scan_id == scan_id; }).First;
            var ms2Val = BioDeep.IO.MzWebCache.parseMs2(ms2);
            var meta = BioDeep.IO.mgf.meta(1, ms2Val.rt, scan_id, ms2Val.parentMz, ms2Val.intensity);
            var ions = $from(ms2Val.mz).Select(function (mzi, i) { return new BioDeep.Models.mzInto((i + 1), mzi, ms2Val.into[i]); });
            var mgf = new BioDeep.IO.mgf(meta, ions);
            RawFileViewer.doSpectrumRender(mgf);
        };
        RawFileViewer.prototype.ViewIon = function (ion) {
            var ms1 = this.fileTree.Ms1Scan(ion.parent_id);
            var ions = __spreadArrays(ion.mzInto);
            for (var _i = 0, _a = $from(ms1.mz)
                .Select(function (mzi, i) { return new BioDeep.Models.mzInto((i + 1), mzi, ms1.into[i]); })
                .ToArray(); _i < _a.length; _i++) {
                var fragment = _a[_i];
                ions.push(fragment);
            }
            this.spectrums.renderChart("#sim-spectrum", $from(ions));
            var maxInto = ion.Select(function (m) { return m.into; }).Max();
            var simple = ion.Where(function (m) { return (m.into / maxInto) >= 0.05; }).ToArray(false);
            RawFileViewer.doSpectrumRender(new BioDeep.IO.mgf(ion, simple));
        };
        /**
         * XIC
        */
        RawFileViewer.prototype.buildMzList = function (id) {
            var mzGroup = $from(this.fileTree.XIC())
                .GroupBy(function (i) { return i.mz; }, RawFileViewer.mzTree)
                .Where(function (mzgroup) { return mzgroup.Count > 2; })
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
                }).display(Strings.round(parseFloat(mz.key), 4).toString());
                selects.appendChild(opt);
            });
            selects.onchange = function () {
                var mz = selects.value;
                if (mz == "rawfile" || !mzGroup.ContainsKey(mz)) {
                    vm.draw(id, $input("#bpc").checked);
                }
                else {
                    vm.showXIC(id, mzGroup.Item(mz));
                }
                vm.viewer.showTIC();
            };
        };
        RawFileViewer.prototype.showXIC = function (id, xic) {
            var _this = this;
            var mgf = this.fileTree.load(xic);
            this.chart = new BioDeep.MSMSViewer.TICplot([700, 350], function (ion) { return _this.ViewIon(ion); });
            this.chart.plot(id, mgf);
        };
        RawFileViewer.mzTree = function (m1, m2) {
            if (Math.abs(m1 - m2) <= 0.1) {
                return 0;
            }
            else {
                return m1 > m2 ? 1 : -1;
            }
        };
        return RawFileViewer;
    }());
    BioDeep.RawFileViewer = RawFileViewer;
})(BioDeep || (BioDeep = {}));
var fileBrowser;
(function (fileBrowser) {
    function buildjsTree(fileIndex, uid) {
        var summary = fileIndex.getSummary();
        var node = function (label, icon) {
            return {
                id: uid.nextGuid,
                text: label,
                children: [],
                icon: icon
            };
        };
        var root = node(fileIndex.label, "dist/images/gparted.png");
        for (var name_1 in summary) {
            var childs = summary[name_1];
            var ms2 = $from(childs).Select(function (label) { return node(label, "dist/images/application-x-object.png"); }).ToArray();
            var childTree = node(name_1, "dist/images/folder-documents.png");
            childTree.children = ms2;
            root.children.push(childTree);
        }
        return root;
    }
    fileBrowser.buildjsTree = buildjsTree;
})(fileBrowser || (fileBrowser = {}));
var components;
(function (components) {
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
    components.uid = uid;
})(components || (components = {}));
var pages;
(function (pages) {
    var mzwebViewer = /** @class */ (function (_super) {
        __extends(mzwebViewer, _super);
        function mzwebViewer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(mzwebViewer.prototype, "appName", {
            get: function () {
                return "mzweb";
            },
            enumerable: true,
            configurable: true
        });
        mzwebViewer.prototype.init = function () {
            var _this = this;
            var vm = this;
            // initial spectrum viewer css style
            BioDeep.MSMSViewer.loadStyles();
            $ts.getText("@mzxml", function (text) {
                //let indexTree = JSON.parse(text);
                //let viewer = new BioDeep.RawFileViewer(indexTree);
                //viewer.draw("#TIC");
                vm.stream = BioDeep.IO.MzWebCache.loadStream(text, $ts("@fileName"));
                console.log(vm.stream);
                vm.viewer = new BioDeep.RawFileViewer(vm.stream, this);
                vm.createTree("#fileTree");
                vm.viewer.draw("#TIC", $input("#bpc").checked);
                vm.showTIC();
            });
            $(document).on('click', '.jstree-closed .jstree-ocl', function () {
                _this.hideNav();
            });
            $(document).on('click', '.jstree-open .jstree-ocl', function () {
                _this.showNav();
            });
            /* $(document).on('click', () => {
                 this.hideNav();
             })
             $(document).on('click', '#nav', (event) => {
                 this.showNav();
                 event.stopPropagation();
             })*/
            this.showTIC();
        };
        mzwebViewer.prototype.showTIC = function () {
            $ts("#showTIC").addClass("btn-primary").removeClass("btn-default");
            $ts("#showXIC").removeClass("btn-primary").addClass("btn-default");
            $ts("#TIC").show();
            $ts("#XIC").hide();
        };
        mzwebViewer.prototype.showXIC = function () {
            $ts("#showXIC").addClass("btn-primary").removeClass("btn-default");
            $ts("#showTIC").removeClass("btn-primary").addClass("btn-default");
            $ts("#XIC").show();
            $ts("#TIC").hide();
        };
        mzwebViewer.prototype.showNav = function () {
            $("#nav").css("width", "auto");
            $("#showNav").hide();
            $("#hideNav").show();
            console.log('show');
        };
        mzwebViewer.prototype.hideNav = function () {
            $("#nav").css("width", "13%");
            $("#hideNav").hide();
            $("#showNav").show();
            console.log('hide');
        };
        mzwebViewer.prototype.createTree = function (display) {
            var jsTree = fileBrowser.buildjsTree(this.stream, new components.uid());
            var vm = this;
            $(display).jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": { "stripes": true },
                    'data': jsTree
                }
            });
            $(display).on('changed.jstree', function (e, data) {
                var path = data.instance.get_path(data.node, '|').split("|");
                if (path.length == 1) {
                    // 文件的根节点
                    // 根据选项显示TIC/BPC/Scatter
                    vm.viewer.draw("#TIC", $input("#bpc").checked);
                    vm.showTIC();
                }
                else if (path.length == 2) {
                    // ms1 scan
                    vm.viewer.ViewMs1(path[1]);
                }
                else {
                    // ms2 scan
                    vm.viewer.ViewMs2(path[1], path[2]);
                }
            });
        };
        mzwebViewer.prototype.bpc_onchange = function (value) {
            this.viewer.draw("#TIC", $input("#bpc").checked);
            this.showTIC();
        };
        mzwebViewer.prototype.do_SIM = function () {
            var min = parseFloat($input("#sim-min").value);
            var max = parseFloat($input("#sim-max").value);
            var SIM = this.viewer.fileTree.selects(function (ion) { return ion.mz >= min && ion.mz <= max; });
            var vm = this.viewer;
            vm.showXIC("#sim-TIC", SIM);
            this.showXIC();
        };
        return mzwebViewer;
    }(Bootstrap));
    pages.mzwebViewer = mzwebViewer;
})(pages || (pages = {}));
//# sourceMappingURL=BioDeep_mzBrowser.js.map