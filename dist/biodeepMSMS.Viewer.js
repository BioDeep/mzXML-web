var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../build/linq.d.ts" />
/// <reference path="../dist/BioDeep_mzWeb.d.ts" />
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        /**
         * Clear all of the svg elements in target html element
         *
         * @param canvas id, class, or a html element object instance
        */
        function clear(canvas) {
            if (typeof canvas == "string") {
                if (canvas.charAt(0) == "#" || canvas.charAt(0) == ".") {
                    // do nothing
                }
                else {
                    // by default is id
                    canvas = "#" + canvas;
                }
            }
            else {
                // get id
                canvas = "#" + canvas.id;
            }
            // 2018-10-18
            // 会需要使用选择器来进行正确的选择svg元素
            // 否则会出现意外的将其他的svg节点清除的bug
            // 在进行新的图表绘制之前，需要清除所有的已经绘制的图表
            // 否则二者会叠加在一起
            d3.selectAll(canvas + ">svg").remove();
        }
        MSMSViewer.clear = clear;
        /**
         * 初始化d3.js可视化引擎
         *
         * @param id 需要显示svg可视化结果的div的id属性值
        */
        function svg(engine, id, svgId) {
            if (id === void 0) { id = null; }
            if (svgId === void 0) { svgId = "viewer-svg"; }
            var margin = engine.margin;
            var svg = d3.select(id)
                .append("svg")
                .attr("id", svgId)
                .attr("width", engine.width + margin.left + margin.right)
                .attr("height", engine.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
            return svg;
        }
        MSMSViewer.svg = svg;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        function tooltip(mz) {
            var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function (d) {
                return mz.tooltip(d);
            });
            return tip;
        }
        MSMSViewer.tooltip = tooltip;
        function mzrtTip() {
            var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function (d) {
                return d.precursor_mass + "@" + d.rt;
            });
            return tip;
        }
        MSMSViewer.mzrtTip = mzrtTip;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var PeakScatter;
        (function (PeakScatter) {
            /**
             * 一级母离子的``[mz, rt]``散点图
            */
            var PlotRenderer = /** @class */ (function () {
                function PlotRenderer(size, margin) {
                    if (size === void 0) { size = [960, 600]; }
                    if (margin === void 0) { margin = {
                        top: 20, right: 20, bottom: 30, left: 40
                    }; }
                    if (!Array.isArray(size)) {
                        size = [size.width, size.height];
                    }
                    this.margin = Canvas.Margin.Object(margin);
                    this.size = {
                        width: size[0] - this.margin.horizontal,
                        height: size[1] - this.margin.vertical
                    };
                    var w = this.size.width + margin.left + margin.right;
                    var h = this.size.height + margin.top + margin.bottom;
                    // add the graph canvas to the body of the webpage
                    this.svg = d3.select("body")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    // add the tooltip area to the webpage
                    this.tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
                }
                PlotRenderer.prototype.xAxis = function () {
                    var xScale = d3.scale.linear().range([0, this.size.width]), xMap = function (d) { return xScale(d.rt); }, xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                    return {
                        scale: xScale,
                        map: xMap,
                        axis: xAxis,
                        range: function (peaks) { return data.NumericRange.Create(From(peaks).Select(function (d) { return d.rt; })).range; }
                    };
                };
                PlotRenderer.prototype.yAxis = function () {
                    var yScale = d3.scale.linear().range([this.size.height, 0]), yMap = function (d) { return yScale(d.mz); }, yAxis = d3.svg.axis().scale(yScale).orient("left");
                    return {
                        scale: yScale,
                        map: yMap,
                        axis: yAxis,
                        range: function (peaks) { return data.NumericRange.Create(From(peaks).Select(function (d) { return d.mz; })).range; }
                    };
                };
                PlotRenderer.prototype.render = function (data, peakClick) {
                    if (peakClick === void 0) { peakClick = DoNothing; }
                    var x = this.xAxis(), y = this.yAxis();
                    var intoRanges = $ts.doubleRange($ts(data).Select(function (d) { return Math.log(d.intensity); }));
                    var colorIndex = function (d) { return intoRanges.ScaleMapping(Math.log(d.intensity), PlotRenderer.indexRange); };
                    var color = d3.scale.linear();
                    var plot = this;
                    // don't want dots overlapping axis, so add in buffer to data domain
                    x.scale.domain(x.range(data)).nice();
                    y.scale.domain(y.range(data)).nice();
                    // x-axis
                    plot.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + plot.size.height + ")")
                        .call(x.axis)
                        .append("text")
                        .attr("class", "label")
                        .attr("x", plot.size.width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .text("rt (sec)");
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
                        .attr("r", function (d) { return Math.log(d.intensity + 1); })
                        .attr("cx", x.map)
                        .attr("cy", y.map)
                        .style("fill", function (d) { return color(colorIndex(d)); })
                        .on("mouseover", function (d) {
                        plot.tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        plot.tooltip
                            .html(d.name + " " + Math.round(d.mz) + "@" + Math.round(d.rt))
                            .style("left", (d3.event.pageX + 5) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                        .on("mouseout", function (d) {
                        plot.tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                        .on("click", function (d) { return peakClick(d); });
                    // draw legend
                    var legend = plot.svg.selectAll(".legend")
                        .data(color.domain())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
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
                        .text(function (d) { return d; });
                };
                PlotRenderer.indexRange = $ts.doubleRange([0, 25]);
                return PlotRenderer;
            }());
            PeakScatter.PlotRenderer = PlotRenderer;
        })(PeakScatter = MSMSViewer.PeakScatter || (MSMSViewer.PeakScatter = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        /**
         * 一级母离子的``[rt, intensity]``峰面积图
        */
        var TICplot = /** @class */ (function (_super) {
            __extends(TICplot, _super);
            function TICplot(onClick) {
                var _this = _super.call(this, [850, 600], new Canvas.Margin(20, 20, 30, 100)) || this;
                _this.onClick = onClick;
                return _this;
                // this.tip = BioDeep.MSMSViewer.mzrtTip();
            }
            Object.defineProperty(TICplot.prototype, "area", {
                // public tip: d3.Tooltip;
                get: function () {
                    var x = this.x;
                    var y = this.y;
                    return d3.svg.area()
                        .x(function (d) { return x(d["rt"]); })
                        .y0(y(0))
                        .y1(function (d) { return y(d["intensity"]); });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TICplot.prototype, "x", {
                get: function () {
                    return d3.scale.linear()
                        .domain([d3.min(this.data, function (t) { return t.rt; }), d3.max(this.data, function (t) { return t.rt; })])
                        .range([0, this.width]);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TICplot.prototype, "y", {
                get: function () {
                    return d3.scale.linear()
                        .domain([0, d3.max(this.data, function (t) { return t.intensity; })])
                        .range([this.height, 0]);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TICplot.prototype, "xAxis", {
                get: function () {
                    return d3.svg.axis()
                        .scale(this.x)
                        .orient("bottom");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TICplot.prototype, "yAxis", {
                get: function () {
                    return d3.svg.axis()
                        .scale(this.y)
                        .orient("left")
                        // 因为intensity是可以非常大的值
                        // 所以在这里必须要用科学计数法
                        .tickFormat(d3.format(".1e"));
                },
                enumerable: true,
                configurable: true
            });
            TICplot.prototype.plot = function (canvas, ticks) {
                BioDeep.MSMSViewer.clear(canvas);
                this.data = BioDeep.Models.TIC(ticks).ToArray();
                this.chart(canvas);
                // this.tip.hide();
                this.bindEvents($ts(this.data));
            };
            TICplot.prototype.bindEvents = function (ticks) {
                var mzrt = $ts.select(".mzrt");
                var ions = ticks.ToDictionary(function (x) { return TICplot.uniqueId(x); }, function (x) { return x.raw; });
                var vm = this;
                mzrt.onClick(function (x) {
                    var ref = x.getAttribute("unique");
                    var ion = ions.Item(ref);
                    vm.onClick(ion);
                });
            };
            TICplot.uniqueId = function (tick) {
                return tick.rt + " (" + tick.intensity + ")";
            };
            TICplot.prototype.chart = function (canvas) {
                var margin = this.margin;
                var svg = d3.select(canvas)
                    .append("svg")
                    .attr("width", this.width + margin.left + margin.right)
                    .attr("height", this.height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("viewBox", "0 0 " + this.width + " " + this.height);
                // .call(<any>this.tip);
                svg.append("path")
                    .datum(this.data)
                    .attr("class", "area")
                    .attr("fill", "steelblue")
                    .attr("d", this.area);
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(this.xAxis);
                svg.append("g")
                    .attr("class", "y axis")
                    .call(this.yAxis);
                var x = this.x;
                var y = this.y;
                svg.selectAll("mzrt-dot")
                    .data(this.data)
                    .enter()
                    .append("circle")
                    .attr("class", "mzrt")
                    .attr("fill", "red")
                    .attr("stroke", "none")
                    .attr("unique", function (d) { return TICplot.uniqueId(d); })
                    .attr("cx", function (d) { return x(d.rt); })
                    .attr("cy", function (d) { return y(d.intensity); })
                    .attr("r", 3);
                // .on('mouseover', this.tip.show)
                // .on('mouseout', this.tip.hide);
                return svg.node();
            };
            return TICplot;
        }(SvgChart));
        MSMSViewer.TICplot = TICplot;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
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
        function renderChart(containerId, api, id, decoder) {
            if (decoder === void 0) { decoder = null; }
            var url = sprintf(api, encodeURIComponent(id));
            var chart = $ts(containerId);
            var size = SvgUtils.getSize(chart, [960, 600]);
            $.getJSON(url, function (result) {
                if (result.code == 0) {
                    var data = MSMSViewer.Data.JSONParser((result.info), decoder);
                    var d3 = new MSMSViewer.d3Renderer(data, size);
                    d3.rendering(containerId);
                }
                else {
                    // 显示错误消息
                    throw result.info + " " + url;
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
        function register(svgDisplay, api, decoder) {
            if (decoder === void 0) { decoder = null; }
            return function (res_id) {
                BioDeep.MSMSViewer.renderChart(svgDisplay, api, res_id, decoder);
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
            if (size === void 0) { size = [900, 600]; }
            if (data instanceof BioDeep.IO.mgf) {
                new MSMSViewer.d3Renderer(parseIon(data), size).rendering(divId);
            }
            else {
                new MSMSViewer.d3Renderer(data, size).rendering(divId);
            }
        }
        MSMSViewer.previews = previews;
        function parseIon(ion) {
            var mzRange = $ts.doubleRange(ion.Select(function (m) { return m.mz; }));
            var mirror = [];
            var uid = Strings.round(ion.precursor_mass, 2) + "@" + Math.round(ion.rt);
            for (var _i = 0, _a = ion.ToArray(); _i < _a.length; _i++) {
                var m = _a[_i];
                mirror.push(m);
                mirror.push({
                    mz: m.mz,
                    into: -m.into,
                    id: m.id + "mirror"
                });
            }
            return new MSMSViewer.Data.mzData(mzRange, mirror).info(uid, ion.title, uid);
        }
        MSMSViewer.parseIon = parseIon;
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
            var tmp = $ts("<div>").display(html);
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
    var MSMSViewer;
    (function (MSMSViewer) {
        var Data;
        (function (Data) {
            function JSONParser(data, decoder) {
                if (decoder === void 0) { decoder = null; }
                var mzInt = [];
                if (typeof data.align == "string") {
                    if (isNullOrUndefined(decoder)) {
                        throw "No SVG decoder was provided!";
                    }
                    else {
                        mzInt = decoder(data.align);
                    }
                }
                else {
                    mzInt = parseMirror(data.align);
                }
                var mzRange = From(mzInt).Select(function (x) { return x.mz; }).ToArray();
                var align = new Data.mzData(mzRange, mzInt);
                align.queryName = data.query;
                align.refName = data.reference;
                align.xref = data.xref;
                return align;
            }
            Data.JSONParser = JSONParser;
            function parseMirror(aligns) {
                return From(aligns)
                    .Select(function (x, i) {
                    var a;
                    var b;
                    if (x.into1) {
                        var mzX = parseFloat(new Number(x.mz).toFixed(4));
                        var into = parseFloat(new Number(x.into1 * 100).toFixed(0));
                        a = new BioDeep.Models.mzInto(i.toString(), mzX, into);
                    }
                    if (x.into2) {
                        // 参考是位于图表的下半部分，倒过来的
                        // 所以在这里会需要乘以-1来完成颠倒
                        var mzX = parseFloat(new Number(x.mz).toFixed(4));
                        var into = -1 * parseFloat(new Number(x.into2 * 100).toFixed(0));
                        b = new BioDeep.Models.mzInto(i.toString(), mzX, into);
                    }
                    return [a, b];
                })
                    .Unlist(function (x) { return x; })
                    .ToArray();
            }
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
                var align = new Data.mzData(mzRange, mirror);
                align.queryName = mz + "@" + rt;
                align.refName = title;
                align.xref = "0";
                return align;
            }
            Data.PreviewData = PreviewData;
        })(Data = MSMSViewer.Data || (MSMSViewer.Data = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var Data;
        (function (Data) {
            /**
             * Demo test data
             *
             * ```js
             * var data = {
             *    query: "CH<sub>3</sub>H<sub>2</sub>O",
             *    reference: "CO<sub>2</sub>NH<sub>4</sub>",
             *    align : [
             *        {mz: 10, int1:15,  int2: 20},
             *        {mz:125, int1:20,  int2: 30},
             *        {mz:200, int1:0,   int2:100},
             *        {mz:273, int1:0,   int2:100},
             *        {mz:300, int1:22,  int2:100},
             *        {mz:400, int1:100, int2: 18},
             *        {mz:600, int1:2,   int2:  6},
             *        {mz:800, int1:26,  int2: 18}
             *    ]};
             * ```
            */
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
        var Data;
        (function (Data) {
            var mzData = /** @class */ (function () {
                function mzData(mz, align) {
                    var range = Array.isArray(mz) ?
                        data.NumericRange.Create(mz) : mz;
                    this.mzRange = [range.min, range.max];
                    this.mzMatrix = Array.isArray(align) ? align : align.ToArray();
                }
                /**
                 * Set information
                */
                mzData.prototype.info = function (queryName, refName, xref) {
                    this.queryName = queryName;
                    this.refName = refName;
                    this.xref = xref;
                    return this;
                };
                mzData.prototype.trim = function (intoCutoff) {
                    if (intoCutoff === void 0) { intoCutoff = 5; }
                    var src = new IEnumerator(this.mzMatrix);
                    var max = Math.abs(src.Max(function (m) { return m.into; }).into);
                    var trimmedData = From(this.mzMatrix).Where(function (m) { return Math.abs(m.into / max * 100) >= intoCutoff; });
                    var newRange = data.NumericRange.Create(trimmedData.Select(function (m) { return m.mz; }));
                    var newMatrix = new mzData(newRange, trimmedData);
                    newMatrix.queryName = this.queryName;
                    newMatrix.refName = this.refName;
                    newMatrix.xref = this.xref;
                    return newMatrix;
                };
                /**
                 * 将响应强度的数据归一化到``[0, 100]``的区间范围内，然后返回当前的数据实例自身
                */
                mzData.prototype.normalize = function () {
                    var src = new IEnumerator(this.mzMatrix);
                    var max = Math.abs(src.Max(function (m) { return m.into; }).into);
                    this.mzMatrix.forEach(function (m) { return m.into = m.into / max * 100; });
                    return this;
                };
                mzData.prototype.tooltip = function (mz) {
                    var name = mz.into >= 0 ? this.queryName : this.refName;
                    var tipText = "m/z: " + mz.mz.toFixed(4) + " (\n                <strong>\n                    <span style=\"color:red;\">\n                        " + Math.floor(Math.abs(mz.into)) + "%\n                    </span>\n                </strong>)";
                    var html = "\n                <p>\n                    " + name + "<br />\n                           <br />\n                    " + tipText + "\n                </p>";
                    return html;
                };
                mzData.prototype.csv = function () {
                    var meta = "#name=" + this.refName + ";xref=" + this.xref;
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
        })(Data = MSMSViewer.Data || (MSMSViewer.Data = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var renderingWork;
        (function (renderingWork) {
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
                var x = d3.scale.linear()
                    .domain(engine.mzRange)
                    .range([0, width])
                    .nice();
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
                    .data(engine.input.mzMatrix)
                    .enter()
                    .append("rect")
                    .attr("class", function (d) {
                    return "bar " + ((d.into < 0) ? "negative" : "positive");
                })
                    .attr("y", function (d) { return y(Math.max(0, d.into)); })
                    .attr("x", function (d, i) { return x(d.mz); })
                    .attr("height", function (d) { return Math.abs(y(d.into) - y(0)); })
                    .attr("width", engine.strokeWidth)
                    .attr("cursor", "pointer")
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
                var d1 = BioDeep.Utils.stripHTML(engine.input.queryName);
                var d2 = BioDeep.Utils.stripHTML(engine.input.refName);
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
                top += 25;
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
/// <reference path="../../../../build/svg.d.ts" />
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var d3Renderer = /** @class */ (function (_super) {
            __extends(d3Renderer, _super);
            function d3Renderer(mz, size, margin, csvLink) {
                if (size === void 0) { size = [960, 600]; }
                if (margin === void 0) { margin = MSMSViewer.renderingWork.defaultMargin(); }
                if (csvLink === void 0) { csvLink = "matrix-csv"; }
                var _this = _super.call(this, size, margin) || this;
                _this.strokeWidth = 6;
                _this.radius = 6;
                _this.current = mz.trim().normalize();
                _this.margin = margin;
                _this.registerDownloader(csvLink);
                return _this;
            }
            Object.defineProperty(d3Renderer.prototype, "mzRange", {
                get: function () {
                    var range = this.current.mzRange;
                    var length = range[1] - range[0];
                    // 20190705 在这里需要将范围放宽一些
                    // 这样子可以让图尽量居中
                    var minMz = range[0] - length * 0.2;
                    var maxMz = range[1] + length * 0.2;
                    return [minMz < 0 ? 0 : minMz, maxMz];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(d3Renderer.prototype, "input", {
                get: function () {
                    return this.current;
                },
                enumerable: true,
                configurable: true
            });
            d3Renderer.prototype.registerDownloader = function (id) {
                var a = $ts(Internal.Handlers.EnsureNodeId(id));
                var csv = this.current.csv();
                if (!isNullOrUndefined(a)) {
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
                if (div instanceof HTMLElement) {
                    div = "#" + div.id;
                }
                else {
                    div = Internal.Handlers.EnsureNodeId(div);
                }
                BioDeep.MSMSViewer.clear(div);
                this.tip = BioDeep.MSMSViewer.tooltip(this.current);
                this.svg = BioDeep.MSMSViewer.svg(this, div);
                // 因为在下面的chartting函数调用之中需要使用tip对象来绑定鼠标事件，
                // 所以在这里需要先于chartting函数将tip对象初始化完毕  
                this.svg.call(this.tip);
                MSMSViewer.renderingWork.chartting(this);
                MSMSViewer.renderingWork.Legend(this);
                this.tip.hide();
            };
            return d3Renderer;
        }(SvgChart));
        MSMSViewer.d3Renderer = d3Renderer;
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
/// <reference path="../../../../build/svg.d.ts" />
var BioDeep;
(function (BioDeep) {
    var MSMSViewer;
    (function (MSMSViewer) {
        var renderingWork;
        (function (renderingWork) {
            function defaultMargin() {
                return new Canvas.Margin(70, 10, 10, 50);
            }
            renderingWork.defaultMargin = defaultMargin;
        })(renderingWork = MSMSViewer.renderingWork || (MSMSViewer.renderingWork = {}));
    })(MSMSViewer = BioDeep.MSMSViewer || (BioDeep.MSMSViewer = {}));
})(BioDeep || (BioDeep = {}));
//# sourceMappingURL=biodeepMSMS.Viewer.js.map