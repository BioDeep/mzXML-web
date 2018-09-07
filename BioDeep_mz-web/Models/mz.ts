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

        public constructor(id: string, mz: number, into: number) {
            this.id = id;
            this.mz = mz;
            this.into = into;
        }

        public toString(): string {
            return `${this.mz}/${this.into}`;
        }
    }
}