/**
 * ## mzXML file reader and javascript data visualization tools
 *
 * - http://www.biodeep.cn
 *
 * > https://github.com/BioDeep/mzXML-web
*/
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        MSMSViewer.title = "BioDeep® MS/MS alignment viewer";
        function renderChart(containerId, api, id) {
            var url = sprintf(api, encodeURIComponent(id));
            $.getJSON(url, function (result) {
                if (result.code == 0) {
                    var data = MSMSViewer.Data.JSONParser((result.info));
                    var d3 = new MSMSViewer.d3Renderer(data);
                    d3.rendering(containerId);
                }
                else {
                    // 显示错误消息
                    throw result.info;
                }
            });
        }
        MSMSViewer.renderChart = renderChart;
        /**
         * 注释输出的svg id和数据源的api链接，然后返回渲染动作的函数指针
         *
         * @param svgDisplay 需要显示SVG图表的html的节点的id编号属性值
         * @param api 这个参数为url字符串模板，指示如何从服务器获取绘图数据，使用%s占位符标记资源编号
         *            api所返回来的数据应该是满足``JSONrespon``对象的格式要求的
         *
         * @returns ``(res_id: string) => void``
        */
        function register(svgDisplay, api) {
            return function (res_id) {
                BioDeep.MSMSViewer.renderChart(svgDisplay, api, res_id);
            };
        }
        MSMSViewer.register = register;
        /**
         * 将所给定的质谱图数据显示在给定的div之中
         *
         * @param divId 如果实际运行中使用节点的id编号属性字符串出现空值错误的话，
         *     可以将这个参数由id字符串变为实际的节点对象值
         * @param data 图表绘图数据，请注意，需要这个数据是一个镜像数据
        */
        function previews(divId, data, size) {
            if (size === void 0) { size = null; }
            new MSMSViewer.d3Renderer(data, size).rendering(divId);
        }
        MSMSViewer.previews = previews;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../build/linq.d.ts" />
