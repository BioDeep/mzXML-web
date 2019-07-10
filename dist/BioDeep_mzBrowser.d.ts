/// <reference path="../../build/linq.d.ts" />
/// <reference path="../../build/svg.d.ts" />
/// <reference path="BioDeep_mzWeb.d.ts" />
/// <reference path="biodeepMSMS.Viewer.d.ts" />
/// <reference path="../../layer.d.ts" />
declare module fileBrowser {
    function createTree(display: string, indexTree: fileIndexTree, viewer: BioDeep.TICviewer): void;
    interface fileIndexTree {
        ID: number;
        Label: string;
        Childs: {};
    }
}
declare namespace BioDeep {
    function reorderHandler(): void;
}
declare namespace BioDeep {
    class TICviewer {
        private fileTree;
        private chart;
        constructor(fileTree: fileBrowser.fileIndexTree);
        draw(id: string, src?: string): void;
        private static doDraw;
        private buildMzList;
        private static mzTree;
    }
}
