namespace BioDeep.MSMSViewer.Data {

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

        var mzRange: number[] = $from(mzInt).Select(x => x.mz).ToArray();
        var align: mzData = new mzData(mzRange, mzInt);

        align.queryName = data.query;
        align.refName = data.reference;
        align.xref = data.xref;

        return align;
    }

    function parseMirror(aligns: align[]): Models.mzInto[] {
        return $from(aligns)
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

        var mzSrc: IEnumerator<BioDeep.Models.mzInto> = $from(matrix);
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
}