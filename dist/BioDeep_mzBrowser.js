/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../../../build/svg.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
$ts(function () {
    new BioDeep.TICviewer().draw("#TIC");
});
var BioDeep;
(function (BioDeep) {
    var TICviewer = /** @class */ (function () {
        function TICviewer() {
            this.chart = new BioDeep.MSMSViewer.TICplot();
        }
        TICviewer.prototype.draw = function (id) {
            var vm = this;
            $ts.getText("@mgf", function (text) {
                var mgf = BioDeep.IO.mgf.Parse(text);
                vm.chart.plot(id, mgf);
                vm.buildMzList(mgf, id);
            });
        };
        TICviewer.prototype.buildMzList = function (mgf, id) {
            var mzGroup = mgf
                .GroupBy(function (i) { return i.precursor_mass; }, TICviewer.mzTree)
                .ToDictionary(function (x) { return x.Key.toString(); }, function (x) { return x; });
            var selects = $ts("#mzlist");
            var vm = this;
            mzGroup.ForEach(function (mz) {
                var opt = $ts("<option>", {
                    value: mz.key
                }).display(mz.key);
                selects.appendChild(opt);
            });
            selects.onchange = function () {
                var mz = selects.value;
                var part = mzGroup.Item(mz);
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