/// <reference path="../../mzXML-web/dist/BioDeep_mzWeb.d.ts" />
// Demo test data
/**
 var data = {
     query: "CH<sub>3</sub>H<sub>2</sub>O",
     reference: "CO<sub>2</sub>NH<sub>4</sub>",
     align : [
         {mz: 10, int1:15,  int2: 20},
         {mz:125, int1:20,  int2: 30},
         {mz:200, int1:0,   int2:100},
         {mz:273, int1:0,   int2:100},
         {mz:300, int1:22,  int2:100},
         {mz:400, int1:100, int2: 18},
         {mz:600, int1:2,   int2:  6},
         {mz:800, int1:26,  int2: 18}
     ]};
 */
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var Data;
        (function (Data) {
            var mzData = /** @class */ (function () {
                function mzData(mz, align) {
                    var range = Array.isArray(mz) ?
                        data.NumericRange.Create(mz) : mz;
                    this.mzRange = [range.min, range.max];
                    this.mzMatrix = Array.isArray(align) ? align : align.ToArray();
                }
                mzData.prototype.tooltip = function (mz) {
                    var name = mz.into >= 0 ? this.queryName : this.refName;
                    var tipText = "m/z: " + mz.mz + " (\n                <strong>\n                    <span style=\"color:red;\">\n                        " + Math.abs(mz.into) + "%\n                    </span>\n                </strong>)";
                    var html = "\n                <p>\n                    " + name + "<br />\n                           <br />\n                    " + tipText + "\n                </p>";
                    return html;
                };
                mzData.prototype.csv = function () {
                    var meta = "#name=" + this.refName + ";metlin=" + this.metlin;
                    var header = "id,mz,into";
                    var table = "";
                    var i = 0;
                    this.mzMatrix.forEach(function (mz) {
                        if (mz.into > 0) {
                            table = table + (++i + "," + mz.mz + "," + mz.into + "\n");
                        }
                    });
                    return meta + "\n" + header + "\n" + table;
                };
                return mzData;
            }());
            Data.mzData = mzData;
            function JSONParser(data) {
                var mzRange = [];
                var mzInt = [];
                var mzX;
                var into;
                data.align
                    .forEach(function (x, i) {
                    mzRange.push(x.mz);
                    if (x.into1) {
                        mzX = parseFloat(new Number(x.mz).toFixed(4));
                        into = parseFloat(new Number(x.into1 * 100).toFixed(0));
                        mzInt.push(new BioDeep.Models.mzInto(i.toString(), mzX, into));
                    }
                    if (x.into2) {
                        // 参考是位于图表的下半部分，倒过来的
                        // 所以在这里会需要乘以-1来完成颠倒
                        mzX = parseFloat(new Number(x.mz).toFixed(4));
                        into = -1 * parseFloat(new Number(x.into2 * 100).toFixed(0));
                        mzInt.push(new BioDeep.Models.mzInto(i.toString(), mzX, into));
                    }
                });
                var align = new mzData(mzRange, mzInt);
                align.queryName = data.query;
                align.refName = data.reference;
                align.metlin = data.metlin;
                return align;
            }
            Data.JSONParser = JSONParser;
            /**
             * @param matrix 在这个函数之中会将这个二级碎片矩阵转换为一个镜像矩阵
            */
            function PreviewData(mz, rt, matrix, title) {
                if (title === void 0) { title = "Unknown"; }
                var mzSrc = From(matrix);
                var mzRange = data.NumericRange.Create(mzSrc.Select(function (mz) { return mz.mz; }));
                var intoMax = mzSrc.Select(function (mz) { return mz.into; }).Max();
                var mirror = mzSrc
                    .Select(function (mz) {
                    var into = mz.into / intoMax * 100;
                    var mir = new BioDeep.Models.mzInto(mz.id, mz.mz, -into);
                    mz.into = into;
                    return [mz, mir];
                })
                    .Unlist();
                var align = new mzData(mzRange, mirror);
                align.queryName = mz + "@" + rt;
                align.refName = title;
                align.metlin = "0";
                return align;
            }
            Data.PreviewData = PreviewData;
            var JSONrespon = /** @class */ (function () {
                function JSONrespon() {
                }
                return JSONrespon;
            }());
            Data.JSONrespon = JSONrespon;
            var align = /** @class */ (function () {
                function align() {
                }
                return align;
            }());
            Data.align = align;
        })(Data = MSMSViewer.Data || (MSMSViewer.Data = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var CSS = "\n\n/* \u6837\u54C1\u4E4B\u4E2D\u7684\u5316\u5408\u7269\u7684\u8272\u8C31\u6570\u636E\u7684\u989C\u8272 */\n.bar.positive {\n    fill: %s;\n}\n\n/* \u6807\u51C6\u54C1\u5E93\u4E4B\u4E2D\u7684\u5316\u5408\u7269\u7684\u8272\u8C31\u6570\u636E\u989C\u8272 */\n.bar.negative {\n    fill: %s;\n}\n\n/* \u5F53\u9F20\u6807\u79FB\u52A8\u5230\u67F1\u5B50\u4E0A\u9762\u7684\u65F6\u5019\u7684\u989C\u8272 */\n.bar:hover {\n    fill: %s;\n}\n\n.axis text {\n    font: 10px sans-serif;\n}\n\n.axis path,\n.axis line {\n    fill: none;\n    stroke: #000;\n    shape-rendering: crispEdges;\n}\n\n/* \u901A\u8FC7tooltip\u6765\u663E\u793A\u5177\u4F53\u7684m/z\u548C\u4FE1\u53F7\u5F3A\u5EA6\u7684\u4FE1\u606F */\n\n.d3-tip {\n    line-height: 1;\n    font-weight: normal;\n    padding: 12px;\n    background: rgba(0, 0, 0, 0.8);\n    color: #fff;\n    border-radius: 2px;\n}\n\n    /* Creates a small triangle extender for the tooltip */\n    .d3-tip:after {\n        box-sizing: border-box;\n        display: inline;\n        font-size: 10px;\n        width: 100%;\n        line-height: 1;\n        color: rgba(0, 0, 0, 0.8);\n        content: \"25BC\";\n        position: absolute;\n        text-align: center;\n    }\n\n    /* Style northward tooltips differently */\n    .d3-tip.n:after {\n        margin: -1px 0 0 0;\n        top: 100%;\n        left: 0;\n    }";
        /**
         * 如果图表上面的二级碎片信号柱子的颜色是黑色，则肯定是没有相关的样式信息
         * 需要在渲染图表之间调用这个函数进行样式信息的生成
         *
         * @param style 可以通过这个参数来修改图表的一些样式细节
        */
        function loadStyles(style) {
            if (style === void 0) { style = Styles.defaultStyle(); }
            $ts(function () {
                var head = $ts("&head");
                var styles = $ts('<style type="text/css">');
                if (!head) {
                    throw "Document node didn't contains <head>!";
                }
                else {
                    styles.textContent = sprintf(CSS, style.queryColor, style.refColor, style.highlightColor);
                }
                head.appendChild(styles);
            });
        }
        MSMSViewer.loadStyles = loadStyles;
        var Styles = /** @class */ (function () {
            function Styles() {
            }
            Styles.defaultStyle = function () {
                return {
                    queryColor: "steelblue",
                    refColor: "brown",
                    highlightColor: "orangered"
                };
            };
            return Styles;
        }());
        MSMSViewer.Styles = Styles;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var Utils;
    (function (Utils) {
        /**
         * 因为D3里面的text不支持html标签，所以需要使用这个函数将名称
         * 之中的html标记去除
         *
        */
        function stripHTML(html) {
            var tmp = $ts("div").display(html);
            // 创建节点然后赋值文本，最后取出内部的文本
            // 即可将html标记去除
            return tmp.textContent || tmp.innerText || "";
        }
        Utils.stripHTML = stripHTML;
        /**
         * Returns path data for a rectangle with rounded right corners.
         * The top-left corner is (x,y).
        */
        function rightRoundedRect(x, y, width, height, radius) {
            return "M" + x + "," + y
                + "h" + (width - radius)
                + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                + "v" + (height - 2 * radius)
                + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                + "h" + (radius - width)
                + "z";
        }
        Utils.rightRoundedRect = rightRoundedRect;
    })(Utils = BioDeep.Utils || (BioDeep.Utils = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var renderingWork;
        (function (renderingWork) {
            function tooltip(mz) {
                var tip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-10, 0])
                    .html(function (d) {
                    return mz.tooltip(d);
                });
                return tip;
            }
            renderingWork.tooltip = tooltip;
            /**
             * 初始化d3.js可视化引擎
             *
             * @param id 需要显示svg可视化结果的div的id属性值
            */
            function svg(data, id, svgId) {
                if (id === void 0) { id = null; }
                if (svgId === void 0) { svgId = "viewer-svg"; }
                var margin = data.margin;
                var svg = d3.select(id)
                    .append("svg")
                    .attr("id", svgId)
                    .attr("width", data.width + margin.left + margin.right)
                    .attr("height", data.height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
                return svg;
            }
            renderingWork.svg = svg;
            /**
             * 在这里进行具体的图表绘制操作
            */
            function chartting(engine) {
                var width = engine.width;
                var height = engine.height;
                var margin = engine.margin;
                // 信号强度是0到100之间，不需要再进行额外的换算了
                var y = d3.scale.linear()
                    .domain([-100, 100])
                    .range([height, 0])
                    .nice();
                var x = d3.scale.ordinal()
                    .domain(From(engine.current.mzRange)
                    .Select(function (x) { return x.toString(); })
                    .ToArray())
                    .rangeRoundBands([0, width], .2);
                var yAxis = d3.svg.axis()
                    .scale(y)
                    .tickFormat(function (n) { return Math.abs(n) + "%"; })
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
                    "y1": function (d) { return y(d); },
                    "y2": function (d) { return y(d); },
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
                    .attr("class", function (d) {
                    return "bar " + ((d.into < 0) ? "negative" : "positive");
                })
                    .attr("y", function (d) { return y(Math.max(0, d.into)); })
                    .attr("x", function (d, i) { return d.mz; })
                    .attr("height", function (d) { return Math.abs(y(d.into) - y(0)); })
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
            renderingWork.chartting = chartting;
            function Legend(engine) {
                var top = 30;
                var left = engine.width - 255;
                var rW = 240, rH = 60;
                var dW = 15;
                var legend = engine.svg.append("g")
                    .attr("class", "legend")
                    .attr("x", left)
                    .attr("y", top)
                    .attr("height", rH)
                    .attr("width", rW);
                // 外边框
                legend.append("rect")
                    .attr("x", left)
                    .attr("y", top)
                    .attr("rx", engine.radius)
                    .attr("ry", engine.radius)
                    .attr("height", rH)
                    .attr("width", rW)
                    .style("stroke", "gray")
                    .style("stroke-width", 2)
                    .style("border-radius", "2px")
                    .style("fill", "white");
                // 两个代谢物的legend和label
                var d1 = BioDeep.Utils.stripHTML(engine.current.queryName);
                var d2 = BioDeep.Utils.stripHTML(engine.current.refName);
                left += 15;
                top += 23;
                legend.append("rect")
                    .attr("x", left)
                    .attr("y", top - 13)
                    .attr("width", dW)
                    .attr("height", dW)
                    .style("fill", "steelblue");
                legend.append("text")
                    .attr("x", left + dW + 5)
                    .attr("y", top)
                    .text(d1);
                top += 25;
                legend.append("rect")
                    .attr("x", left)
                    .attr("y", top - 13)
                    .attr("width", dW)
                    .attr("height", dW)
                    .style("fill", "brown");
                legend.append("text")
                    .attr("x", left + dW + 5)
                    .attr("y", top)
                    .text(d2);
                var fontSize = 20;
                var fontName = "Microsoft YaHei";
                var fontWeight = "normal";
                // 添加图表的标题
                engine.svg.append("text")
                    .text(BioDeep.MSMSViewer.title)
                    .attr("x", function () {
                    var font = fontWeight + " " + fontSize + "pt \"" + fontName + "\"";
                    var width = CanvasHelper.getTextWidth(BioDeep.MSMSViewer.title, font);
                    // var w = this.getBBox().width + 10;
                    // return w;
                    return (engine.width - width) / 2;
                })
                    .attr("y", -40)
                    .style("font-weight", "normal")
                    .style("font-size", fontSize + "pt");
                return engine;
            }
            renderingWork.Legend = Legend;
        })(renderingWork = MSMSViewer.renderingWork || (MSMSViewer.renderingWork = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="./renderingWork.ts" />
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var d3Renderer = /** @class */ (function () {
            function d3Renderer(mz, canvasSize, canvasMargin, csvLink) {
                if (canvasSize === void 0) { canvasSize = [960, 600]; }
                if (canvasMargin === void 0) { canvasMargin = MSMSViewer.renderingWork.margin.default(); }
                if (csvLink === void 0) { csvLink = "matrix-csv"; }
                this.strokeWidth = 6;
                this.radius = 6;
                this.current = mz;
                this.margin = canvasMargin;
                this.width = canvasSize[0] - canvasMargin.left - canvasMargin.right;
                this.height = canvasSize[1] - canvasMargin.top - canvasMargin.bottom;
                this.registerDownloader(csvLink);
            }
            d3Renderer.prototype.registerDownloader = function (id) {
                var a = document.getElementById(id);
                var csv = this.current.csv();
                if (a && a != undefined) {
                    var blob = new Blob(["\ufeff", csv]);
                    var url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = this.current.refName + ".csv";
                    console.log(a.download);
                }
            };
            /**
             * 这个图标渲染函数的输入显示参数，同时支持节点的id编号属性和html节点对象
             *
             * @param div 需要显示图标的div区域，请注意，这个函数会将这个div节点内的所有的svg节点都清除掉
            */
            d3Renderer.prototype.rendering = function (div) {
                // 在进行新的图表绘制之前，需要清除所有的已经绘制的图表
                // 否则二者会叠加在一起
                d3.selectAll("svg").remove();
                this.tip = MSMSViewer.renderingWork.tooltip(this.current);
                this.svg = MSMSViewer.renderingWork.svg(this, div);
                // 因为在下面的chartting函数调用之中需要使用tip对象来绑定鼠标事件，
                // 所以在这里需要先于chartting函数将tip对象初始化完毕  
                console.log(this.tip);
                console.log(this.svg);
                this.svg.call(this.tip);
                MSMSViewer.renderingWork.chartting(this);
                MSMSViewer.renderingWork.Legend(this);
            };
            return d3Renderer;
        }());
        MSMSViewer.d3Renderer = d3Renderer;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var renderingWork;
        (function (renderingWork) {
            var margin = /** @class */ (function () {
                function margin(top, right, bottom, left) {
                    if (top === void 0) { top = 70; }
                    if (right === void 0) { right = 10; }
                    if (bottom === void 0) { bottom = 10; }
                    if (left === void 0) { left = 50; }
                    this.top = top;
                    this.right = right;
                    this.bottom = bottom;
                    this.left = left;
                }
                margin.default = function () {
                    return new margin();
                };
                margin.prototype.toString = function () {
                    return "[" + this.top + ", " + this.right + ", " + this.bottom + ", " + this.left + "]";
                };
                return margin;
            }());
            renderingWork.margin = margin;
        })(renderingWork = MSMSViewer.renderingWork || (MSMSViewer.renderingWork = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=biodeepMSMS.Viewer.js.map