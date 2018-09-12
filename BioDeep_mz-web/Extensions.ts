namespace BioDeep {

    /**
     * 一个比较通用的二级质谱矩阵解析函数
     * 
     * @param text 要求这个文本之中的每一行数据都应该是mz into的键值对
     *            mz和into之间的空白可以是任意空白
    */
    export function GenericMatrixParser(text: string): Models.mzInto[] {
        return (<IEnumerator<string>>$ts(Strings.lineTokens(text)))
            .Select((line, i) => mzIntoParser(line, i))
            .ToArray();
    }

    function mzIntoParser(line: string, index: number): Models.mzInto {
        var data: string[] = Strings.Trim(line, " \t\n").split(/\s+/g);
        var mz: string = data[0];
        var into: string = data[1];

        if ((!mz) || (!into)) {
            throw `Data format error: missing m/z or into (line[${index}]='${line}')`;
        } else {
            return new Models.mzInto(
                index.toString(),
                parseFloat(mz),
                parseFloat(into)
            );
        }
    }
}