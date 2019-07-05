/// <reference path="../../build/linq.d.ts" />
/// <reference path="../dist/BioDeep_mzWeb.d.ts" />

namespace BioDeep.MSMSViewer {

    /**
     * Clear all of the svg elements in target html element
     * 
     * @param canvas id, class, or a html element object instance
    */
    export function clear(canvas: string | HTMLElement) {
        if (typeof canvas == "string") {
            if (canvas.charAt(0) == "#" || canvas.charAt(0) == ".") {
                // do nothing
            } else {
                // by default is id
                canvas = `#${canvas}`;
            }
        } else {
            // get id
            canvas = `#${canvas.id}`;
        }

        // 2018-10-18
        // 会需要使用选择器来进行正确的选择svg元素
        // 否则会出现意外的将其他的svg节点清除的bug

        // 在进行新的图表绘制之前，需要清除所有的已经绘制的图表
        // 否则二者会叠加在一起
        d3.selectAll(`${canvas}>svg`).remove();
    }

    /**
     * 初始化d3.js可视化引擎
     * 
     * @param id 需要显示svg可视化结果的div的id属性值
    */
    export function svg(engine: SvgChart,
        id: string | HTMLElement = null,
        svgId: string = "viewer-svg"): d3.Selection<any> {

        var margin: Canvas.Margin = engine.margin;
        var svg = d3.select(<any>id)
            .append("svg")
            .attr("id", svgId)
            .attr("width", engine.width + margin.left + margin.right)
            .attr("height", engine.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        return svg;
    }
}