namespace BioDeep.Models {

    export class mzInto {

        public id: string;
        public mz: number;
        public into: number;

        public toString(): string {
            return `${this.mz}/${this.into}`;
        }
    }
}