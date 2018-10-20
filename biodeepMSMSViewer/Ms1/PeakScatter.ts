/// <reference path="../../dist/BioDeep_mzWeb.d.ts" />

namespace BioDeep.MSMSViewer.PeakScatter {

    export class PlotRenderer {

        public margin: Canvas.Margin;
        public size: Canvas.Size;

        private svg: d3.Selection<any>;
        private tooltip: d3.Selection<any>;

        public constructor(
            size: Canvas.Size,
            margin: Canvas.Margin = <Canvas.Margin>{
                top: 20, right: 20, bottom: 30, left: 40
            }) {

            this.margin = Canvas.Margin.Object(margin);
            this.size = <Canvas.Size>{
                width: size.width - this.margin.horizontal,
                height: size.height - this.margin.vertical
            };

            // add the graph canvas to the body of the webpage
            this.svg = d3.select("body").append("svg")
                .attr("width", this.size.width + margin.left + margin.right)
                .attr("height", this.size.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // add the tooltip area to the webpage
            this.tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
        }

        private xAxis() {
            var xScale = d3.scale.linear().range([0, this.size.width]),
                xMap = (d: Models.IonPeak) => xScale(d.rt),
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            return {
                scale: xScale,
                map: xMap,
                axis: xAxis,
                range: (peaks: Models.IonPeak[]) => data.NumericRange.Create(From(peaks).Select(d => d.rt)).range
            }
        }

        private yAxis() {
            var yScale = d3.scale.linear().range([this.size.height, 0]),
                yMap = (d: Models.IonPeak) => yScale(d.mz),
                yAxis = d3.svg.axis().scale(yScale).orient("left");

            return {
                scale: yScale,
                map: yMap,
                axis: yAxis,
                range: (peaks: Models.IonPeak[]) => data.NumericRange.Create(From(peaks).Select(d => d.mz)).range
            }
        }

        public render(data: Models.IonPeak[]): void {
            var x = this.xAxis(), y = this.yAxis();
            var cValue = function (d) { return d.Manufacturer; },
                color = d3.scale.category10();
            var plot: PlotRenderer = this;

            // don't want dots overlapping axis, so add in buffer to data domain
            x.scale.domain(x.range(data)).nice();
            y.scale.domain(y.range(data)).nice();

            // x-axis
            plot.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${plot.size.height})`)
                .call(x.axis)
                .append("text")
                .attr("class", "label")
                .attr("x", plot.size.width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("rt in seconds");

            // y-axis
            plot.svg.append("g")
                .attr("class", "y axis")
                .call(y.axis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("m/z");

            // draw dots
            plot.svg.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", x.map)
                .attr("cy", y.map)
                .style("fill", d => color(cValue(d)))
                .on("mouseover", function (d) {
                    plot.tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    plot.tooltip
                        .html(`${d.name} ${d.mz}@${d.rt}`)
                        .style("left", ((<any>d3.event).pageX + 5) + "px")
                        .style("top", ((<any>d3.event).pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    plot.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // draw legend
            var legend = plot.svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", plot.size.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            // draw legend text
            legend.append("text")
                .attr("x", plot.size.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(d => d);
        }
    }
}