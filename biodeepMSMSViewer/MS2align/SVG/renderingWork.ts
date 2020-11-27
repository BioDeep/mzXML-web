
namespace BioDeep.MSMSViewer.renderingWork {

    /**
     * 在这里进行具体的图表绘制操作
    */
    export function chartting(engine: d3Renderer): d3Renderer {
        let width: number = engine.width;
        let height: number = engine.height;
        let margin: Canvas.Margin = engine.margin;

        // 信号强度是0到100之间，不需要再进行额外的换算了
        let y = d3.scale.linear()
            .domain([-100, 100])
            .range([height, 0])
            .nice();
        let x = d3.scale.linear()
            .domain(engine.mzRange)
            .range([0, width])
            .nice();
        let yAxis = d3.svg.axis()
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
            .data(engine.input.mzMatrix)
            .enter()
            .append("rect")
            .attr("class", (d: BioDeep.Models.mzInto) => `bar ${(d.into < 0) ? "negative" : "positive"}`)
            .attr("y", (d: BioDeep.Models.mzInto) => y(Math.max(0, d.into)))
            .attr("x", (d: BioDeep.Models.mzInto, i: number) => x(d.mz))
            .attr("height", (d: BioDeep.Models.mzInto) => Math.abs(y(d.into) - y(0)))
            .attr("width", engine.strokeWidth)
            .attr("cursor", "pointer")
            .on('mouseover', engine.tip.show)
            .on('mouseout', engine.tip.hide);

        //柱状图顶部参数
        let dataset = [];
        for (let i = 0; i < engine.input.mzMatrix.length; i++) {
            if (engine.input.mzMatrix[i].into > 30) {
                dataset.push(engine.input.mzMatrix[i]);
            }
        }
        engine.svg.selectAll(".MyText")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "MyText")
            .attr("x", (d: BioDeep.Models.mzInto, i: number) => x(d.mz))
            .attr("y", (d: BioDeep.Models.mzInto) => y(Math.max(0, d.into)))
            .attr("dy", -5)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", '10px')
            .text(d => d.mz.toFixed(2))
            ;

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

    export function legend(engine: d3Renderer, title: string = BioDeep.MSMSViewer.title): d3Renderer {
        let top = 30;
        let left = engine.width - 255;
        let rh = 60;
        let dw = 15;

        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
            var rw = 120;
            var fontSize: number = 14;
            var tx = -25;
        } else {
            var rw = 240;
            var fontSize: number = 20;
            var fontName: string = "Microsoft YaHei";
            var fontWeight: string = "normal";
            var font: string = `${fontWeight} ${fontSize}pt "${fontName}"`;
            var width: number = CanvasHelper.getTextWidth(title, font);
            var tx = (engine.width - width) / 2;
        }

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
        var d1 = Utils.stripHTML(engine.input.queryName);
        var d2 = Utils.stripHTML(engine.input.refName);

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

        var fontName: string = "Microsoft YaHei";
        var fontWeight: string = "normal";

        // 添加图表的标题
        engine.svg.append("text")
            .text(title)
            .attr("x", tx)
            .attr("y", -30)
            .style("font-weight", "normal")
            .style("font-size", `${fontSize}pt`);

        return engine;
    }
}
