namespace BioDeep.Models {

    export class mzInto {

        public id: string;
        /**
         * m/z
        */
        public mz: number;
        /**
         * intensity
        */
        public into: number;

        public toString(): string {
            return `${this.mz}/${this.into}`;
        }
    }
}