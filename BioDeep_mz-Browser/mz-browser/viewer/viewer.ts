namespace pages {

    export class mzwebViewer extends Bootstrap {

        public get appName(): string {
            return "mzweb";
        }

        private stream: BioDeep.IO.MzWebCache.Stream;
        private viewer: BioDeep.RawFileViewer;

        protected init(): void {
            let vm = this;

            // initial spectrum viewer css style
            BioDeep.MSMSViewer.loadStyles();
            layer.msg("Downloading data from biodeep web server...", { time: -1 });

            $ts.getText("@mzxml", function (text) {
                layer.msg("load data stream...", { time: -1 });

                vm.stream = BioDeep.IO.MzWebCache.loadStream(text, <any>$ts("@fileName"));

                console.log(vm.stream);

                vm.viewer = new BioDeep.RawFileViewer(vm.stream, this);
                vm.createTree("#fileTree");
                vm.viewer.draw("#TIC", $input("#bpc").checked);
                vm.showTIC();
                vm.hideNav();

                layer.closeAll();
            });

            $(document).on('click', '.jstree-closed .jstree-ocl', WebUI.hideNav);
            $(document).on('click', '.jstree-open .jstree-ocl', WebUI.showNav);

            WebUI.showTIC();
        }

        private createTree(display: string) {
            let jsTree = fileBrowser.buildjsTree(this.stream, new components.uid());
            let vm = this;

            $(display).jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": { "stripes": true },
                    'data': jsTree
                }
            });

            $(display).on('changed.jstree', function (e, data) {
                let path: string[] = data.instance.get_path(data.node, '|').split("|");

                if (path.length == 1) {
                    // 文件的根节点
                    // 根据选项显示TIC/BPC/Scatter
                    vm.viewer.draw("#TIC", $input("#bpc").checked);
                    vm.showTIC();
                } else if (path.length == 2) {
                    // ms1 scan
                    vm.viewer.ViewMs1(path[1]);
                } else {
                    // ms2 scan
                    vm.viewer.ViewMs2(path[1], path[2]);
                }
            });
        }

        //#region "hooks of buttn click event"

        public showTIC() {
            WebUI.showTIC();
            WebUI.hideNav();
        }

        public showXIC() {
            WebUI.showXIC();
            WebUI.hideNav();
        }

        public showNav() {
            WebUI.showNav();
        }

        public hideNav() {
            WebUI.hideNav();
        }

        //#endregion

        public bpc_onchange(value: boolean) {
            this.viewer.draw("#TIC", $input("#bpc").checked);
            this.showTIC();
            this.hideNav()
        }

        public rt_relative_onchange(value: boolean) {
            if (!this.viewer.TICmode) {
                this.viewer.showXIC("#TIC", value);
            }

            this.hideNav()
        }

        public do_SIM() {
            let min = parseFloat($input("#sim-min").value);
            let max = parseFloat($input("#sim-max").value);
            let SIM = this.viewer.fileTree.selects(ion => ion.mz >= min && ion.mz <= max);

            this.viewer.showXIC("#sim-TIC", $input("#rt_relative").checked, SIM);

            if (SIM.Count == 0) {
                layer.msg(`Sorry, no ions in current selected m/z range: [${min}, ${max}]...`);
            }

            WebUI.showXIC();
            WebUI.hideNav();
        }
    }
}