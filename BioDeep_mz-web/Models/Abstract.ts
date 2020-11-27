
namespace BioDeep.Models {

    export class IMs2Scan extends IEnumerator<BioDeep.Models.mzInto> {

        public get mzInto(): BioDeep.Models.mzInto[] {
            return [...this.sequence];
        };

        public constructor(matrix: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>) {
            super(matrix);
        }
    }
}