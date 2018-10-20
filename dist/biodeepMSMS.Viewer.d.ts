/// <reference path="BioDeep_mzWeb.d.ts" />
/// <reference path="../../build/linq.d.ts" />
/// <reference path="../../build/svg.d.ts" />
/// <reference types="d3-tip" />
/// <reference types="d3" />
declare namespace BioDeep.MSMSViewer.PeakScatter {
    class PlotRenderer {
        margin: Canvas.Margin;
        size: Canvas.Size;
        private svg;
        private tooltip;
        constructor(size: Canvas.Size, margin?: Canvas.Margin);
        private xAxis;
        private yAxis;
        render(data: Models.IonPeak[], peakClick?: (d: Models.IonPeak) => void): void;
    }
}
/**
 * ## mzXML file reader and javascript data visualization tools
 *
 * - http://www.biodeep.cn
 *
 * > https://github.com/BioDeep/mzXML-web
*/
declare namespace BioDeep.MSMSViewer {
    const title: string;
    function renderChart(containerId: string, api: string, id: string): void;
    /**
     * 注释输出的svg id和数据源的api链接，然后返回渲染动作的函数指针
     *
     * @param svgDisplay 需要显示SVG图表的html的节点的id编号属性值
     * @param api 这个参数为url字符串模板，指示如何从服务器获取绘图数据，使用%s占位符标记资源编号
     *            api所返回来的数据应该是满足``JSONrespon``对象的格式要求的
     *
     * @returns ``(res_id: string) => void``
    */
    function register(svgDisplay: string, api: string): (res_id: string) => void;
    /**
     * 将所给定的质谱图数据显示在给定的div之中
     *
     * @param divId 如果实际运行中使用节点的id编号属性字符串出现空值错误的话，
     *     可以将这个参数由id字符串变为实际的节点对象值
     * @param data 图表绘图数据，请注意，需要这个数据是一个镜像数据
    */
    function previews(divId: string | HTMLElement, data: Data.mzData, size?: number[]): void;
}
/**
 var data = {
     query: "CH<sub>3</sub>H<sub>2</sub>O",
     reference: "CO<sub>2</sub>NH<sub>4</sub>",
     align : [
         {mz: 10, int1:15,  int2: 20},
         {mz:125, int1:20,  int2: 30},
         {mz:200, int1:0,   int2:100},
         {mz:273, int1:0,   int2:100},
         {mz:300, int1:22,  int2:100},
         {mz:400, int1:100, int2: 18},
         {mz:600, int1:2,   int2:  6},
         {mz:800, int1:26,  int2: 18}
     ]};
 */
declare namespace BioDeep.MSMSViewer.Data {
    class mzData {
        mzRange: number[];
        mzMatrix: BioDeep.Models.mzInto[];
        queryName: string;
        refName: string;
        metlin: string;
        constructor(mz: number[] | data.NumericRange, align: BioDeep.Models.mzInto[] | IEnumerator<BioDeep.Models.mzInto>);
        trim(intoCutoff?: number): mzData;
        tooltip(mz: BioDeep.Models.mzInto): string;
        csv(): string;
    }
    function JSONParser(data: JSONrespon): mzData;
    /**
     * @param matrix 在这个函数之中会将这个二级碎片矩阵转换为一个镜像矩阵
    */
    function PreviewData(mz: number, rt: number, matrix: BioDeep.Models.mzInto[], title?: string): mzData;
    class JSONrespon {
        query: string;
        reference: string;
        align: align[];
        metlin: string;
    }
    class align {
        mz: number;
        into1: number;
        into2: number;
    }
}
declare namespace BioDeep.Utils {
    /**
     * 因为D3里面的text不支持html标签，所以需要使用这个函数将名称
     * 之中的html标记去除
     *
    */
    function stripHTML(html: string): string;
    /**
     * Returns path data for a rectangle with rounded right corners.
     * The top-left corner is (x,y).
    */
    function rightRoundedRect(x: number, y: number, width: number, height: number, radius: number): string;
}
declare namespace BioDeep.MSMSViewer {
    /**
     * 如果图表上面的二级碎片信号柱子的颜色是黑色，则肯定是没有相关的样式信息
     * 需要在渲染图表之间调用这个函数进行样式信息的生成
     *
     * @param style 可以通过这个参数来修改图表的一些样式细节
    */
    function loadStyles(style?: Styles): void;
    class Styles {
        queryColor: string;
        refColor: string;
        highlightColor: string;
        static defaultStyle(): Styles;
    }
}
declare namespace BioDeep.MSMSViewer.renderingWork {
    function tooltip(mz: Data.mzData): d3.Tooltip;
    /**
     * 初始化d3.js可视化引擎
     *
     * @param id 需要显示svg可视化结果的div的id属性值
    */
    function svg(data: d3Renderer, id?: string | HTMLElement, svgId?: string): d3.Selection<any>;
    /**
     * 在这里进行具体的图表绘制操作
    */
    function chartting(engine: d3Renderer): d3Renderer;
    function Legend(engine: d3Renderer): d3Renderer;
}
declare namespace BioDeep.MSMSViewer {
    class d3Renderer {
        current: Data.mzData;
        strokeWidth: number;
        radius: number;
        margin: Canvas.Margin;
        width: number;
        height: number;
        /**
         * Biodeep® MS/MS alignment viewer
        */
        svg: d3.Selection<any>;
        tip: d3.Tooltip;
        constructor(mz: Data.mzData, canvasSize?: number[], canvasMargin?: Canvas.Margin, csvLink?: string);
        private registerDownloader;
        /**
         * 这个图标渲染函数的输入显示参数，同时支持节点的id编号属性和html节点对象
         *
         * @param div 需要显示图标的div区域，请注意，这个函数会将这个div节点内的所有的svg节点都清除掉
        */
        rendering(div: string | HTMLElement): void;
    }
}
declare namespace BioDeep.MSMSViewer.renderingWork {
    function defaultMargin(): Canvas.Margin;
}
