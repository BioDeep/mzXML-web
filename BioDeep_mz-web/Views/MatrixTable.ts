namespace BioDeep.Views {

    export function CreateTableFromMgfIon(ion: IO.mgf, relative: boolean = true, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        return CreateTableFromMatrix(ion, relative, attrs);
    }

    export function CreateTableFromMatrix(matrix: IEnumerator<Models.mzInto>, relative: boolean = true, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        if (relative) {
            let max = matrix.Select(m => m.into).Max(x => x);
            matrix = matrix.Select(m => new Models.mzInto(m.id, <number>Strings.round(m.mz, 4), <number>Strings.round(m.into / max * 100, 2)));
        }

        return $ts.evalHTML.table(matrix, null, attrs);
    }
}