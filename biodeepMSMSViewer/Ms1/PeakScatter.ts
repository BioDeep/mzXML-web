/// <reference path="../../../mzXML-web/dist/BioDeep_mzWeb.d.ts" />

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
            return {
                xValue = (m: BioDeep.IO..)
            }
        }

        public Axis(x: Models.IonPeak, y: object) {
            var xValue = d => d.Calories;
            var xScale = d3.scale.linear().range([0, this.size.width]);
            var xMap = d => xScale(xValue(d));
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            var yValue = d => d["key"];
            var yScale = d3.scale.linear().range([this.size.height, 0]);
            var yMap = d => yScale(yValue(d));
            var yAxis = d3.svg.axis().scale(yScale).orient("left");

            var cValue = function (d) { return d.Manufacturer; },
                color = d3.scale.category10();

            var plot: PlotRenderer = this;

            // load data
            d3.csv("cereal.csv", function (error, data) {

                // change string (from CSV) into number format
                data.forEach(function (d) {
                    d.Calories = +d.Calories;
                    d["Protein (g)"] = +d["Protein (g)"];
                    //    console.log(d);
                });

                // don't want dots overlapping axis, so add in buffer to data domain
                xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
                yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

                // x-axis
                plot.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", `translate(0,${plot.size.height})`)
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", plot.size.width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Calories");

                // y-axis
                plot.svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Protein (g)");

                // draw dots
                plot.svg.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 3.5)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .style("fill", d => color(cValue(d)))
                    .on("mouseover", function (d) {
                        plot.tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        plot.tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                            + ", " + yValue(d) + ")")
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
            });

        }
    }
}