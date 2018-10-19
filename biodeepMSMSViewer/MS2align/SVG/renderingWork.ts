
namespace BioDeep.MSMSViewer.renderingWork {

    export function tooltip(mz: Data.mzData): d3.Tooltip {
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(d => {
                return mz.tooltip(<BioDeep.Models.mzInto>d);
            });

        return tip;
    }

    /**
     * 初始化d3.js可视化引擎
     * 
     * @param id 需要显示svg可视化结果的div的id属性值
    */
    export function svg(data: d3Renderer,
        id: string | HTMLElement = null,
        svgId: string = "viewer-svg"): d3.Selection<any> {

        var margin: Canvas.Margin = data.margin;
        var svg = d3.select(<any>id)
            .append("svg")
            .attr("id", svgId)
            .attr("width", data.width + margin.left + margin.right)
            .attr("height", data.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        return svg;
    }

    /**
     * 在这里进行具体的图表绘制操作
    */
    export function chartting(engine: d3Renderer): d3Renderer {
        var width: number = engine.width;
        var height: number = engine.height;
        var margin: Canvas.Margin = engine.margin;

        // 信号强度是0到100之间，不需要再进行额外的换算了
        var y = d3.scale.linear()
            .domain([-100, 100])
            .range([height, 0])
            .nice();
        var x = d3.scale.linear()
            .domain(engine.current.mzRange)
            .range([0, width])
            .nice();
        var yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat(n => Math.abs(n) + "%")
            .orient("left");

        // 绘制图表之中的网格线
        engine.svg.selectAll("line.horizontalGrid")
            .data(y.ticks(10))
            .enter()
            .append("line")
            .attr({
                "class": "horizontalGrid",
                "x1": margin.right,
                "x2": width,
                "y1": (d) => y(d),
                "y2": (d) => y(d),
                "fill": "rgb(250,250,250)",
                "shape-rendering": "crispEdges",
                "stroke-dasharray": "5,5",
                "stroke": "gray",
                "stroke-width": "1px"
            });

        engine.svg.selectAll(".bar")
            .data(engine.current.mzMatrix)
            .enter()
            .append("rect")
            .attr("class", (d: BioDeep.Models.mzInto) => {
                return `bar ${(d.into < 0) ? "negative" : "positive"}`;
            })
            .attr("y", (d: BioDeep.Models.mzInto) => y(Math.max(0, d.into)))
            .attr("x", (d: BioDeep.Models.mzInto, i: number) => x(d.mz))
            .attr("height", (d: BioDeep.Models.mzInto) => Math.abs(y(d.into) - y(0)))
            .attr("width", engine.strokeWidth)
            .on('mouseover', engine.tip.show)
            .on('mouseout', engine.tip.hide);

        engine.svg.append("g")
            .attr("class", "x axis")
            .call(yAxis);

        engine.svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("x1", 0)
            .attr("x2", width);

        // 添加坐标轴标签
        engine.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height / 2 - 6)
            .style("font-weight", "bold")
            .text("m/z ratio");

        engine.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .style("font-weight", "bold")
            .text("Library intensity(%)");

        return engine;
    }

    export function Legend(engine: d3Renderer): d3Renderer {
        var top = 30;
        var left = engine.width - 255;
        var rw = 240, rh = 60;
        var dw = 15;

        var legend = engine.svg.append("g")
            .attr("class", "legend")
            .attr("x", left)
            .attr("y", top)
            .attr("height", rh)
            .attr("width", rw);

        // 外边框
        legend.append("rect")
            .attr("x", left)
            .attr("y", top)
            .attr("rx", engine.radius)
            .attr("ry", engine.radius)
            .attr("height", rh)
            .attr("width", rw)
            .style("stroke", "gray")
            .style("stroke-width", 2)
            .style("border-radius", "2px")
            .style("fill", "white");

        // 两个代谢物的legend和label
        var d1 = Utils.stripHTML(engine.current.queryName);
        var d2 = Utils.stripHTML(engine.current.refName);

        left += 15;
        top += 23;
        legend.append("rect")
            .attr("x", left)
            .attr("y", top - 13)
            .attr("width", dw)
            .attr("height", dw)
            .style("fill", "steelblue");

        legend.append("text")
            .attr("x", left + dw + 5)
            .attr("y", top)
            .text(d1);

        top += 25
        legend.append("rect")
            .attr("x", left)
            .attr("y", top - 13)
            .attr("width", dw)
            .attr("height", dw)
            .style("fill", "brown");

        legend.append("text")
            .attr("x", left + dw + 5)
            .attr("y", top)
            .text(d2);

        var fontSize: number = 20;
        var fontName: string = "Microsoft YaHei";
        var fontWeight: string = "normal";

        // 添加图表的标题
        engine.svg.append("text")
            .text(BioDeep.MSMSViewer.title)
            .attr("x", function () {
                var font: string = `${fontWeight} ${fontSize}pt "${fontName}"`;
                var width: number = CanvasHelper.getTextWidth(BioDeep.MSMSViewer.title, font);

                // var w = this.getBBox().width + 10;
                // return w;

                return (engine.width - width) / 2;
            })
            .attr("y", -40)
            .style("font-weight", "normal")
            .style("font-size", `${fontSize}pt`);

        return engine;
    }
}
