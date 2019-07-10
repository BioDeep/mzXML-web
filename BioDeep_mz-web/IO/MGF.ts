/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />

namespace BioDeep.IO {

    const mgfBeginIons: string = "BEGIN IONS"
    const mgfEndIons: string = "END IONS";

    /**
     * mascot generic format files.(一个二级碎片集合对象)
     * 
     * > http://fiehnlab.ucdavis.edu/projects/LipidBlast/mgf-files
     * 
     * 在这个模块之中解析mgf格式的质谱图数据
    */
    export class mgf extends Models.IMs2Scan {

        /**
         * PEPMASS
        */
        public precursor_mass: number;
        public intensity: number;
        /**
         * CHARGE
        */
        public charge: number;
        /**
         * RTINSECONDS
        */
        public rt: number;
        /**
         * TITLE
        */
        public title: string;

        public get ionPeak(): Models.IonPeak {
            return <Models.IonPeak>{
                id: `${Math.round(this.precursor_mass)}@${Math.round(this.rt)}`,
                mz: this.precursor_mass,
                rt: this.rt,
                name: this.title,
                intensity: this.intensity
            };
        }

        public constructor(meta: object, matrix: BioDeep.Models.mzInto[]) {
            super(matrix);

            if (!isNullOrUndefined(meta)) {
                this.charge = parseFloat(meta["charge"]);
                this.rt = parseFloat(meta["rt"]);
                this.title = meta["title"];
                this.precursor_mass = parseFloat(meta["precursor_mass"]);

                if ("intensity" in meta) {
                    this.intensity = parseFloat(meta["intensity"]);
                } else {
                    var mass = (<string>meta["precursor_mass"]).split(/\s+/g);

                    if (mass.length > 1) {
                        this.intensity = parseFloat(mass[1]);
                    } else {
                        this.intensity = 0;
                    }
                }
            }
        }

        public static Clone(ion: mgf): mgf {
            let copy: mgf = new mgf(null, ion.ToArray(true));

            copy.precursor_mass = ion.precursor_mass;
            copy.intensity = ion.intensity;
            copy.charge = ion.charge;
            copy.rt = ion.rt;
            copy.title = ion.title;

            return copy;
        }

        public static Parse(text: string): IEnumerator<mgf> {
            return From(Strings.lineTokens(text))
                .ChunkWith(line => {
                    return line == mgfEndIons;
                })
                .Select(mgf.IonParse);
        }

        static readonly fieldMaps: Dictionary<string> = new Dictionary<string>({
            "PEPMASS": "precursor_mass",
            "CHARGE": "charge",
            "RTINSECONDS": "rt",
            "TITLE": "title"
        });

        public static IonParse(data: string[]): mgf {
            // 因为php服务器通过echo传输过来的文本数据
            // 最开始的位置都会存在一个bin头部标记
            // 所以在这里不可以直接做比较
            var line: number = data[0].indexOf(mgfBeginIons) > -1 ? 1 : 0;
            var mgfFields: object = {};

            for (var i: number = line; i < data.length; i++) {
                var str = data[i];

                if (str.indexOf("=") == -1) {
                    line = i;
                    break;
                } else {
                    var tuple = Strings.GetTagValue(data[i], "=");
                    var key: string = BioDeep.IO.mgf.fieldMaps.Item(tuple.name);

                    mgfFields[key] = tuple.value;
                }
            }

            var matrix: BioDeep.Models.mzInto[] = From(data)
                .Skip(line)
                .Select((text, i) => {
                    var tokens: string[] = text.split(" ");
                    var mz: number = parseFloat(tokens[0]);
                    var into: number = parseFloat(tokens[1]);

                    return <BioDeep.Models.mzInto>{
                        mz: mz,
                        into: into,
                        id: (i + 1).toString()
                    };
                }).ToArray();

            return new mgf(mgfFields, matrix);
        }

        public toString(): string {
            return this.title;
        }
    }
}