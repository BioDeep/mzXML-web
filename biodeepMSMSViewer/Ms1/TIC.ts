namespace BioDeep.MSMSViewer {

    /**
     * 一级母离子的``[rt, intensity]``峰面积图
    */
    export class TICplot extends SvgChart {

        public data: BioDeep.Models.ChromatogramTick[];
        public ions: Dictionary<any>;

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
                .domain([d3.min(this.data, t => t.rt), d3.max(this.data, t => t.rt)])
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
                .orient("left")
                // 因为intensity是可以非常大的值
                // 所以在这里必须要用科学计数法
                .tickFormat(d3.format(".1e"));
        }

        public constructor(size: number[] = [750, 500], public onClick: (ion: any) => void) {
            super(size, new Canvas.Margin(10, 10, 20, 50));
            //super(size, new Canvas.Margin(20, 20, 30, 100));

            // this.tip = BioDeep.MSMSViewer.mzrtTip();
        }

        plot(canvas: string | HTMLElement, ticks: IEnumerator<BioDeep.IO.mgf>) {
            BioDeep.MSMSViewer.clear(canvas);

            this.data = BioDeep.Models.TIC(<IEnumerator<BioDeep.IO.mgf>>ticks).ToArray();
            this.chart(canvas);
            // this.tip.hide();
            this.bindEvents($ts(this.data));
        }

        plotData(canvas: string | HTMLElement, rt: number[], intensity: number[], tags: any[]) {
            BioDeep.MSMSViewer.clear(canvas);

            this.data = BioDeep.Models.Chromatogram(rt, intensity, tags).ToArray();
            this.chart(canvas);
            // this.tip.hide();
            this.bindEvents($ts(this.data));
        }

        private bindEvents(ticks: IEnumerator<BioDeep.Models.ChromatogramTick>) {
            let mzrt = $ts.select(".mzrt");
            let vm = this;

            this.ions = ticks.ToDictionary(x => TICplot.uniqueId(x), x => x.raw);

            mzrt.onClick(x => {
                let ref = x.getAttribute("unique");
                let ion: any = vm.ions.Item(ref);

                vm.onClick(ion);
            });
        }

        private static uniqueId(tick: Models.ChromatogramTick): string {
            return `${tick.rt} (${tick.intensity})`;
        }

        private chart(canvas: string | HTMLElement) {
            const margin = this.margin;
            const svg = d3.select(<any>canvas)
                .append("svg")
                .attr("width", this.width + margin.left + margin.right)
                .attr("height", this.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            // .call(<any>this.tip);

            svg.append("path")
                .datum(this.data)
                .attr("class", "area")
                .attr("fill", "#007bff")
                .attr("stroke", "steelblue")
                .attr("stroke-width", "3")
                .attr("fill-opacity", "0.7")
                .attr("d", <any>this.area);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .attr("width", 2)
                .call(this.xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("width", 2)
                .call(this.yAxis);

            let x = this.x;
            let y = this.y;

            svg.selectAll("mzrt-dot")
                .data(this.data)
                .enter()
                .append("circle")
                .attr("class", "mzrt pointer")
                .attr("fill", "blue")
                .attr("stroke", "none")
                .attr("unique", d => TICplot.uniqueId(d))
                .attr("tooltip", d => TICplot.uniqueId(d))
                .attr("cx", d => x(d.rt))
                .attr("cy", d => y(d.intensity))
                .attr("r", 3)
            // .on('mouseover', this.tip.show)
            // .on('mouseout', this.tip.hide);

            return svg.node();
        }
    }
}