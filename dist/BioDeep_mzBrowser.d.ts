/// <reference path="../../build/linq.d.ts" />
/// <reference path="../../build/svg.d.ts" />
/// <reference path="BioDeep_mzWeb.d.ts" />
/// <reference path="biodeepMSMS.Viewer.d.ts" />
declare namespace BioDeep {
    class TICviewer {
        private chart;
        draw(id: string): void;
        private buildMzList;
        private static mzTree;
    }
}
