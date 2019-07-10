namespace BioDeep.MSMSViewer {

    export class Spectrum extends SvgChart {

        public constructor(
            size: Canvas.Size | number[] = [800, 500],
            margin: Canvas.Margin = renderingWork.defaultMargin()) {

            super(size, margin);
        }

        public renderChart(id: string, ions: IEnumerator<Models.mzInto>) {

        }
    }
}