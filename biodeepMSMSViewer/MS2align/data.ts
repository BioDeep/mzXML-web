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

        /**
         * X坐标轴范围
        */
        public mzRange: number[];

        /**
         * 包含有query和reference的镜像数据
        */
        public mzMatrix: BioDeep.Models.mzInto[];
        public queryName: string;
        public refName: string;
        public xref: string;

        public constructor(
            mz: number[] | data.NumericRange,
            align: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>) {

            var range: data.NumericRange = Array.isArray(mz) ?
                data.NumericRange.Create(mz) : mz;

            this.mzRange = [range.min, range.max];
            this.mzMatrix = Array.isArray(align) ? align : align.ToArray();
        }

        /**
         * Set information
        */
        public info(queryName: string, refName: string, xref: string): mzData {
            this.queryName = queryName;
            this.refName = refName;
            this.xref = xref;

            return this;
        }

        public trim(intoCutoff: number = 5): mzData {
            var src = new IEnumerator<BioDeep.Models.mzInto>(this.mzMatrix);
            var max: number = Math.abs(src.Max(m => m.into).into);
            var trimmedData = From(this.mzMatrix).Where(m => Math.abs(m.into / max * 100) >= intoCutoff);
            var newRange = data.NumericRange.Create(trimmedData.Select(m => m.mz));
            var newMatrix = new mzData(newRange, trimmedData);

            newMatrix.queryName = this.queryName;
            newMatrix.refName = this.refName;
            newMatrix.xref = this.xref;

            return newMatrix;
        }

        /**
         * 将响应强度的数据归一化到``[0, 100]``的区间范围内，然后返回当前的数据实例自身
        */
        public normalize(): mzData {
            var src = new IEnumerator<BioDeep.Models.mzInto>(this.mzMatrix);
            var max: number = Math.abs(src.Max(m => m.into).into);

            this.mzMatrix.forEach(m => m.into = m.into / max * 100);
            return this;
        }

        public tooltip(mz: BioDeep.Models.mzInto): string {
            var name: string = mz.into >= 0 ? this.queryName : this.refName;
            var tipText: string = `m/z: ${mz.mz.toFixed(4)} (
                <strong>
                    <span style="color:red;">
                        ${Math.floor(Math.abs(mz.into))}%
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
            var meta = `#name=${this.refName};xref=${this.xref}`;
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

    export function JSONParser(data: JSONrespon, decoder: ((string) => Models.mzInto[]) = null): mzData {
        var mzInt: BioDeep.Models.mzInto[] = [];

        if (typeof data.align == "string") {
            if (isNullOrUndefined(decoder)) {
                throw "No SVG decoder was provided!";
            } else {
                mzInt = decoder(data.align);
            }
        } else {
            mzInt = parseMirror(data.align);
        }

        var mzRange: number[] = From(mzInt).Select(x => x.mz).ToArray();
        var align: mzData = new mzData(mzRange, mzInt);
        align.queryName = data.query;
        align.refName = data.reference;
        align.xref = data.xref;

        return align;
    }

    function parseMirror(aligns: align[]): Models.mzInto[] {
        return From(aligns)
            .Select((x, i) => {
                var a: Models.mzInto;
                var b: Models.mzInto;

                if (x.into1) {
                    var mzX = parseFloat(new Number(x.mz).toFixed(4));
                    var into = parseFloat(new Number(x.into1 * 100).toFixed(0));
                    a = new BioDeep.Models.mzInto(i.toString(), mzX, into);
                }

                if (x.into2) {
                    // 参考是位于图表的下半部分，倒过来的
                    // 所以在这里会需要乘以-1来完成颠倒
                    var mzX = parseFloat(new Number(x.mz).toFixed(4));
                    var into = -1 * parseFloat(new Number(x.into2 * 100).toFixed(0));
                    b = new BioDeep.Models.mzInto(i.toString(), mzX, into);
                }

                return [a, b];
            })
            .Unlist(x => x)
            .ToArray();
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
        align.xref = "0";

        return align;
    }

    export class JSONrespon {

        public query: string;
        public reference: string;
        public align: align[] | string;
        public xref: string;

    }

    export class align {

        public mz: number;
        public into1: number;
        public into2: number;

    }
}