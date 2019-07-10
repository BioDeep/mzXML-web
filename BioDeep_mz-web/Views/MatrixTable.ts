namespace BioDeep.Views {

    export function CreateTableFromMgfIon(ion: IO.mgf, relative: boolean = true, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        return CreateTableFromMatrix(ion, relative, attrs);
    }

    export function CreateTableFromMatrix(matrix: IEnumerator<Models.mzInto>, relative: boolean = true, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        if (relative) {
            let max = matrix.Select(m => m.into).Max(x => x);
            let normalize = function (m: Models.mzInto) {
                let mz: number = <number>Strings.round(m.mz, 4);
                let into: number = <number>Strings.round(m.into / max * 100, 2);

                return new Models.mzInto(m.id, mz, into);
            }

            matrix = matrix.Select(m => normalize(m));
        }

        return $ts.evalHTML.table(matrix, null, attrs);
    }
}