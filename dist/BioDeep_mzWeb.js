var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../../build/linq.d.ts" />
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var mgfBeginIons = "BEGIN IONS";
        var mgfEndIons = "END IONS";
        /**
         * mascot generic format files
         *
         * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
         *
         * 在这个模块之中解析mgf格式的质谱图数据
        */
        var mgf = /** @class */ (function (_super) {
            __extends(mgf, _super);
            function mgf() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(mgf.prototype, "mzInto", {
                get: function () {
                    return this.sequence.slice();
                },
                enumerable: true,
                configurable: true
            });
            ;
            mgf.Parse = function (text) {
                var lines = text.split("\n");
                var list = [];
                return new IEnumerator(list);
            };
            mgf.IonParse = function (data) {
            };
            mgf.prototype.toString = function () {
                return this.title;
            };
            return mgf;
        }(IEnumerator));
        IO.mgf = mgf;
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var Models;
    (function (Models) {
        var mzInto = /** @class */ (function () {
            function mzInto() {
            }
            mzInto.prototype.toString = function () {
                return this.mz + "/" + this.into;
            };
            return mzInto;
        }());
        Models.mzInto = mzInto;
    })(Models = BioDeep.Models || (BioDeep.Models = {}));
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=BioDeep_mzWeb.js.map