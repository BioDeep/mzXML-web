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
            function mgf(meta, matrix) {
                var _this = _super.call(this, matrix) || this;
                _this.charge = parseFloat(meta["charge"]);
                _this.rt = parseFloat(meta["rt"]);
                _this.title = meta["title"];
                _this.precursor_mass = parseFloat(meta["precursor_mass"]);
                return _this;
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
                return From(text.split("\n"))
                    .ChunkWith(function (line) { return line == mgfEndIons; })
                    .Select(function (data) { return mgf.IonParse(data); });
            };
            mgf.IonParse = function (data) {
                var line = data[0] == mgfBeginIons ? 1 : 0;
                var mgfFields = {};
                for (var i = line; i < data.length; i++) {
                    var str = data[i];
                    if (str.indexOf("=") == -1) {
                        line = i;
                        break;
                    }
                    else {
                        var tuple = Strings.GetTagValue(data[i], "=");
                        var key = BioDeep.IO.mgf.fieldMaps.Item(tuple.name);
                        mgfFields[key] = tuple.value;
                    }
                }
                var matrix = From(data)
                    .Skip(line)
                    .Select(function (text) {
                    var tokens = text.split(" ");
                    var mz = parseFloat(tokens[0]);
                    var into = parseFloat(tokens[1]);
                    return {
                        mz: mz,
                        into: into
                    };
                }).ToArray();
                return new mgf(mgfFields, matrix);
            };
            mgf.prototype.toString = function () {
                return this.title;
            };
            mgf.fieldMaps = new Dictionary({
                "PEPMASS": "precursor_mass",
                "CHARGE": "charge",
                "RTINSECONDS": "rt",
                "TITLE": "title"
            });
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