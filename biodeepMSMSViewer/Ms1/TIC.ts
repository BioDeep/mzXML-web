namespace BioDeep.MSMSViewer {

    /**
     * 一级母离子的``[rt, intensity]``峰面积图
    */
    export class TICplot extends SvgChart {

        public data: BioDeep.Models.ChromatogramTick[];

        public get area() {
            let x = this.x;
            let y = this.y;

            return d3.svg.area()
                .x(d => x(d["rt"]))
                .y0(y(0))
                .y1(d => y(d["intensity"]));
        }

        public get x() {
            return d3.scale.linear()
                .domain([0, d3.max(this.data, t => t.rt)])
                .range([0, this.width]);
        }

        public get y() {
            return d3.scale.linear()
                .domain([0, d3.max(this.data, t => t.intensity)])
                .range([this.height, 0]);
        }

        public get xAxis() {
            return d3.svg.axis()
                .scale(this.x)
                .orient("bottom");
        }

        public get yAxis() {
            return d3.svg.axis()
                .scale(this.y)
                .orient("left");
        }

        plot(canvas: string | HTMLElement, ticks: IEnumerator<BioDeep.Models.ChromatogramTick> | IEnumerator<BioDeep.IO.mgf>) {
            if (ticks.ElementType.class == "mgf") {
                ticks = BioDeep.Models.TIC(<IEnumerator<BioDeep.IO.mgf>>ticks);
            }

            BioDeep.MSMSViewer.clear(canvas);

            this.data = (<IEnumerator<BioDeep.Models.ChromatogramTick>>ticks).ToArray();
            this.chart(canvas);
        }

        private chart(canvas: string | HTMLElement) {
            const svg = d3.select(<any>canvas)
                .append("svg")
                .attr("viewBox", `0 0 ${this.width} ${this.height}`);

            svg.append("path")
                .datum(this.data)
                .attr("class", "area")
                .attr("fill", "steelblue")
                .attr("d", <any>this.area);

            svg.append("g")
                .attr("class", "x axis")
                .call(this.xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(this.yAxis);

            return svg.node();
        }
    }
}