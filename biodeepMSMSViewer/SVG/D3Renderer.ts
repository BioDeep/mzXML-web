/// <reference path="./renderingWork.ts" />

namespace BioDeep.MSMSViewer {

    export class d3Renderer {

        public current: Data.mzData;

        public strokeWidth: number = 6;
        public radius: number = 6;

        public margin: renderingWork.margin;
        public width: number;
        public height: number;

        /**
         * Biodeep® MS/MS alignment viewer
        */
        public svg: d3.Selection<any>;
        public tip: d3.Tooltip;

        public constructor(
            mz: Data.mzData,
            canvasSize: number[] = [960, 600],
            canvasMargin: renderingWork.margin = renderingWork.margin.default(),
            csvLink: string = "matrix-csv") {

            this.current = mz;
            this.margin = canvasMargin;
            this.width = canvasSize[0] - canvasMargin.left - canvasMargin.right;
            this.height = canvasSize[1] - canvasMargin.top - canvasMargin.bottom;
            this.registerDownloader(csvLink);
        }

        private registerDownloader(id: string) {
            var a = <HTMLAnchorElement>document.getElementById(id);
            var csv = this.current.csv();

            if (a && a != undefined) {
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

            // 在进行新的图表绘制之前，需要清除所有的已经绘制的图表
            // 否则二者会叠加在一起
            d3.selectAll("svg").remove();

            this.tip = renderingWork.tooltip(this.current);
            this.svg = renderingWork.svg(this, div);

            // 因为在下面的chartting函数调用之中需要使用tip对象来绑定鼠标事件，
            // 所以在这里需要先于chartting函数将tip对象初始化完毕  
            console.log(this.tip);
            console.log(this.svg);

            this.svg.call(<any>this.tip);

            renderingWork.chartting(this);
            renderingWork.Legend(this);
        }
    }
}