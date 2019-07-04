namespace BioDeep.MSMSViewer {

    /**
     * 一级母离子的``[rt, intensity]``峰面积图
    */
    export class TICplot extends SvgChart {

        public get area() {
            return d3.area()
                .x(d => x(d.date))
                .y0(y(0))
                .y1(d => y(d.value));
        }

        plot(canvas: string | HTMLElement, ticks: IEnumerator<BioDeep.Models.ChromatogramTick> | IEnumerator<BioDeep.IO.mgf>) {
            if (ticks.ElementType.class == "mgf") {
                ticks = BioDeep.Models.TIC(<IEnumerator<BioDeep.IO.mgf>>ticks);
            }

            BioDeep.MSMSViewer.clear(canvas);


        }

        private chart(canvas: string | HTMLElement) {
            const svg = d3.select(<any>canvas)
                .append("svg")
                .attr("viewBox", `0 0 ${this.width} ${this.height}`);

            svg.append("path")
                .datum(data)
                .attr("fill", "steelblue")
                .attr("d", area);

            svg.append("g")
                .call(xAxis);

            svg.append("g")
                .call(yAxis);

            return svg.node();
        }
    }
}