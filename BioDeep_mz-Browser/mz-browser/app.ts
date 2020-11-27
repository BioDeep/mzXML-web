/// <reference path="../../dist/vendor/linq.d.ts" />
/// <reference path="../../dist/vendor/svg.d.ts" />
/// <reference path="../../dist/vendor/layer.d.ts" />

/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />
/// <reference path="../../dist/biodeepMSMS.Viewer.d.ts" />

namespace biodeep {

    export function start() {
        Router.AddAppHandler(new pages.mzwebViewer());

        Router.RunApp();
    }
}

$ts.mode = Modes.debug;
$ts(biodeep.start);