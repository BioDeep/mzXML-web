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

            $ts.getText("@mzxml", function (text) {
                //let indexTree = JSON.parse(text);
                //let viewer = new BioDeep.RawFileViewer(indexTree);

                //viewer.draw("#TIC");
                vm.stream = BioDeep.IO.MzWebCache.loadStream(text, <any>$ts("@fileName"));

                console.log(vm.stream);

                vm.viewer = new BioDeep.RawFileViewer(vm.stream, this);
                vm.createTree("#fileTree");
                vm.viewer.draw("#TIC", $input("#bpc").checked);
                vm.showTIC();
            });


            $(document).on('click', '.jstree-closed .jstree-ocl', () => {
                this.hideNav();
            })
            $(document).on('click', '.jstree-open .jstree-ocl', () => {
                this.showNav();
            })
           /* $(document).on('click', () => {
                this.hideNav();
            })
            $(document).on('click', '#nav', (event) => {
                this.showNav();
                event.stopPropagation();
            })*/
            this.showTIC();
        }

        public showTIC() {
            $ts("#showTIC").addClass("btn-primary").removeClass("btn-default");
            $ts("#showXIC").removeClass("btn-primary").addClass("btn-default");

            $ts("#TIC").show();
            $ts("#XIC").hide();
        }

        public showXIC() {
            $ts("#showXIC").addClass("btn-primary").removeClass("btn-default");
            $ts("#showTIC").removeClass("btn-primary").addClass("btn-default");

            $ts("#XIC").show();
            $ts("#TIC").hide();
        }

        public showNav() {
            $("#nav").css("width", "auto");
            $("#showNav").hide();
            $("#hideNav").show();
            console.log('show')
        }

        public hideNav() {
            $("#nav").css("width", "13%");
            $("#hideNav").hide();
            $("#showNav").show();
            console.log('hide')
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

        public bpc_onchange(value: boolean) {
            this.viewer.draw("#TIC", $input("#bpc").checked);
            this.showTIC();
        }

        public do_SIM() {
            let min = parseFloat($input("#sim-min").value);
            let max = parseFloat($input("#sim-max").value);
            let SIM = this.viewer.fileTree.selects(ion => ion.mz >= min && ion.mz <= max);
            let vm = this.viewer;

            vm.showXIC("#sim-TIC", SIM);

            this.showXIC();

        }
    }
}