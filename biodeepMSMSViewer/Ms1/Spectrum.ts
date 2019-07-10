namespace BioDeep.MSMSViewer {

    export class Spectrum extends SvgChart {

        public constructor(
            size: Canvas.Size | number[] = [800, 500],
            margin: Canvas.Margin = renderingWork.defaultMargin()) {

            super(size, margin);
        }

        private x(ions: IEnumerator<Models.mzInto>) {
            let mz = ions.Select(m => m.mz);

            return d3.scale.linear()
                .domain([mz.Min(), mz.Max()])
                .range([0, this.width]);
        }

        private y(ions: IEnumerator<Models.mzInto>) {
            let into = ions.Select(m => m.into);

            return d3.scale.linear()
                .domain([0, into.Max()])
                .range([this.height, 0]);
        }

        public xAxis(ions: IEnumerator<Models.mzInto>) {
            return d3.svg.axis()
                .scale(this.x(ions))
                .orient("bottom");
        }

        public yAxis(ions: IEnumerator<Models.mzInto>) {
            return d3.svg.axis()
                .scale(this.y(ions))
                .orient("left")
                // 因为intensity是可以非常大的值
                // 所以在这里必须要用科学计数法
                .tickFormat(d3.format(".1e"));
        }

        public renderChartFromMgf(id: string, ions: IEnumerator<IO.mgf>, levels: number) {
            this.renderChart(id, Models.SpectrumMatrix(ions, levels))
        }

        public renderChart(id: string, ions: IEnumerator<Models.mzInto>) {
            let padding = this.margin;

            BioDeep.MSMSViewer.clear(id);

            let svg = d3.select(id)
                .append('svg')
                .attr("width", this.width + padding.left + padding.right)
                .attr("height", this.height + padding.top + padding.bottom)
                .append("g")
                // 给这个分组加上main类
                .attr("class", 'main')
                // 设置该分组的transform属性
                .attr('transform', `translate(${padding.top}, ${padding.left})`)
                .attr("viewBox", `0 0 ${this.width} ${this.height}`);

            // 添加坐标轴
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(this.xAxis(ions));

            svg.append("g")
                .attr("class", "y axis")
                .call(this.yAxis(ions));

            let x = this.x(ions);
            let y = this.y(ions);
            let height = this.height;
            let maxInto = ions.Select(m => m.into).Max();

            // 为了减少内存占用
            // 在这里只会绘制出into大于5%的碎片
            // 请注意，低丰度碎片的删除应该在计算坐标轴缩放之后
            let simpleIons = ions.Where(i => (i.into / maxInto) >= 0.01);

            svg.selectAll('.bar')
                .data(simpleIons.ToArray(false))
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.mz))
                .attr('y', d => y(d.into))
                .attr('width', 1)
                .attr('height', function (d, i) {
                    return height - y(d.into);
                })
                .attr('fill', "black");

            svg.selectAll(".text")
                .data(simpleIons.ToArray(false))
                .enter()
                .append('text')
                .attr('class', 'text')
                .attr('x', d => x(d.mz) - 10)
                .attr('y', d => y(d.into))
                .attr('fill', "black")
                .text(function (d) {
                    if (d.into / maxInto >= 0.9) {
                        return Strings.round(d.mz, 4).toString();
                    } else {
                        return null;
                    }
                });
        }
    }
}