/// <reference path="vendor/linq.d.ts" />
/// <reference path="vendor/svg.d.ts" />
/// <reference path="vendor/layer.d.ts" />
/// <reference path="BioDeep_mzWeb.d.ts" />
/// <reference path="biodeepMSMS.Viewer.d.ts" />
declare namespace biodeep {
    function start(): void;
}
declare namespace BioDeep {
    class reorderHandler {
        private tbody;
        private bodyRows;
        private preOrders;
        private index;
        constructor();
        private titleClick;
        addHandle(): void;
    }
}
declare namespace BioDeep {
    class RawFileViewer {
        fileTree: BioDeep.IO.MzWebCache.Stream;
        private viewer;
        private chart;
        private spectrums;
        constructor(fileTree: BioDeep.IO.MzWebCache.Stream, viewer: pages.mzwebViewer);
        private static doSpectrumRender;
        draw(id: string, isBPC: boolean): void;
        ViewMs1(scan_id: string): void;
        ViewMs2(parent: string, scan_id: string): void;
        ViewIon(ion: IO.mgf): void;
        /**
         * XIC
        */
        private buildMzList;
        showXIC(id: string, xic: IEnumerator<IO.MzWebCache.XICTick>): void;
        private static mzTree;
    }
}
declare module fileBrowser {
    function buildjsTree(fileIndex: BioDeep.IO.MzWebCache.Stream, uid: components.uid): components.jsTreeModel;
}
declare namespace components {
    class uid {
        private guid;
        get nextGuid(): number;
    }
    interface jsTreeModel {
        id: number;
        text: string;
        children: jsTreeModel[];
        icon: string;
    }
    interface fileIndexTree {
        ID: number;
        Label: string;
        Childs: {};
    }
}
declare namespace pages {
    class mzwebViewer extends Bootstrap {
        get appName(): string;
        private stream;
        private viewer;
        protected init(): void;
        showTIC(): void;
        showXIC(): void;
        showNav(): void;
        hideNav(): void;
        private createTree;
        bpc_onchange(value: boolean): void;
        do_SIM(): void;
    }
}
