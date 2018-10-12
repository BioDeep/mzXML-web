/// <reference path="../build/linq.d.ts" />
/// <reference path="../mzXML-web/dist/BioDeep_mzWeb.d.ts" />

// Demo test data

/**
 var data = {
	 query: "CH<sub>3</sub>H<sub>2</sub>O",
	 reference: "CO<sub>2</sub>NH<sub>4</sub>",
	 align : [
	     {mz: 10, int1:15,  int2: 20},
	     {mz:125, int1:20,  int2: 30},
	     {mz:200, int1:0,   int2:100},
	     {mz:273, int1:0,   int2:100},
	     {mz:300, int1:22,  int2:100},
	     {mz:400, int1:100, int2: 18},
	     {mz:600, int1:2,   int2:  6},
	     {mz:800, int1:26,  int2: 18}
     ]}; 
 */

namespace BioDeep.MSMSViewer.Data {

    export class mzData {

        public mzRange: number[];
        public mzMatrix: BioDeep.Models.mzInto[];
        public queryName: string;
        public refName: string;
        public metlin: string;

        public constructor(mz: number[] | data.NumericRange, align: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>) {
            var range: data.NumericRange = Array.isArray(mz) ?
                data.NumericRange.Create(mz) : mz;

            this.mzRange = [range.min, range.max];
            this.mzMatrix = Array.isArray(align) ? align : align.ToArray();
        }

        public tooltip(mz: BioDeep.Models.mzInto): string {
            var name: string = mz.into >= 0 ? this.queryName : this.refName;
            var tipText: string = `m/z: ${mz.mz} (
                <strong>
                    <span style="color:red;">
                        ${Math.abs(mz.into)}%
                    </span>
                </strong>)`;
            var html: string = `
                <p>
                    ${name}<br />
                           <br />
                    ${tipText}
                </p>`;

            return html;
        }

        public csv(): string {
            var meta = `#name=${this.refName};metlin=${this.metlin}`;
            var header = "id,mz,into";
            var table: string = "";
            var i = 0;

            this.mzMatrix.forEach(mz => {
                if (mz.into > 0) {
                    table = table + `${++i},${mz.mz},${mz.into}\n`;
                }
            });

            return meta + "\n" + header + "\n" + table;
        }
    }

    export function JSONParser(data: JSONrespon): mzData {
        var mzRange: number[] = [];
        var mzInt: BioDeep.Models.mzInto[] = [];
        var mzX: number;
        var into: number;

        data.align
            .forEach((x, i) => {
                mzRange.push(x.mz);

                if (x.into1) {
                    mzX = parseFloat(new Number(x.mz).toFixed(4));
                    into = parseFloat(new Number(x.into1 * 100).toFixed(0));
                    mzInt.push(new BioDeep.Models.mzInto(i.toString(), mzX, into));
                }

                if (x.into2) {
                    // 参考是位于图表的下半部分，倒过来的
                    // 所以在这里会需要乘以-1来完成颠倒
                    mzX = parseFloat(new Number(x.mz).toFixed(4));
                    into = -1 * parseFloat(new Number(x.into2 * 100).toFixed(0));
                    mzInt.push(new BioDeep.Models.mzInto(i.toString(), mzX, into));
                }
            });

        var align: mzData = new mzData(mzRange, mzInt);
        align.queryName = data.query;
        align.refName = data.reference;
        align.metlin = data.metlin;

        return align;
    }

    /**
     * @param matrix 在这个函数之中会将这个二级碎片矩阵转换为一个镜像矩阵
    */
    export function PreviewData(
        mz: number, rt: number,
        matrix: BioDeep.Models.mzInto[],
        title: string = "Unknown"): mzData {

        var mzSrc: IEnumerator<BioDeep.Models.mzInto> = From(matrix);
        var mzRange = data.NumericRange.Create(mzSrc.Select(mz => mz.mz));
        var intoMax = mzSrc.Select(mz => mz.into).Max();
        var mirror: IEnumerator<BioDeep.Models.mzInto> = mzSrc
            .Select(mz => {
                var into = mz.into / intoMax * 100;
                var mir = new BioDeep.Models.mzInto(mz.id, mz.mz, -into);
                mz.into = into;
                return [mz, mir];
            })
            .Unlist<BioDeep.Models.mzInto>();

        var align: mzData = new mzData(mzRange, mirror);
        align.queryName = `${mz}@${rt}`;
        align.refName = title;
        align.metlin = "0";

        return align;
    }

    export class JSONrespon {

        public query: string;
        public reference: string;
        public align: align[];
        public metlin: string;

    }

    export class align {

        public mz: number;
        public into1: number;
        public into2: number;

    }
}