/// <reference path="./renderingWork.ts" />
/// <reference path="../../../../build/svg.d.ts" />

namespace BioDeep.MSMSViewer {

    export class d3Renderer extends SvgChart {

        protected current: Data.mzData;

        public strokeWidth: number = 6;
        public radius: number = 6;

        public margin: Canvas.Margin;
        public width: number;
        public height: number;

        /**
         * Biodeep® MS/MS alignment viewer
        */
        public svg: d3.Selection<any>;
        public tip: d3.Tooltip;

        public get mzRange(): number[] {
            let range = this.current.mzRange;
            let length = range[1] - range[0];

            // 20190705 在这里需要将范围放宽一些
            // 这样子可以让图尽量居中
            let minMz = range[0] - length * 0.2;
            let maxMz = range[1] + length * 0.2;

            return [minMz < 0 ? 0 : minMz, maxMz];
        }

        public get input(): Data.mzData {
            return this.current;
        }

        public constructor(
            mz: Data.mzData,
            size: number[] | Canvas.Size = [960, 600],
            margin: Canvas.Margin = renderingWork.defaultMargin(),
            csvLink: string = "matrix-csv") {

            super(size, margin);

            this.current = mz.trim().normalize();
            this.margin = margin;
            this.registerDownloader(csvLink);
        }

        private registerDownloader(id: string) {
            var a: HTMLAnchorElement = <any>$ts(Internal.Handlers.EnsureNodeId(id));
            var csv = this.current.csv();

            if (!isNullOrUndefined(a)) {
                var blob = new Blob(["\ufeff", csv]);
                var url = URL.createObjectURL(blob);

                a.href = url;
                a.download = `${this.current.refName}.csv`;

                console.log(a.download);
            }
        }

        /**
         * 这个图标渲染函数的输入显示参数，同时支持节点的id编号属性和html节点对象
         * 
         * @param div 需要显示图标的div区域，请注意，这个函数会将这个div节点内的所有的svg节点都清除掉
        */
        public rendering(div: string | HTMLElement): void {
            if (div instanceof HTMLElement) {
                div = `#${div.id}`;
            } else {
                div = Internal.Handlers.EnsureNodeId(div);
            }

            BioDeep.MSMSViewer.clear(div);

            this.tip = BioDeep.MSMSViewer.tooltip(this.current);
            this.svg = BioDeep.MSMSViewer.svg(this, div);

            // 因为在下面的chartting函数调用之中需要使用tip对象来绑定鼠标事件，
            // 所以在这里需要先于chartting函数将tip对象初始化完毕  
            this.svg.call(<any>this.tip);

            renderingWork.chartting(this);
            renderingWork.Legend(this);

            this.tip.hide();
        }
    }
}