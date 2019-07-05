/// <reference path="../../../build/linq.d.ts" />
/// <reference path="../../../build/svg.d.ts" />
/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />
/// <reference path="../../../layer.d.ts" />

$ts(function () {
    new BioDeep.TICviewer().draw("#TIC");

    // initial spectrum viewer css style
    BioDeep.MSMSViewer.loadStyles();
})