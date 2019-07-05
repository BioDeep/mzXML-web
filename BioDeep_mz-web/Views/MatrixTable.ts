namespace BioDeep.Views {

    export function CreateTableFromMgfIon(ion: IO.mgf): HTMLElement {
        return CreateTableFromMatrix(ion);
    }

    export function CreateTableFromMatrix(matrix: IEnumerator<Models.mzInto>): HTMLElement {
        return $ts.evalHTML.table(matrix);
    }
}