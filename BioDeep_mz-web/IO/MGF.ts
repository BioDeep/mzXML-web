/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />

namespace BioDeep.IO {

    const mgfBeginIons: string = "BEGIN IONS"
    const mgfEndIons: string = "END IONS";

    /**
     * mascot generic format files
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

        public constructor(meta: object, matrix: BioDeep.Models.mzInto[]) {
            super(matrix);

            this.charge = parseFloat(meta["charge"]);
            this.rt = parseFloat(meta["rt"]);
            this.title = meta["title"];
            this.precursor_mass = parseFloat(meta["precursor_mass"]);

            if ("intensity" in meta) {
                this.intensity = parseFloat(meta["intensity"]);
            } else {
                var mass = (<string>meta["precursor_mass"]).split();

                if (mass.length > 1) {
                    this.intensity = parseFloat(mass[1]);
                } else {
                    this.intensity = 0;
                }
            }
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
            var line: number = data[0] == mgfBeginIons ? 1 : 0;
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