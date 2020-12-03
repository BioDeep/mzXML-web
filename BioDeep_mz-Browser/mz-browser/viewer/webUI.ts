module WebUI {

    export function showTIC() {
        $ts("#showTIC").addClass("btn-primary").removeClass("btn-default");
        $ts("#showXIC").removeClass("btn-primary").addClass("btn-default");

        $ts("#TIC").show();
        $ts("#XIC").hide();
    }

    export function showXIC() {
        $ts("#showXIC").addClass("btn-primary").removeClass("btn-default");
        $ts("#showTIC").removeClass("btn-primary").addClass("btn-default");

        $ts("#XIC").show();
        $ts("#TIC").hide();
    }

    export function showNav() {
        $("#nav").css("width", "auto");
        $("#showNav").hide();
        $("#hideNav").show();
        console.log('show')
    }

    export function hideNav() {
        $("#nav").css("width", "13%");
        $("#hideNav").hide();
        $("#showNav").show();
        console.log('hide')
    }
}