namespace BioDeep.Views {

    export function CreateTableFromMgfIon(ion: IO.mgf, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        return CreateTableFromMatrix(ion, attrs);
    }

    export function CreateTableFromMatrix(matrix: IEnumerator<Models.mzInto>, attrs: Internal.TypeScriptArgument = null): HTMLElement {
        return $ts.evalHTML.table(matrix, null, attrs);
    }
}