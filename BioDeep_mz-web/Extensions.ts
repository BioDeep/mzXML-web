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
    export function GenericBase64MatrixParser(base64Stream: string): Models.mzInto[] {
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

    export function ppm_primitive(x: number, y: number): number {
        return Math.abs(x - y) / x * 1000000;
    }

    export function ppm(x: number | IEnumerator<number> | number[], y: number | IEnumerator<number> | number[]): number | number[] {
        var tx = TypeInfo.typeof(x);
        var ty = TypeInfo.typeof(y);

        if (tx.IsPrimitive && ty.IsPrimitive) {
            return ppm_primitive(<number>x, <number>y);
        }
        if (tx.IsPrimitive) {
            if (ty.IsArray) {
                y = new IEnumerator<number>(<any>y);
            }

            return (<IEnumerator<number>>y)
                .Select(a => ppm_primitive(<number>x, a))
                .ToArray();
        }
        if (ty.IsPrimitive) {
            if (tx.IsArray) {
                x = new IEnumerator<number>(<any>x);
            }

            return (<IEnumerator<number>>x)
                .Select(a => ppm_primitive(a, <number>y))
                .ToArray();
        }

        // x, y都是基元类型
        // 则二者必须等长
        var sx = new IEnumerator<number>(<any>x);
        var sy = new IEnumerator<number>(<any>y);

        if (sx.Count != sy.Count) {
            if (TypeScript.logging.outputWarning) {
                console.warn(`Sequence x(length=${sx.Count}) <> Sequence y(length=${sy.Count}), calculation will follow the shortest sequence.`);
            }

            if (sx.Count > sy.Count) {
                sx = sx.Take(sy.Count);
            } else {
                sy = sy.Take(sx.Count);
            }
        }

        return sx
            .Select((xi, i) => ppm_primitive(xi, sy.ElementAt(i)))
            .ToArray();
    }
}