/// <reference path="../../../mzXML-web/dist/vendor/linq.d.ts" />
/// <reference path="../Models/Abstract.ts" />

namespace BioDeep.IO {

    export const mgfBeginIons: string = "BEGIN IONS"
    export const mgfEndIons: string = "END IONS";

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
        public precursor_mass: number | string;
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

        public get xcms_uid(): string {
            let pmass: string;

            if (typeof this.precursor_mass == "number") {
                pmass = Strings.round(this.precursor_mass, 3).toString();
            } else {
                pmass = <string>this.precursor_mass;
            }

            return `${pmass}@${Math.round(this.rt)}`;
        }

        public get ionPeak(): Models.IonPeak {
            return <Models.IonPeak>{
                id: this.xcms_uid,
                mz: this.precursor_mass,
                rt: this.rt,
                name: this.title,
                intensity: this.intensity
            };
        }

        /**
         * @param meta 可以在进行复制的时候，直接传递其自身进来，只需要保持属性名称一致即可
        */
        public constructor(meta: object, matrix: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>, public parent_id: string = null) {
            super(matrix);

            if (!isNullOrUndefined(meta)) {
                this.charge = parseFloat(meta["charge"]);
                this.rt = parseFloat(meta["rt"]);
                this.title = meta["title"];

                let pmass: string = `${meta["precursor_mass"]}`;

                if (Strings.isNumericPattern(pmass)) {
                    this.precursor_mass = parseFloat(pmass);
                } else {
                    this.precursor_mass = pmass;
                }

                if ("intensity" in meta) {
                    this.intensity = parseFloat(meta["intensity"]);
                } else {
                    let mass = (<string>meta["precursor_mass"]).split(/\s+/g);

                    if (mass.length > 1) {
                        this.intensity = parseFloat(mass[1]);
                    } else {
                        this.intensity = 0;
                    }
                }
            }
        }

        public static meta(charge: number, rt: number, title: string, precursor_mass: number | string, intensity: number) {
            return {
                charge: charge,
                rt: rt,
                title: title,
                precursor_mass: precursor_mass,
                intensity: intensity
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
            return $from(Strings.lineTokens(text))
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

        public static IonParse(data: any): mgf {
            // 因为php服务器通过echo传输过来的文本数据
            // 最开始的位置都会存在一个bin头部标记
            // 所以在这里不可以直接做比较
            let mgfFields = {
                'charge': data.charge,
                "precursor_mass": data.precursor_mass,
                "rt": data.rt,
                "title": data.title
            }

            let mz = Base64.bytes_decode(data.mz);
            let into = Base64.bytes_decode(data.into);
            let max_into = Math.max(...into);
            let matrix = [];

            for (let i = 0; i < 8; i++) {
                matrix[i] = {
                    mz: mz[i],
                    into: into[i] / max_into * 100,
                    id: (i + 1).toString()
                }
            }

            return new mgf(mgfFields, matrix);
        }

        public toString(): string {
            return this.title;
        }
    }
}