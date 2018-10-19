namespace BioDeep.MSMSViewer.PeakScatter {

    export class PlotRenderer {

        public margin: Canvas.Margin;
        public size: Canvas.Size;

        public constructor(
            size: Canvas.Size,
            margin: Canvas.Margin = <Canvas.Margin>{
                top: 20, right: 20, bottom: 30, left: 40
            }) {

            this.margin = Canvas.Margin.Object(margin);
            this.size = <Canvas.Size>{
                width: size.width - this.margin.horizontal,
                height: size.height - this.margin.vertical
            };
        }
    }
}