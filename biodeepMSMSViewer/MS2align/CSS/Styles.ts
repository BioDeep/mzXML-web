namespace BioDeep.MSMSViewer {

    const CSS: string = `

/* 样品之中的化合物的色谱数据的颜色 */
.bar.positive {
    fill: %s;
}

/* 标准品库之中的化合物的色谱数据颜色 */
.bar.negative {
    fill: %s;
}

/* 当鼠标移动到柱子上面的时候的颜色 */
.bar:hover {
    fill: %s;
}

.axis text {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

/* 通过tooltip来显示具体的m/z和信号强度的信息 */

.d3-tip {
    line-height: 1;
    font-weight: normal;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 2px;
}

    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
        box-sizing: border-box;
        display: inline;
        font-size: 10px;
        width: 100%;
        line-height: 1;
        color: rgba(0, 0, 0, 0.8);
        content: "\25BC";
        position: absolute;
        text-align: center;
    }

    /* Style northward tooltips differently */
    .d3-tip.n:after {
        margin: -1px 0 0 0;
        top: 100%;
        left: 0;
    }`;

    /**
     * 如果图表上面的二级碎片信号柱子的颜色是黑色，则肯定是没有相关的样式信息
     * 需要在渲染图表之间调用这个函数进行样式信息的生成
     * 
     * @param style 可以通过这个参数来修改图表的一些样式细节
    */
    export function loadStyles(style: Styles = Styles.defaultStyle()) {
        $ts(function () {
            var head: HTMLElement = $ts("&head");
            var styles: HTMLElement = $ts('<style type="text/css">');

            if (!head) {
                throw "Document node didn't contains <head>!";
            } else {
                styles.textContent = sprintf(
                    CSS, style.queryColor, style.refColor, style.highlightColor
                );
            }

            head.appendChild(styles);
        });
    }

    export class Styles {

        public queryColor: string;
        public refColor: string;
        public highlightColor: string;

        public static defaultStyle(): Styles {
            return <Styles>{
                queryColor: "steelblue",
                refColor: "brown",
                highlightColor: "orangered"
            };
        }
    }
}