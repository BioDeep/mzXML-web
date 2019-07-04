namespace BioDeep {

    export class TICviewer {

        public draw(id: string) {
            $ts.getText("@mgf", function (text) {
                let mgf = BioDeep.IO.mgf.Parse(text);
                let chart = new BioDeep.MSMSViewer.TICplot();

                chart.plot(id, mgf);
            });
        }
    }
}