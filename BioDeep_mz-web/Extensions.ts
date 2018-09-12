namespace BioDeep {

    /**
     * 一个比较通用的二级质谱矩阵解析函数
     * 
     * @param text 要求这个文本之中的每一行数据都应该是mz into的键值对
     *            mz和into之间的空白可以是任意空白
    */
    export function GenericMatrixParser(text: string): Models.mzInto[] {
        return (<IEnumerator<string>>$ts(Strings.lineTokens(text)))
            .Select(line => mzIntoParser(line))
            .ToArray();
    }

    function mzIntoParser(line: string): Models.mzInto {
        var chars: string[] = Strings.ToCharArray(line.trim());
    }
}