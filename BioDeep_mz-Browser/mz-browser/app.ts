/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../../../build/svg.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
/// <reference path="../../../layer.d.ts" />

$ts(function () { 
    // initial spectrum viewer css style
    BioDeep.MSMSViewer.loadStyles();

    $ts.getText("index.json", function (text) {
        let indexTree = JSON.parse(text);
        let viewer = new BioDeep.TICviewer(indexTree); 

        viewer.draw("#TIC");          
    });    
})