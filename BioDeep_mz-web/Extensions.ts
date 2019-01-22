namespace BioDeep {

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
    export function GenericMatrixParser(text: string): Models.mzInto[] {
        return $ts(Strings.lineTokens(text))
            .Select((line, i) => mzIntoParser(line, i))
            .ToArray();
    }

    /** 
     * 这个函数输入的文本内容是``base64``字符串
    */
    export function GenericBase64MatrixParser(base64Stream: string) : Models.mzInto[] {
        return GenericMatrixParser(Base64.decode(base64Stream));
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