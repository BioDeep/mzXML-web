namespace BioDeep.MSMSViewer.renderingWork {

    export class margin {

        public top: number;
        public right: number;
        public bottom: number;
        public left: number;

        public constructor(
            top: number = 70,
            right: number = 10,
            bottom: number = 10,
            left: number = 50) {

            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.left = left;
        }

        public static default(): margin {
            return new margin();
        }

        public toString(): string {
            return `[${this.top}, ${this.right}, ${this.bottom}, ${this.left}]`;
        }
    }
}