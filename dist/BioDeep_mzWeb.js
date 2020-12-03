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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
    function ppm_primitive(x, y) {
        return Math.abs(x - y) / x * 1000000;
    }
    BioDeep.ppm_primitive = ppm_primitive;
    function ppm(x, y) {
        var tx = TypeScript.Reflection.$typeof(x);
        var ty = TypeScript.Reflection.$typeof(y);
        if (tx.isPrimitive && ty.isPrimitive) {
            return ppm_primitive(x, y);
        }
        if (tx.isPrimitive) {
            if (ty.isArray) {
                y = new IEnumerator(y);
            }
            return y
                .Select(function (a) { return ppm_primitive(x, a); })
                .ToArray();
        }
        if (ty.isPrimitive) {
            if (tx.isArray) {
                x = new IEnumerator(x);
            }
            return x
                .Select(function (a) { return ppm_primitive(a, y); })
                .ToArray();
        }
        // x, y都是基元类型
        // 则二者必须等长
        var sx = new IEnumerator(x);
        var sy = new IEnumerator(y);
        if (sx.Count != sy.Count) {
            if (TypeScript.logging.outputWarning) {
                console.warn("Sequence x(length=" + sx.Count + ") <> Sequence y(length=" + sy.Count + "), calculation will follow the shortest sequence.");
            }
            if (sx.Count > sy.Count) {
                sx = sx.Take(sy.Count);
            }
            else {
                sy = sy.Take(sx.Count);
            }
        }
        return sx
            .Select(function (xi, i) { return ppm_primitive(xi, sy.ElementAt(i)); })
            .ToArray();
    }
    BioDeep.ppm = ppm;
})(BioDeep || (BioDeep = {}));
/// <reference path="../dist/vendor/linq.d.ts" />
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
                    return __spreadArrays(this.sequence);
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
/// <reference path="../../../mzXML-web/dist/vendor/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        IO.mgfBeginIons = "BEGIN IONS";
        IO.mgfEndIons = "END IONS";
        /**
         * mascot generic format files.(一个二级碎片集合对象)
         *
         * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
         *
         * 在这个模块之中解析mgf格式的质谱图数据
        */
        var mgf = /** @class */ (function (_super) {
            __extends(mgf, _super);
            /**
             * @param meta 可以在进行复制的时候，直接传递其自身进来，只需要保持属性名称一致即可
            */
            function mgf(meta, matrix, parent_id) {
                if (parent_id === void 0) { parent_id = null; }
                var _this = _super.call(this, matrix) || this;
                _this.parent_id = parent_id;
                if (!isNullOrUndefined(meta)) {
                    _this.charge = parseFloat(meta["charge"]);
                    _this.rt = parseFloat(meta["rt"]);
                    _this.title = meta["title"];
                    var pmass = "" + meta["precursor_mass"];
                    if (Strings.isNumericPattern(pmass)) {
                        _this.precursor_mass = parseFloat(pmass);
                    }
                    else {
                        _this.precursor_mass = pmass;
                    }
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
                }
                return _this;
            }
            Object.defineProperty(mgf.prototype, "xcms_uid", {
                get: function () {
                    var pmass;
                    if (typeof this.precursor_mass == "number") {
                        pmass = Strings.round(this.precursor_mass, 3).toString();
                    }
                    else {
                        pmass = this.precursor_mass;
                    }
                    return pmass + "@" + Math.round(this.rt);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(mgf.prototype, "ionPeak", {
                get: function () {
                    return {
                        id: this.xcms_uid,
                        mz: this.precursor_mass,
                        rt: this.rt,
                        name: this.title,
                        intensity: this.intensity
                    };
                },
                enumerable: true,
                configurable: true
            });
            mgf.meta = function (charge, rt, title, precursor_mass, intensity) {
                return {
                    charge: charge,
                    rt: rt,
                    title: title,
                    precursor_mass: precursor_mass,
                    intensity: intensity
                };
            };
            mgf.Clone = function (ion) {
                var copy = new mgf(null, ion.ToArray(true));
                copy.precursor_mass = ion.precursor_mass;
                copy.intensity = ion.intensity;
                copy.charge = ion.charge;
                copy.rt = ion.rt;
                copy.title = ion.title;
                return copy;
            };
            mgf.Parse = function (text) {
                return $from(Strings.lineTokens(text))
                    .ChunkWith(function (line) {
                    return line == IO.mgfEndIons;
                })
                    .Select(mgf.IonParse);
            };
            mgf.IonParse = function (data) {
                // 因为php服务器通过echo传输过来的文本数据
                // 最开始的位置都会存在一个bin头部标记
                // 所以在这里不可以直接做比较
                var mgfFields = {
                    'charge': data.charge,
                    "precursor_mass": data.precursor_mass,
                    "rt": data.rt,
                    "title": data.title
                };
                var mz = Base64.bytes_decode(data.mz);
                var into = Base64.bytes_decode(data.into);
                var max_into = Math.max.apply(Math, into);
                var matrix = [];
                for (var i = 0; i < 8; i++) {
                    matrix[i] = {
                        mz: mz[i],
                        into: into[i] / max_into * 100,
                        id: (i + 1).toString()
                    };
                }
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
/// <reference path="../Models/Abstract.ts" />
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
                    var lines = $from(Strings.lineTokens(text));
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
                        matrix = $from(data)
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
                    var tags = $from(data)
                        .Select(function (s) { return s.substr(2); })
                        .Select(function (s) {
                        if (s.indexOf("\t") > -1) {
                            return Strings.GetTagValue(s, "\t");
                        }
                        else {
                            return Strings.GetTagValue(s, " ");
                        }
                    });
                    this.meta = Activator.CreateMetaReader(tags);
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
/// <reference path="../../../dist/vendor/linq.d.ts" />
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
                    _this.meta = new TypeScript.Data.MetaReader(meta);
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
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var MzWebCache;
        (function (MzWebCache) {
            var scan_delimiter = "-----";
            function loadStream(text, name) {
                if (name === void 0) { name = "unknown"; }
                var lines = Strings.lineTokens(text);
                var stream = new MzWebCache.Stream(name);
                var buffer = [];
                var scan_time = [];
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    line = line.trim();
                    if (scan_delimiter == line) {
                        scan_time.push(stream.add(blockBuffer(buffer)));
                        buffer = [];
                    }
                    else {
                        buffer.push(line);
                    }
                }
                stream.scantime_range = [
                    $from(scan_time).Min(),
                    $from(scan_time).Max()
                ];
                return stream;
            }
            MzWebCache.loadStream = loadStream;
            function blockBuffer(buffer) {
                var blocks = [];
                var i = 0;
                var cache = {};
                for (var _i = 0, buffer_1 = buffer; _i < buffer_1.length; _i++) {
                    var line = buffer_1[_i];
                    switch (++i) {
                        case 1:
                            cache.scan_id = line;
                            break;
                        case 2:
                            cache.data = line;
                            break;
                        case 3:
                            cache.mz_base64 = line;
                            break;
                        case 4:
                            cache.into_base64 = line;
                            i = 0;
                            blocks.push(cache);
                            cache = {};
                            break;
                    }
                }
                if (i != 0) {
                    console.warn("invalid file format!");
                }
                return blocks;
            }
            MzWebCache.blockBuffer = blockBuffer;
            function parseMs2Vector(cache) {
                var data = parseVector(cache.data);
                return {
                    mz: data[0],
                    rt: data[1],
                    intensity: data[2],
                    polarity: data[3]
                };
            }
            MzWebCache.parseMs2Vector = parseMs2Vector;
            /**
             * parse the ``data`` row
            */
            function parseMs1Vector(cache) {
                var data = parseVector(cache.data);
                return {
                    rt: data[0],
                    BPC: data[1],
                    TIC: data[2]
                };
            }
            MzWebCache.parseMs1Vector = parseMs1Vector;
            function parseMs1(cache) {
                var data = parseVector(cache.data);
                return {
                    scan_id: cache.scan_id,
                    rt: data[0],
                    BPC: data[1],
                    TIC: data[2],
                    mz: Base64.bytes_decode(cache.mz_base64),
                    into: Base64.bytes_decode(cache.into_base64)
                };
            }
            MzWebCache.parseMs1 = parseMs1;
            function parseVector(text) {
                return $from(text.split(","))
                    .Select(function (str) { return parseFloat(str); })
                    .ToArray();
            }
            function parseMs2(cache) {
                var data = parseVector(cache.data);
                return {
                    scan_id: cache.scan_id,
                    parentMz: data[0],
                    rt: data[1],
                    intensity: data[2],
                    mz: Base64.bytes_decode(cache.mz_base64),
                    into: Base64.bytes_decode(cache.into_base64),
                    polarity: data[3]
                };
            }
            MzWebCache.parseMs2 = parseMs2;
        })(MzWebCache = IO.MzWebCache || (IO.MzWebCache = {}));
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var IO;
    (function (IO) {
        var MzWebCache;
        (function (MzWebCache) {
            var Stream = /** @class */ (function () {
                function Stream(label) {
                    this.label = label;
                    this.index = [];
                    this.blocks = {};
                    this.i = 0;
                }
                Object.defineProperty(Stream.prototype, "done", {
                    get: function () {
                        return this.i == this.index.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Stream.prototype.item = function (i) {
                    return this.blocks[this.index[i]];
                };
                /**
                 * @returns this function returns the ``scan_time`` value of
                 *      current ms1 scan data
                */
                Stream.prototype.add = function (block) {
                    var scan_id = block[0].scan_id;
                    this.blocks[scan_id] = block;
                    this.index.push(scan_id);
                    return MzWebCache.parseMs1Vector(block[0]).rt;
                };
                Stream.prototype.reset = function () {
                    this.i = 0;
                };
                Stream.prototype.toString = function () {
                    return this.label + ": " + this.blocks[this.i][0].scan_id;
                };
                Stream.prototype.seek = function (scan_id) {
                    return this.blocks[scan_id];
                };
                Stream.prototype.getSummary = function () {
                    var summary = {};
                    for (var _i = 0, _a = this.index; _i < _a.length; _i++) {
                        var scan_id = _a[_i];
                        summary[scan_id] = $from(this.blocks[scan_id])
                            .Skip(1)
                            .Select(function (a) { return a.scan_id; })
                            .ToArray();
                    }
                    return summary;
                };
                Stream.prototype.load = function (ticks) {
                    var _this = this;
                    return ticks.Select(function (tick) { return _this.read(tick); });
                };
                Stream.prototype.read = function (tick) {
                    var raw = $from(this.seek(tick.ms1_scan)).Where(function (i) { return i.scan_id == tick.scan_id; }).First;
                    var ms2 = MzWebCache.parseMs2(raw);
                    var meta = IO.mgf.meta(1, ms2.rt, tick.scan_id, ms2.parentMz, ms2.intensity);
                    var ions = $from(ms2.mz).Select(function (mzi, i) { return new BioDeep.Models.mzInto((i + 1), mzi, ms2.into[i]); }).ToArray();
                    return new IO.mgf(meta, ions, tick.ms1_scan);
                };
                Stream.prototype.XIC = function () {
                    var ticks = [];
                    for (var _i = 0, _a = this.index; _i < _a.length; _i++) {
                        var id = _a[_i];
                        var ms1 = this.seek(id);
                        for (var _b = 0, _c = ms1.slice(1); _b < _c.length; _b++) {
                            var ms2 = _c[_b];
                            var info = MzWebCache.parseMs2Vector(ms2);
                            var tick = {
                                mz: info.mz,
                                rt: info.rt,
                                intensity: info.intensity,
                                ms1_scan: id,
                                scan_id: ms2.scan_id
                            };
                            ticks.push(tick);
                        }
                    }
                    return ticks;
                };
                Stream.prototype.selects = function (predicate) {
                    return $from(this.XIC()).Where(function (tick) { return predicate(tick); });
                };
                Stream.prototype.TIC = function (isBPC) {
                    if (isBPC === void 0) { isBPC = false; }
                    var rt = [];
                    var intensity = [];
                    var tags = [];
                    for (var _i = 0, _a = this.index; _i < _a.length; _i++) {
                        var id = _a[_i];
                        var ms1 = this.seek(id)[0];
                        var info = MzWebCache.parseMs1Vector(ms1);
                        rt.push(info.rt);
                        intensity.push(isBPC ? info.BPC : info.TIC);
                        tags.push(id);
                    }
                    return { rt: rt, intensity: intensity, tags: tags };
                };
                Stream.prototype.Ms1Scan = function (scan_id) {
                    return MzWebCache.parseMs1(this.seek(scan_id)[0]);
                };
                Stream.prototype.loadNextScan = function () {
                    var block = this.item(this.i++);
                    var ms1 = MzWebCache.parseMs1(block[0]);
                    var ms2 = $from(block).Skip(1).Select(function (c) { return MzWebCache.parseMs2(c); }).ToArray();
                    ms1.products = ms2;
                    return ms1;
                };
                return Stream;
            }());
            MzWebCache.Stream = Stream;
        })(MzWebCache = IO.MzWebCache || (IO.MzWebCache = {}));
    })(IO = BioDeep.IO || (BioDeep.IO = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var Models;
    (function (Models) {
        function TIC(ions) {
            return ions
                .OrderBy(function (i) { return i.rt; })
                .Select(function (i) { return ({
                rt: i.rt,
                intensity: i.intensity,
                raw: i
            }); });
        }
        Models.TIC = TIC;
        function Chromatogram(rt, intensity, tags) {
            if (tags === void 0) { tags = null; }
            var isNullTags = isNullOrUndefined(tags);
            return $from(rt).Select(function (rti, i) {
                return {
                    rt: rti,
                    intensity: intensity[i],
                    raw: isNullTags ? null : tags[i]
                };
            });
        }
        Models.Chromatogram = Chromatogram;
    })(Models = BioDeep.Models || (BioDeep.Models = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var Models;
    (function (Models) {
        /**
         * ``[mz, into]``行，即一个质谱图碎片
        */
        var mzInto = /** @class */ (function () {
            /**
             * @param id
             * @param mz ``m/z`` X 坐标轴数据
             * @param into intensity 进行绘图操作的时候所需要的Y坐标轴数据，以及鼠标提示
             *             显示所需要用到的原始的质谱信号强度数据
            */
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
        var SpectrumLevels;
        (function (SpectrumLevels) {
            SpectrumLevels[SpectrumLevels["MS1"] = 1] = "MS1";
            SpectrumLevels[SpectrumLevels["MS2"] = 2] = "MS2";
            SpectrumLevels[SpectrumLevels["MS3"] = 10] = "MS3";
        })(SpectrumLevels = Models.SpectrumLevels || (Models.SpectrumLevels = {}));
        function SpectrumMatrix(data, levels) {
            if (levels == SpectrumLevels.MS1) {
                // only ms1
                return data.Select(function (ion) { return new mzInto("", ion.precursor_mass, ion.intensity); });
            }
            else if (levels == SpectrumLevels.MS2) {
                // only ms2
                return data.Select(function (ion) { return ion.mzInto; }).Unlist(function (ms2) { return ms2; });
            }
            else if (levels == SpectrumLevels.MS1 + SpectrumLevels.MS2) {
                return data.Select(function (ion) {
                    var union = __spreadArrays(ion.mzInto);
                    var ms1 = new mzInto("", ion.precursor_mass, ion.intensity);
                    // union ms1 and ms2
                    union.push(ms1);
                    return union;
                }).Unlist(function (sp) { return sp; });
            }
            else {
                throw "not implements yet!";
            }
        }
        Models.SpectrumMatrix = SpectrumMatrix;
    })(Models = BioDeep.Models || (BioDeep.Models = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var Views;
    (function (Views) {
        function CreateTableFromMgfIon(ion, relative, attrs) {
            if (relative === void 0) { relative = true; }
            if (attrs === void 0) { attrs = null; }
            return CreateTableFromMatrix(ion, relative, attrs);
        }
        Views.CreateTableFromMgfIon = CreateTableFromMgfIon;
        function CreateTableFromMatrix(matrix, relative, attrs) {
            if (relative === void 0) { relative = true; }
            if (attrs === void 0) { attrs = null; }
            if (relative) {
                var max_1 = matrix.Select(function (m) { return m.into; }).Max(function (x) { return x; });
                var normalize_1 = function (m) {
                    var mz = Strings.round(m.mz, 4);
                    var into = Strings.round(m.into / max_1 * 100, 2);
                    return new BioDeep.Models.mzInto(m.id, mz, into);
                };
                matrix = matrix.Select(function (m) { return normalize_1(m); });
            }
            return $ts.evalHTML.table(matrix, null, attrs);
        }
        Views.CreateTableFromMatrix = CreateTableFromMatrix;
    })(Views = BioDeep.Views || (BioDeep.Views = {}));
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=BioDeep_mzWeb.js.map