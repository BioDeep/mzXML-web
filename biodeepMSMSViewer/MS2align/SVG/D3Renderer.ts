/// <reference path="./renderingWork.ts" />
/// <reference path="../../../../build/svg.d.ts" />

namespace BioDeep.MSMSViewer {

    export class d3Renderer {

        public current: Data.mzData;

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

        public constructor(
            mz: Data.mzData,
            size: number[] | Canvas.Size = [960, 600],
            margin: Canvas.Margin = renderingWork.defaultMargin(),
            csvLink: string = "matrix-csv") {

            if (!Array.isArray(size)) {
                size = [size.width, size.height];
            }

            this.current = mz.trim().normalize();
            this.margin = margin;
            this.width = size[0] - margin.left - margin.right;
            this.height = size[1] - margin.top - margin.bottom;
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

            this.tip = renderingWork.tooltip(this.current);
            this.svg = renderingWork.svg(this, div);

            // 因为在下面的chartting函数调用之中需要使用tip对象来绑定鼠标事件，
            // 所以在这里需要先于chartting函数将tip对象初始化完毕  
            this.svg.call(<any>this.tip);

            renderingWork.chartting(this);
            renderingWork.Legend(this);

            this.tip.hide();
        }
    }
}