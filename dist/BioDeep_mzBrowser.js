/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../../../build/svg.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
var BioDeep;
(function (BioDeep) {
    var TICviewer = /** @class */ (function () {
        function TICviewer() {
        }
        TICviewer.prototype.draw = function (id) {
            $ts.getText("@mgf", function (text) {
                var mgf = BioDeep.IO.mgf.Parse(text);
                var chart = new BioDeep.MSMSViewer.TICplot();
                chart.plot(id, mgf);
            });
        };
        return TICviewer;
    }());
    BioDeep.TICviewer = TICviewer;
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=BioDeep_mzBrowser.js.map