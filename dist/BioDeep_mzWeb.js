var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BioDeep;
(function (BioDeep) {
    /**
     * 一个比较通用的二级质谱矩阵解析函数
     *
     * ```
     * mz1 into1
     * mz2 into2
     * mz3 into3
     * ...
     * ```
     *
     * @param text 要求这个文本之中的每一行数据都应该是mz into的键值对
     *            mz和into之间的空白可以是任意空白
    */
    function GenericMatrixParser(text) {
        return $ts(Strings.lineTokens(text))
            .Select(function (line, i) { return mzIntoParser(line, i); })
            .ToArray();
    }
    BioDeep.GenericMatrixParser = GenericMatrixParser;
    /**
     * 这个函数输入的文本内容是``base64``字符串
    */
    function GenericBase64MatrixParser(base64Stream) {
        return GenericMatrixParser(Base64.decode(base64Stream));
    }
    BioDeep.GenericBase64MatrixParser = GenericBase64MatrixParser;
    function mzIntoParser(line, index) {
        var data = Strings.Trim(line, " \t\n").split(/\s+/g);
        var mz = data[0];
        var into = data[1];
        if ((!mz) || (!into)) {
            throw "Data format error: missing m/z or into (line[" + index + "]='" + line + "')";
        }
        else {
            return new BioDeep.Models.mzInto(index.toString(), parseFloat(mz), parseFloat(into));
        }
    }
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
                if ("intensity" in meta) {
                    _this.intensity = parseFloat(meta["intensity"]);
                }
                else {
                    var mass = meta["precursor_mass"].split(/\s+/g);
                    if (mass.length > 1) {
                        _this.intensity = parseFloat(mass[1]);
                    }
                    else {
                        _this.intensity = 0;
                    }
                }
                return _this;
            }
            Object.defineProperty(mgf.prototype, "ionPeak", {
                get: function () {
                    return {
                        id: Math.round(this.precursor_mass) + "@" + Math.round(this.rt),
                        mz: this.precursor_mass,
                        rt: this.rt,
                        name: this.title,
                        intensity: this.intensity
                    };
                },
                enumerable: true,
                configurable: true
            });
            mgf.Parse = function (text) {
                return From(Strings.lineTokens(text))
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
    var Models;
    (function (Models) {
        /**
         * ``[mz, into]``行，即一个质谱图碎片
        */
        var mzInto = /** @class */ (function () {
            function mzInto(id, mz, into) {
                this.id = id;
                this.mz = mz;
                this.into = into;
            }
            mzInto.prototype.toString = function () {
                return this.mz + "/" + this.into;
            };
            return mzInto;
        }());
        Models.mzInto = mzInto;
    })(Models = BioDeep.Models || (BioDeep.Models = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../../build/linq.d.ts" />
/// <reference path="../../Models/Abstract.ts" />
/**
 * The ``*.ms2`` file format reader
*/
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var Ms2Reader;
        (function (Ms2Reader) {
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
                    var lines = From(Strings.lineTokens(text));
                    var headers = lines
                        .TakeWhile(function (s) { return s.charAt(0) == "H"; })
                        .ToArray();
                    var scans = lines
                        .Skip(headers.length)
                        .ChunkWith(function (line) { return line.charAt(0) == "S"; }, true)
                        .Where(function (block) { return block.length > 0; })
                        .Select(Ms2.ParseScan)
                        .ToArray();
                    return {
                        header: new Ms2Reader.Ms2Header(headers),
                        scans: scans
                    };
                };
                Ms2.ParseScan = function (data) {
                    var line = -1;
                    var meta = {};
                    for (var i = 0; i < data.length; i++) {
                        var first = data[i].charAt(0);
                        if (Strings.isNumber(first)) {
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
                            return new BioDeep.Models.mzInto((i + 1).toString(), mz, into);
                        })
                            .ToArray();
                    }
                    return new Ms2Reader.Scan(meta, matrix);
                };
                return Ms2;
            }());
            Ms2Reader.Ms2 = Ms2;
        })(Ms2Reader = IO.Ms2Reader || (IO.Ms2Reader = {}));
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../../build/linq.d.ts" />
/// <reference path="../../Models/Abstract.ts" />
/**
 * The ``*.ms2`` file format reader
*/
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var Ms2Reader;
        (function (Ms2Reader) {
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
                Object.defineProperty(Ms2Header.prototype, "Extractor", {
                    /**
                     * The name of the software used to create the MS2 file
                    */
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Ms2Header.prototype, "ExtractorVersion", {
                    /**
                     * The version number of the Extractor software
                    */
                    get: function () {
                        return this.meta.GetValue("Extractor version");
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Ms2Header.prototype, "SourceFile", {
                    get: function () {
                        return this.meta.GetValue("Source file");
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Ms2Header.prototype, "Comments", {
                    /**
                     * Remarks. Multiple comment lines are allowed
                    */
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Ms2Header.prototype, "ExtractorOptions", {
                    /**
                     * The options used in running the extractor software
                    */
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Ms2Header.fieldMaps = {
                    "ExtractorVersion": "Extractor version",
                    "SourceFile": "Source file"
                };
                return Ms2Header;
            }());
            Ms2Reader.Ms2Header = Ms2Header;
        })(Ms2Reader = IO.Ms2Reader || (IO.Ms2Reader = {}));
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../../build/linq.d.ts" />
/// <reference path="../../Models/Abstract.ts" />
/**
 * The ``*.ms2`` file format reader
*/
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var Ms2Reader;
        (function (Ms2Reader) {
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
                    _this.meta = new TsLinq.MetaReader(meta);
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
                Object.defineProperty(Scan.prototype, "secondScan", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "precursorMz", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "RTime", {
                    //#endregion
                    //#region "I"
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "BPI", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "BPM", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "TIC", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "charge", {
                    //#endregion
                    //#region "Z"
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Scan.prototype, "mass", {
                    get: function () {
                        return this.meta.GetValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                return Scan;
            }(BioDeep.Models.IMs2Scan));
            Ms2Reader.Scan = Scan;
        })(Ms2Reader = IO.Ms2Reader || (IO.Ms2Reader = {}));
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=BioDeep_mzWeb.js.map