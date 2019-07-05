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

}