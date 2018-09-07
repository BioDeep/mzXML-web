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
var BioDeep;
(function (BioDeep) {
    BioDeep.x0 = "0".charCodeAt(0);
    BioDeep.x9 = "9".charCodeAt(0);
    function isNumber(text) {
        var code = text.charCodeAt(0);
        return code >= BioDeep.x0 && code <= BioDeep.x9;
    }
    BioDeep.isNumber = isNumber;
    /**
     * 将文本字符串按照newline进行分割
    */
    function lineTokens(text) {
        return (!text) ? [] : text.trim().split("\n");
    }
    BioDeep.lineTokens = lineTokens;
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../build/linq.d.ts" />
var BioDeep;
(function (BioDeep) {
    var Models;
    (function (Models) {
        var IMs2Scan = /** @class */ (function (_super) {
            __extends(IMs2Scan, _super);
            function IMs2Scan(matrix) {
                return _super.call(this, matrix) || this;
            }
            Object.defineProperty(IMs2Scan.prototype, "mzInto", {
                get: function () {
                    return this.sequence.slice();
                },
                enumerable: true,
                configurable: true
            });
            ;
            return IMs2Scan;
        }(IEnumerator));
        Models.IMs2Scan = IMs2Scan;
    })(Models = BioDeep.Models || (BioDeep.Models = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />
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
            mgf.Parse = function (text) {
                return From(BioDeep.lineTokens(text))
                    .ChunkWith(function (line) {
                    return line == mgfEndIons;
                })
                    .Select(mgf.IonParse);
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
                    .Select(function (text, i) {
                    var tokens = text.split(" ");
                    var mz = parseFloat(tokens[0]);
                    var into = parseFloat(tokens[1]);
                    return {
                        mz: mz,
                        into: into,
                        id: (i + 1).toString()
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
        }(BioDeep.Models.IMs2Scan));
        IO.mgf = mgf;
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        /**
         * The MS2 file format is used to record MS/MS spectra. A full description of the
         * MS2 file format may be found in:
         *
         * > McDonald,W.H. et al. MS1, MS2, and SQT-three unified, compact, and easily
         * > parsed file formats for the storage of shotgun proteomic spectra and
         * > identifications. Rapid Commun. Mass Spectrom. 18, 2162-2168 (2004).
        */
        var Ms2 = /** @class */ (function () {
            function Ms2() {
            }
            Ms2.Parse = function (text) {
                var lines = From(BioDeep.lineTokens(text));
                var headers = lines
                    .TakeWhile(function (s) { return s.charAt(0) == "H"; })
                    .ToArray();
                var scans = lines
                    .Skip(headers.length)
                    .ChunkWith(function (line) { return line.charAt(0) == "S"; })
                    .Select(Ms2.ParseScan)
                    .ToArray();
                return {
                    header: new Ms2Header(headers),
                    scans: scans
                };
            };
            Ms2.ParseScan = function (data) {
                var line = -1;
                var meta = {};
                for (var i = 0; i < data.length; i++) {
                    var first = data[i].charAt(0);
                    if (BioDeep.isNumber(first)) {
                        line = i;
                        break;
                    }
                    var tokens = data[i].split("\t");
                    switch (first) {
                        case "S":
                            // S	2	2	0
                            meta["firstScan"] = parseFloat(tokens[1]);
                            meta["secondScan"] = parseFloat(tokens[2]);
                            meta["precursorMz"] = parseFloat(tokens[3]);
                            break;
                        case "I":
                            // I	RTime	0.01252833
                            meta[tokens[1]] = tokens[2];
                            break;
                        case "Z":
                            // Z	1	482.4038
                            meta["charge"] = parseFloat(tokens[1]);
                            meta["mass"] = parseFloat(tokens[2]);
                            break;
                        default:
                            throw "Parser for " + first + " not implements yet.";
                    }
                }
                var matrix;
                if (line == -1) {
                    matrix = [];
                }
                else {
                    matrix = From(data)
                        .Skip(line)
                        .Select(function (text, i) {
                        var tokens = text.split(" ");
                        var mz = parseFloat(tokens[0]);
                        var into = parseFloat(tokens[1]);
                        return {
                            mz: mz,
                            into: into,
                            id: (i + 1).toString()
                        };
                    })
                        .ToArray();
                }
                return new Scan(meta, matrix);
            };
            return Ms2;
        }());
        IO.Ms2 = Ms2;
        var Ms2Header = /** @class */ (function () {
            function Ms2Header(data) {
                var tags = From(data)
                    .Select(function (s) { return s.substr(2); })
                    .Select(function (s) {
                    if (s.indexOf("\t") > -1) {
                        return Strings.GetTagValue(s, "\t");
                    }
                    else {
                        return Strings.GetTagValue(s, " ");
                    }
                });
                this.meta = TypeInfo.CreateMetaReader(tags);
            }
            Object.defineProperty(Ms2Header.prototype, "CreationDate", {
                /**
                 * The date and time when the file was created
                */
                get: function () {
                    return this.meta.GetValue();
                },
                enumerable: true,
                configurable: true
            });
            ;
            Ms2Header.fieldMaps = {
                "Extractor version": "ExtractorVersion",
                "Source file": "SourceFile"
            };
            return Ms2Header;
        }());
        IO.Ms2Header = Ms2Header;
        /**
         * Each scan begins with a few records listing the parameters describing the spectrum.
         * These lines must begin with ``S``, ``I``, ``Z``, or ``D``. The records are followed
         * by pairs of m/z and intensity values, one pair per line.
        */
        var Scan = /** @class */ (function (_super) {
            __extends(Scan, _super);
            function Scan(meta, matrix) {
                var _this = _super.call(this, matrix) || this;
                // read meta object value by call name
                _this.meta = new data.MetaReader(meta);
                return _this;
            }
            Object.defineProperty(Scan.prototype, "firstScan", {
                //#region "S"
                get: function () {
                    return this.meta.GetValue();
                },
                enumerable: true,
                configurable: true
            });
            ;
            return Scan;
        }(BioDeep.Models.IMs2Scan));
        IO.Scan = Scan;
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