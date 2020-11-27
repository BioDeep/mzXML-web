var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SvgChart = /** @class */ (function () {
    function SvgChart(size, margin) {
        if (size === void 0) { size = [960, 600]; }
        if (margin === void 0) { margin = {
            top: 20, right: 20, bottom: 30, left: 40
        }; }
        if (!Array.isArray(size)) {
            this.size = [size.width, size.height];
        }
        else {
            this.size = [size[0], size[1]];
        }
        this.margin = margin;
    }
    Object.defineProperty(SvgChart.prototype, "width", {
        get: function () {
            return this.size["0"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SvgChart.prototype, "height", {
        get: function () {
            return this.size["1"];
        },
        enumerable: true,
        configurable: true
    });
    return SvgChart;
}());
/// <reference path="../../../build/linq.d.ts"/>
var SvgUtils;
(function (SvgUtils) {
    /**
     * 这个函数会直接从目标的width和height属性来获取值
    */
    function getSize(container, defaultSize) {
        if (defaultSize === void 0) { defaultSize = size(960, 600); }
        var w = container.getAttribute("width");
        var h = container.getAttribute("height");
        if (Array.isArray(defaultSize)) {
            defaultSize = size(defaultSize[0], defaultSize[1]);
        }
        if (isNullOrUndefined(w) || Strings.Empty(w, true)) {
            w = defaultSize.width.toString();
        }
        if (isNullOrUndefined(h) || Strings.Empty(h, true)) {
            h = defaultSize.height.toString();
        }
        return size(Strings.parseInt(w), Strings.parseInt(h));
    }
    SvgUtils.getSize = getSize;
    function size(width, height) {
        return new Canvas.Size(width, height);
    }
    SvgUtils.size = size;
    /**
     * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @param c The rgb color component numeric value
    */
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    SvgUtils.componentToHex = componentToHex;
    SvgUtils.HTML5svgFeature = "http://www.w3.org/TR/SVG2/feature#GraphicsAttribute";
    /**
     * 测试当前的浏览器是否支持HTML5的高级特性
    */
    function hasSVG2Feature() {
        return document.implementation.hasFeature(SvgUtils.HTML5svgFeature, "2.0");
    }
    SvgUtils.hasSVG2Feature = hasSVG2Feature;
    /**
     * https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html
     *
     * @param n The svg node name
     * @param v The svg node attributes
     *
     * @description
     *
     * ### HTML 5, inline SVG, and namespace awareness for SVG DOM
     * > https://stackoverflow.com/questions/23319537/html-5-inline-svg-and-namespace-awareness-for-svg-dom
     *
     * HTML5 defines ``HTML``, ``XHTML`` and the ``DOM``.
     * The ``DOM`` is namespace aware. When you use ``DOM`` methods you must take into account which namespace
     * each element is in, but the default is the ``HTML`` (http://www.w3.org/1999/xhtml) namespace.
     * ``HTML`` and ``XHTML`` are serializations that are converted into ``DOMs`` by parsing.
     * ``XHTML`` is namespace aware and ``XHTML`` documents apply namespaces according to the rules of ``XML``,
     * so all namespaces must be assigned to each element explicitly. ``XHTML`` is converted to a ``DOM`` using
     * an ``XML`` parser.
     *
     * ``HTML`` is also namespace aware, but namespaces are assigned implicitly. HTML is converted to a DOM using
     * an HTML parser, which knows which elements go in which namespace. That is, it knows that <div> goes
     * in the http://www.w3.org/1999/xhtml namespace and that <svg> goes in the http://www.w3.org/2000/svg
     * namespace. Elements like <script> can go in either the http://www.w3.org/1999/xhtml or the http://www.w3.org/2000/svg
     * namespace depending on the context in which they appear in the HTML code.
     * The HTML parser knows about HTML elements, SVG elements, and MathML elements and no others. There is no
     * option to use elements from other namespaces, neither implicitly nor explicitly.
     * That is, xmlns attributes have no effect.
    */
    function svgNode(n, v) {
        if (v === void 0) { v = null; }
        var node = document.createElementNS("http://www.w3.org/2000/svg", n);
        var name = "";
        if (v) {
            for (var p in v) {
                name = p.replace(/[A-Z]/g, function (m, p, o, s) {
                    return "-" + m.toLowerCase();
                });
                node.setAttributeNS(null, name, v[p]);
            }
        }
        return node;
    }
    SvgUtils.svgNode = svgNode;
})(SvgUtils || (SvgUtils = {}));
/// <reference path="../SvgUtils.ts"/>
/**
 * SVG画布元素
*/
var Canvas;
(function (Canvas) {
    /**
     * The object location data model
    */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.toString = function () {
            return "[" + this.x + ", " + this.y + "]";
        };
        /**
         * Calculate the 2d distance to other point from this point.
        */
        Point.prototype.dist = function (p2) {
            var dx = p2.x - this.x;
            var dy = p2.y - this.y;
            return dx * dx + dy * dy;
        };
        /**
         * Is this point equals to a given point by numeric value equals
         * of the ``x`` and ``y``?
        */
        Point.prototype.Equals = function (p2) {
            return this.x == p2.x && this.y == p2.y;
        };
        return Point;
    }());
    Canvas.Point = Point;
    /**
     * 表示一个矩形区域的大小
    */
    var Size = /** @class */ (function () {
        /**
         * @param width 宽度
         * @param height 高度
        */
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.prototype.toString = function () {
            return "[" + this.width + ", " + this.height + "]";
        };
        return Size;
    }());
    Canvas.Size = Size;
    /**
     * 表示一个二维平面上的矩形区域
    */
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(x, y, width, height) {
            var _this = _super.call(this, width, height) || this;
            _this.left = x;
            _this.top = y;
            return _this;
        }
        Rectangle.prototype.Location = function () {
            return new Point(this.left, this.top);
        };
        Rectangle.prototype.Size = function () {
            return new Size(this.width, this.height);
        };
        Rectangle.prototype.toString = function () {
            return "Size: " + this.Size().toString() + " @ " + this.Location().toString();
        };
        return Rectangle;
    }(Size));
    Canvas.Rectangle = Rectangle;
    var Margin = /** @class */ (function () {
        function Margin(top, right, bottom, left) {
            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.left = left;
        }
        Object.defineProperty(Margin.prototype, "horizontal", {
            get: function () {
                return this.left + this.right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Margin.prototype, "vertical", {
            get: function () {
                return this.top + this.bottom;
            },
            enumerable: true,
            configurable: true
        });
        Margin.Object = function (obj) {
            if (Array.isArray(obj)) {
                return new Margin(obj[0], obj[1], obj[2], obj[3]);
            }
            else {
                return new Margin(obj.top, obj.right, obj.bottom, obj.left);
            }
        };
        Margin.prototype.toString = function () {
            return "[" + this.top + ", " + this.right + ", " + this.bottom + ", " + this.left + "]";
        };
        return Margin;
    }());
    Canvas.Margin = Margin;
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    /**
     * The css border style
    */
    var Pen = /** @class */ (function () {
        /**
         * Create a new css border style for svg rectangle, line, etc.
         *
         * @param color The border color
         * @param width The border width
        */
        function Pen(color, width) {
            if (width === void 0) { width = 1; }
            this.color = color;
            this.width = width;
        }
        Pen.prototype.Styling = function (node) {
            node.style.stroke = this.color.ToHtmlColor();
            node.style.strokeWidth = this.width.toString();
            return node;
        };
        Pen.prototype.CSSStyle = function () {
            return "stroke-width:" + this.width + ";stroke:" + this.color.ToHtmlColor() + ";";
        };
        return Pen;
    }());
    Canvas.Pen = Pen;
})(Canvas || (Canvas = {}));
/// <reference path="SvgUtils.ts"/>
/// <reference path="Canvas/Canvas.ts"/>
/// <reference path="Canvas/Pen.ts"/>
/**
 * 提供类似于VB.NET之中的Graphics对象的模拟
*/
var Graphics = /** @class */ (function () {
    /**
     * 创建一个SVG画布对象
     *
     * @param div div id
    */
    function Graphics(div) {
        this.svg = SvgUtils.svgNode("svg", { "version": "1.1" });
        this.container = document.getElementById(div);
        this.container.appendChild(this.svg);
    }
    /**
     * Set the size value of the svg canvas
    */
    Graphics.prototype.size = function (width, height) {
        this.svg.setAttribute("width", width.toString() + "px");
        this.svg.setAttribute("height", height.toString() + "px");
        return this;
    };
    /**
     * The viewBox attribute allows you to specify that a given set of graphics stretch to
     * fit a particular container element.
     *
     * The value of the viewBox attribute is a list of four numbers min-x, min-y, width and
     * height, separated by whitespace and/or a comma, which specify a rectangle in user
     * space which should be mapped to the bounds of the viewport established by the given
     * element, taking into account attribute preserveAspectRatio.
     *
     * Negative values for width or height are not permitted and a value of zero disables
     * rendering of the element.
    */
    Graphics.prototype.viewBox = function (minX, minY, width, height) {
        var box = minX + " " + minY + " " + width + " " + height;
        this.svg.setAttribute("viewBox", box);
        return this;
    };
    /**
     * Draw a basic svg line shape
     *
     * @param pen Defines the line border: color and line width
    */
    Graphics.prototype.drawLine = function (pen, a, b, id, className) {
        if (id === void 0) { id = null; }
        if (className === void 0) { className = null; }
        var attrs = {
            "x1": a.x.toString(),
            "y1": a.y.toString(),
            "x2": b.x.toString(),
            "y2": b.y.toString(),
            "z-index": ++this.z
        };
        if (id)
            attrs["id"] = id;
        if (className)
            attrs["class"] = className;
        var node = pen.Styling(SvgUtils.svgNode("line", attrs));
        this.svg.appendChild(node);
        return this;
    };
    Graphics.prototype.drawCircle = function (center, radius, border, fill, id, className) {
        if (border === void 0) { border = Canvas.Pens.Black(); }
        if (fill === void 0) { fill = null; }
        if (id === void 0) { id = null; }
        if (className === void 0) { className = null; }
        var attrs = {
            "cx": center.x.toString(),
            "cy": center.y.toString(),
            "r": radius,
            "z-index": ++this.z
        };
        if (id)
            attrs["id"] = id;
        if (className)
            attrs["class"] = className;
        if (fill)
            attrs["fill"] = fill.ToHtmlColor();
        var node = border.Styling(SvgUtils.svgNode("circle", attrs));
        this.svg.appendChild(node);
        return this;
    };
    /**
     * The ``<ellipse>`` element is an SVG basic shape, used to create ellipses
     * based on a center coordinate, and both their x and y radius.
     *
     * @description Note: Ellipses are unable to specify the exact orientation of
     * the ellipse (if, for example, you wanted to draw an ellipse tilted at a 45
     * degree angle), but it can be rotated by using the ``transform`` attribute.
    */
    Graphics.prototype.drawEllipse = function (center, rx, ry, border, fill, id, className) {
        if (border === void 0) { border = Canvas.Pens.Black(); }
        if (fill === void 0) { fill = null; }
        if (id === void 0) { id = null; }
        if (className === void 0) { className = null; }
        var attrs = {
            "cx": center.x,
            "cy": center.y,
            "rx": rx,
            "ry": ry,
            "z-index": ++this.z
        };
        if (id)
            attrs["id"] = id;
        if (className)
            attrs["class"] = className;
        if (fill)
            attrs["fill"] = fill.ToHtmlColor();
        var node = border.Styling(SvgUtils.svgNode("ellipse", attrs));
        this.svg.appendChild(node);
        return this;
    };
    /**
     * Draw a basic svg rectangle shape
    */
    Graphics.prototype.drawRectangle = function (rect, border, fill, id, className) {
        if (border === void 0) { border = Canvas.Pens.Black(); }
        if (fill === void 0) { fill = null; }
        if (id === void 0) { id = null; }
        if (className === void 0) { className = null; }
        var attrs = {
            "x": rect.left.toString(),
            "y": rect.top.toString(),
            "width": rect.width.toString(),
            "height": rect.height.toString(),
            "z-index": ++this.z
        };
        if (id)
            attrs["id"] = id;
        if (className)
            attrs["class"] = className;
        if (fill)
            attrs["fill"] = fill.ToHtmlColor();
        var node = border.Styling(SvgUtils.svgNode("rect", attrs));
        this.svg.appendChild(node);
        return this;
    };
    /**
     * The ``<path>`` SVG element is the generic element to define a shape.
     * All the basic shapes can be created with a path element.
    */
    Graphics.prototype.drawPath = function (path, border, fill, id, className) {
        if (border === void 0) { border = Canvas.Pens.Black(); }
        if (fill === void 0) { fill = null; }
        if (id === void 0) { id = null; }
        if (className === void 0) { className = null; }
        var attrs = {
            "d": path.d,
            "z-index": ++this.z
        };
        if (id)
            attrs["id"] = id;
        if (className)
            attrs["class"] = className;
        if (fill)
            attrs["fill"] = fill.ToHtmlColor();
        var node = border.Styling(SvgUtils.svgNode("path", attrs));
        this.svg.appendChild(node);
        return this;
    };
    return Graphics;
}());
var Canvas;
(function (Canvas) {
    /**
     * RGB color data model
    */
    var Color = /** @class */ (function () {
        function Color(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        /**
         * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        */
        Color.FromHtmlColor = function (htmlColor) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var hex = htmlColor;
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
        };
        Color.prototype.ToHtmlColor = function () {
            var r = SvgUtils.componentToHex(this.r);
            var g = SvgUtils.componentToHex(this.g);
            var b = SvgUtils.componentToHex(this.b);
            return "#" + r + g + b;
        };
        Color.prototype.ToRGBColor = function () {
            return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
        };
        return Color;
    }());
    Canvas.Color = Color;
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    var Font = /** @class */ (function () {
        function Font(family, size, bold, italic) {
            if (size === void 0) { size = "12px"; }
            if (bold === void 0) { bold = false; }
            if (italic === void 0) { italic = false; }
            this.family = family;
            this.size = size;
            this.bold = bold;
            this.italic = italic;
        }
        Font.prototype.Styling = function (node) {
            var styles = [];
            if (this.bold)
                styles.push("bold");
            if (this.italic)
                styles.push("italic");
            node.style.fontFamily = this.family;
            node.style.fontSize = this.size;
            node.style.fontStyle = styles.join(" ");
            return node;
        };
        Font.prototype.CSSStyle = function () {
            var styles = [];
            if (this.bold)
                styles.push("bold");
            if (this.italic)
                styles.push("italic");
            return "font: " + styles.join(" ") + " " + this.size + " \"" + this.family + "\"";
        };
        return Font;
    }());
    Canvas.Font = Font;
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    /**
     * ``path``元素是用来定义形状的通用元素。所有的基本形状都可以
     * 用``path``元素来创建。
    */
    var Path = /** @class */ (function () {
        function Path() {
            this.pathStack = [];
        }
        Object.defineProperty(Path.prototype, "d", {
            /**
             * 获取SVG的path字符串结果
            */
            get: function () {
                return this.pathStack.join(" ");
            },
            enumerable: true,
            configurable: true
        });
        Path.prototype.toString = function () {
            return this.d;
        };
        /**
         * 从给定的（x,y）坐标开启一个新的子路径或路径。M表示后面跟随的是绝对坐标值。
         * m表示后面跟随的是一个相对坐标值。如果"moveto"指令后面跟随着多个坐标值，那么
         * 这多个坐标值之间会被当做用线段连接。因此如果moveto是相对的，那么lineto也将会
         * 是相对的，反之也成立。如果一个相对的moveto出现在path的第一个位置，那么它会
         * 被认为是一个绝对的坐标。在这种情况下，子序列的坐标将会被当做相对的坐标，即便
         * 它在初始化的时候是绝对坐标。
        */
        Path.prototype.MoveTo = function (x, y, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("m " + x + "," + y);
            }
            else {
                this.pathStack.push("M " + x + "," + y);
            }
            return this;
        };
        /**
         * 从（cpx,cpy）画一个水平线到（x,cpy）。H表示后面跟随的参数是绝对的坐标，h表示
         * 后面跟随的参数是相对坐标。可以为其提供多个x值作为参数。在指令执行结束后，
         * 最新的当前点将是参数提供的最后值（x，cpy）
        */
        Path.prototype.HorizontalTo = function (x, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("h " + x);
            }
            else {
                this.pathStack.push("H " + x);
            }
            return this;
        };
        /**
         * 从当前点（cpx，cpy）到（cpx，y）画一条竖直线段。V表示后面的参数是绝对坐标
         * 值，v表示后面跟着的参数是相对坐标值。可以供多个y值作为参数使用。在指令的最
         * 后，根据最后的参数y值最新的当前点的坐标值是（cpx,y）.
        */
        Path.prototype.VerticalTo = function (y, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("v " + y);
            }
            else {
                this.pathStack.push("V " + y);
            }
            return this;
        };
        /**
         * 画一条从当前点到给定的（x,y）坐标，这个给定的坐标将变为新的当前点。L表示后面
         * 跟随的参数将是绝对坐标值；l表示后面跟随的参数将是相对坐标值。可以通过指定一系
         * 列的坐标来描绘折线。在命令执行后，新的当前点将会被设置成被提供坐标序列的最后
         * 一个坐标。
        */
        Path.prototype.LineTo = function (x, y, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("l " + x + " " + y);
            }
            else {
                this.pathStack.push("L " + x + " " + y);
            }
            return this;
        };
        /**
         * 在曲线开始的时候，用（x1，y1）作为当前点（x，y）的控制点，
         * 在曲线结束的时候，用（x2，y2）作为当前点的控制点，
         * 画一段立方体的贝塞尔曲线。C表示后面跟随的参数是绝对坐标值；
         * c表示后面跟随的参数是相对坐标值。可以为贝塞尔函数提供多个参数
         * 值。在指令执行完毕后，最后的当前点将变为在贝塞尔函数中只用的
         * 最后的（x，y）坐标值
        */
        Path.prototype.CurveTo = function (x1, y1, x2, y2, endX, endY, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("c " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + endX + " " + endY);
            }
            else {
                this.pathStack.push("C " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + endX + " " + endY);
            }
            return this;
        };
        /**
         * 从当前点（x，y）画一个立方体的贝塞尔曲线。相对于当前点，
         * 第一个控制点被认为是前面命令的第二个控制点的反射。（如果
         * 前面没有指令或者指令不是C, c, S 或者s，那么就认定当前点和
         * 第一个控制点是一致的。）（x2，y2）是第二个控制点，控制
         * 着曲线结束时的变化。S表示后面跟随的参数是绝对的坐标值。
         * s表示后面跟随的参数是相对的坐标值。多个值可以作为
         * 贝塞尔函数的参数。在执行执行完后，最新的当前点是在贝塞尔函数中
         * 使用的最后的（x，y）坐标值。
        */
        Path.prototype.SmoothCurveTo = function (x2, y2, endX, endY, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("s " + x2 + " " + y2 + " " + endY + " " + endY);
            }
            else {
                this.pathStack.push("S " + x2 + " " + y2 + " " + endY + " " + endY);
            }
            return this;
        };
        /**
         * 从当前点（x，y）开始，以（x1，y1）为控制点，画出一个二次贝塞尔曲线。
         * Q表示后面跟随的参数是绝对坐标值，q表示后面跟随的参数是相对坐标值。
         * 可以为贝塞尔函数指定多个参数值。在指令执行结束后，新的当前点是贝塞尔曲线调用参数中最后一个坐标值（x，y）。
        */
        Path.prototype.QuadraticBelzier = function (x, y, endX, endY, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("q " + x + " " + y + " " + endX + " " + endY);
            }
            else {
                this.pathStack.push("Q " + x + " " + y + " " + endX + " " + endY);
            }
            return this;
        };
        /**
         * 用来从当前点（x，y）来画出一个椭圆弧曲线。曲线的形状和方向通过椭圆半径（rx，ry）
         * 和一个沿X轴旋转度来指明椭圆作为一个整体在当前坐标系下旋转的情形。椭圆的中心
         * （cx，cy）是通过满足其他参数的约束自动计算出来的。large-arc-flag和sweep-flag决定了计算和帮助要画的弧度大小。
        */
        Path.prototype.EllipticalArc = function (rX, rY, xrotation, flag1, flag2, x, y, relative) {
            if (relative === void 0) { relative = false; }
            if (relative) {
                this.pathStack.push("a " + rX + " " + rY + " " + xrotation + " " + flag1 + " " + flag2 + " " + x + " " + y);
            }
            else {
                this.pathStack.push("A " + rX + " " + rY + " " + xrotation + " " + flag1 + " " + flag2 + " " + x + " " + y);
            }
            return this;
        };
        /**
         * ClosePath命令将在当前路径从，从当前点到第一个点简单画一条直线。它是最简单的命令，
         * 而且不带有任何参数。它沿着到开始点的最短的线性路径，如果别的路径落在这路上，将
         * 可能路径相交。句法是``Z``或``z``，两种写法作用都一样。
        */
        Path.prototype.ClosePath = function () {
            this.pathStack.push("Z");
            return this;
        };
        return Path;
    }());
    Canvas.Path = Path;
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    var Brushes = /** @class */ (function () {
        function Brushes() {
        }
        Object.defineProperty(Brushes, "Black", {
            /**
             * Black (#000000)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Black);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Night", {
            /**
             * Night (#0C090A)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Night);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Gunmetal", {
            /**
             * Gunmetal (#2C3539)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Gunmetal);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Midnight", {
            /**
             * Midnight (#2B1B17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Midnight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Charcoal", {
            /**
             * Charcoal (#34282C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Charcoal);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkSlateGrey", {
            /**
             * Dark Slate Grey (#25383C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkSlateGrey);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Oil", {
            /**
             * Oil (#3B3131)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Oil);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlackCat", {
            /**
             * Black Cat (#413839)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlackCat);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Iridium", {
            /**
             * Iridium (#3D3C3A)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Iridium);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlackEel", {
            /**
             * Black Eel (#463E3F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlackEel);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlackCow", {
            /**
             * Black Cow (#4C4646)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlackCow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GrayWolf", {
            /**
             * Gray Wolf (#504A4B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GrayWolf);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "VampireGray", {
            /**
             * Vampire Gray (#565051)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.VampireGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GrayDolphin", {
            /**
             * Gray Dolphin (#5C5858)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GrayDolphin);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CarbonGray", {
            /**
             * Carbon Gray (#625D5D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CarbonGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AshGray", {
            /**
             * Ash Gray (#666362)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AshGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CloudyGray", {
            /**
             * Cloudy Gray (#6D6968)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CloudyGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SmokeyGray", {
            /**
             * Smokey Gray (#726E6D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SmokeyGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Gray", {
            /**
             * Gray (#736F6E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Gray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Granite", {
            /**
             * Granite (#837E7C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Granite);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BattleshipGray", {
            /**
             * Battleship Gray (#848482)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BattleshipGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GrayCloud", {
            /**
             * Gray Cloud (#B6B6B4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GrayCloud);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GrayGoose", {
            /**
             * Gray Goose (#D1D0CE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GrayGoose);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Platinum", {
            /**
             * Platinum (#E5E4E2)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Platinum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MetallicSilver", {
            /**
             * Metallic Silver (#BCC6CC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MetallicSilver);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueGray", {
            /**
             * Blue Gray (#98AFC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSlateGray", {
            /**
             * Light Slate Gray (#6D7B8D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSlateGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SlateGray", {
            /**
             * Slate Gray (#657383)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SlateGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "JetGray", {
            /**
             * Jet Gray (#616D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.JetGray);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MistBlue", {
            /**
             * Mist Blue (#646D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MistBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MarbleBlue", {
            /**
             * Marble Blue (#566D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MarbleBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SlateBlue", {
            /**
             * Slate Blue (#737CA1)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SlateBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SteelBlue", {
            /**
             * Steel Blue (#4863A0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SteelBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueJay", {
            /**
             * Blue Jay (#2B547E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueJay);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkSlateBlue", {
            /**
             * Dark Slate Blue (#2B3856)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkSlateBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MidnightBlue", {
            /**
             * Midnight Blue (#151B54)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MidnightBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "NavyBlue", {
            /**
             * Navy Blue (#000080)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.NavyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueWhale", {
            /**
             * Blue Whale (#342D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueWhale);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LapisBlue", {
            /**
             * Lapis Blue (#15317E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LapisBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DenimDarkBlue", {
            /**
             * Denim Dark Blue (#151B8D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DenimDarkBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "EarthBlue", {
            /**
             * Earth Blue (#0000A0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.EarthBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CobaltBlue", {
            /**
             * Cobalt Blue (#0020C2)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CobaltBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueberryBlue", {
            /**
             * Blueberry Blue (#0041C2)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueberryBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SapphireBlue", {
            /**
             * Sapphire Blue (#2554C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SapphireBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueEyes", {
            /**
             * Blue Eyes (#1569C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueEyes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RoyalBlue", {
            /**
             * Royal Blue (#2B60DE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RoyalBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueOrchid", {
            /**
             * Blue Orchid (#1F45FC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueOrchid);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueLotus", {
            /**
             * Blue Lotus (#6960EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueLotus);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSlateBlue", {
            /**
             * Light Slate Blue (#736AFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSlateBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "WindowsBlue", {
            /**
             * Windows Blue (#357EC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.WindowsBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GlacialBlueIce", {
            /**
             * Glacial Blue Ice (#368BC1)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GlacialBlueIce);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SilkBlue", {
            /**
             * Silk Blue (#488AC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SilkBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueIvy", {
            /**
             * Blue Ivy (#3090C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueIvy);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueKoi", {
            /**
             * Blue Koi (#659EC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueKoi);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ColumbiaBlue", {
            /**
             * Columbia Blue (#87AFC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ColumbiaBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BabyBlue", {
            /**
             * Baby Blue (#95B9C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BabyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSteelBlue", {
            /**
             * Light Steel Blue (#728FCE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSteelBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "OceanBlue", {
            /**
             * Ocean Blue (#2B65EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.OceanBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueRibbon", {
            /**
             * Blue Ribbon (#306EFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueRibbon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueDress", {
            /**
             * Blue Dress (#157DEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueDress);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DodgerBlue", {
            /**
             * Dodger Blue (#1589FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DodgerBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CornflowerBlue", {
            /**
             * Cornflower Blue (#6495ED)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CornflowerBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SkyBlue", {
            /**
             * Sky Blue (#6698FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SkyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ButterflyBlue", {
            /**
             * Butterfly Blue (#38ACEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ButterflyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Iceberg", {
            /**
             * Iceberg (#56A5EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Iceberg);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CrystalBlue", {
            /**
             * Crystal Blue (#5CB3FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CrystalBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DeepSkyBlue", {
            /**
             * Deep Sky Blue (#3BB9FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DeepSkyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DenimBlue", {
            /**
             * Denim Blue (#79BAEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DenimBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSkyBlue", {
            /**
             * Light Sky Blue (#82CAFA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSkyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DaySkyBlue", {
            /**
             * Day Sky Blue (#82CAFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DaySkyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "JeansBlue", {
            /**
             * Jeans Blue (#A0CFEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.JeansBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueAngel", {
            /**
             * Blue Angel (#B7CEEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueAngel);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PastelBlue", {
            /**
             * Pastel Blue (#B4CFEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PastelBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SeaBlue", {
            /**
             * Sea Blue (#C2DFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SeaBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PowderBlue", {
            /**
             * Powder Blue (#C6DEFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PowderBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CoralBlue", {
            /**
             * Coral Blue (#AFDCEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CoralBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightBlue", {
            /**
             * Light Blue (#ADDFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RobinEggBlue", {
            /**
             * Robin Egg Blue (#BDEDFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RobinEggBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PaleBlueLily", {
            /**
             * Pale Blue Lily (#CFECEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PaleBlueLily);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightCyan", {
            /**
             * Light Cyan (#E0FFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightCyan);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Water", {
            /**
             * Water (#EBF4FA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Water);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AliceBlue", {
            /**
             * AliceBlue (#F0F8FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AliceBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Azure", {
            /**
             * Azure (#F0FFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Azure);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSlate", {
            /**
             * Light Slate (#CCFFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSlate);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightAquamarine", {
            /**
             * Light Aquamarine (#93FFE8)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightAquamarine);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ElectricBlue", {
            /**
             * Electric Blue (#9AFEFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ElectricBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Aquamarine", {
            /**
             * Aquamarine (#7FFFD4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Aquamarine);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CyanorAqua", {
            /**
             * Cyan or Aqua (#00FFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CyanorAqua);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TronBlue", {
            /**
             * Tron Blue (#7DFDFE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TronBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueZircon", {
            /**
             * Blue Zircon (#57FEFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueZircon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueLagoon", {
            /**
             * Blue Lagoon (#8EEBEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueLagoon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Celeste", {
            /**
             * Celeste (#50EBEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Celeste);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueDiamond", {
            /**
             * Blue Diamond (#4EE2EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueDiamond);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TiffanyBlue", {
            /**
             * Tiffany Blue (#81D8D0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TiffanyBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CyanOpaque", {
            /**
             * Cyan Opaque (#92C7C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CyanOpaque);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlueHosta", {
            /**
             * Blue Hosta (#77BFC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlueHosta);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "NorthernLightsBlue", {
            /**
             * Northern Lights Blue (#78C7C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.NorthernLightsBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumTurquoise", {
            /**
             * Medium Turquoise (#48CCCD)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumTurquoise);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Turquoise", {
            /**
             * Turquoise (#43C6DB)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Turquoise);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Jellyfish", {
            /**
             * Jellyfish (#46C7C7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Jellyfish);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Bluegreen", {
            /**
             * Blue green (#7BCCB5)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Bluegreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MacawBlueGreen", {
            /**
             * Macaw Blue Green (#43BFC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MacawBlueGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSeaGreen", {
            /**
             * Light Sea Green (#3EA99F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSeaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkTurquoise", {
            /**
             * Dark Turquoise (#3B9C9C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkTurquoise);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SeaTurtleGreen", {
            /**
             * Sea Turtle Green (#438D80)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SeaTurtleGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumAquamarine", {
            /**
             * Medium Aquamarine (#348781)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumAquamarine);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenishBlue", {
            /**
             * Greenish Blue (#307D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenishBlue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GrayishTurquoise", {
            /**
             * Grayish Turquoise (#5E7D7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GrayishTurquoise);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BeetleGreen", {
            /**
             * Beetle Green (#4C787E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BeetleGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Teal", {
            /**
             * Teal (#008080)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Teal);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SeaGreen", {
            /**
             * Sea Green (#4E8975)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SeaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CamouflageGreen", {
            /**
             * Camouflage Green (#78866B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CamouflageGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SageGreen", {
            /**
             * Sage Green (#848b79)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SageGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HazelGreen", {
            /**
             * Hazel Green (#617C58)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HazelGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "VenomGreen", {
            /**
             * Venom Green (#728C00)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.VenomGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FernGreen", {
            /**
             * Fern Green (#667C26)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FernGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkForestGreen", {
            /**
             * Dark Forest Green (#254117)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkForestGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumSeaGreen", {
            /**
             * Medium Sea Green (#306754)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumSeaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumForestGreen", {
            /**
             * Medium Forest Green (#347235)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumForestGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SeaweedGreen", {
            /**
             * Seaweed Green (#437C17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SeaweedGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PineGreen", {
            /**
             * Pine Green (#387C44)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PineGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "JungleGreen", {
            /**
             * Jungle Green (#347C2C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.JungleGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ShamrockGreen", {
            /**
             * Shamrock Green (#347C17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ShamrockGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumSpringGreen", {
            /**
             * Medium Spring Green (#348017)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumSpringGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ForestGreen", {
            /**
             * Forest Green (#4E9258)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ForestGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenOnion", {
            /**
             * Green Onion (#6AA121)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenOnion);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SpringGreen", {
            /**
             * Spring Green (#4AA02C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SpringGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LimeGreen", {
            /**
             * Lime Green (#41A317)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LimeGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CloverGreen", {
            /**
             * Clover Green (#3EA055)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CloverGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenSnake", {
            /**
             * Green Snake (#6CBB3C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenSnake);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AlienGreen", {
            /**
             * Alien Green (#6CC417)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AlienGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenApple", {
            /**
             * Green Apple (#4CC417)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenApple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "YellowGreen", {
            /**
             * Yellow Green (#52D017)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.YellowGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "KellyGreen", {
            /**
             * Kelly Green (#4CC552)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.KellyGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ZombieGreen", {
            /**
             * Zombie Green (#54C571)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ZombieGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FrogGreen", {
            /**
             * Frog Green (#99C68E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FrogGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenPeas", {
            /**
             * Green Peas (#89C35C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenPeas);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DollarBillGreen", {
            /**
             * Dollar Bill Green (#85BB65)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DollarBillGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkSeaGreen", {
            /**
             * Dark Sea Green (#8BB381)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkSeaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "IguanaGreen", {
            /**
             * Iguana Green (#9CB071)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.IguanaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AvocadoGreen", {
            /**
             * Avocado Green (#B2C248)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AvocadoGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PistachioGreen", {
            /**
             * Pistachio Green (#9DC209)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PistachioGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SaladGreen", {
            /**
             * Salad Green (#A1C935)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SaladGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HummingbirdGreen", {
            /**
             * Hummingbird Green (#7FE817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HummingbirdGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "NebulaGreen", {
            /**
             * Nebula Green (#59E817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.NebulaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "StoplightGoGreen", {
            /**
             * Stoplight Go Green (#57E964)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.StoplightGoGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AlgaeGreen", {
            /**
             * Algae Green (#64E986)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AlgaeGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "JadeGreen", {
            /**
             * Jade Green (#5EFB6E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.JadeGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Green", {
            /**
             * Green (#00FF00)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Green);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "EmeraldGreen", {
            /**
             * Emerald Green (#5FFB17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.EmeraldGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LawnGreen", {
            /**
             * Lawn Green (#87F717)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LawnGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Chartreuse", {
            /**
             * Chartreuse (#8AFB17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Chartreuse);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DragonGreen", {
            /**
             * Dragon Green (#6AFB92)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DragonGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Mintgreen", {
            /**
             * Mint green (#98FF98)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Mintgreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenThumb", {
            /**
             * Green Thumb (#B5EAAA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenThumb);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightJade", {
            /**
             * Light Jade (#C3FDB8)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightJade);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TeaGreen", {
            /**
             * Tea Green (#CCFB5D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TeaGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GreenYellow", {
            /**
             * Green Yellow (#B1FB17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GreenYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SlimeGreen", {
            /**
             * Slime Green (#BCE954)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SlimeGreen);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Goldenrod", {
            /**
             * Goldenrod (#EDDA74)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Goldenrod);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HarvestGold", {
            /**
             * Harvest Gold (#EDE275)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HarvestGold);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SunYellow", {
            /**
             * Sun Yellow (#FFE87C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SunYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Yellow", {
            /**
             * Yellow (#FFFF00)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Yellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CornYellow", {
            /**
             * Corn Yellow (#FFF380)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CornYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Parchment", {
            /**
             * Parchment (#FFFFC2)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Parchment);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Cream", {
            /**
             * Cream (#FFFFCC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Cream);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LemonChiffon", {
            /**
             * Lemon Chiffon (#FFF8C6)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LemonChiffon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Cornsilk", {
            /**
             * Cornsilk (#FFF8DC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Cornsilk);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Beige", {
            /**
             * Beige (#F5F5DC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Beige);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Blonde", {
            /**
             * Blonde (#FBF6D9)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Blonde);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AntiqueWhite", {
            /**
             * AntiqueWhite (#FAEBD7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AntiqueWhite);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Champagne", {
            /**
             * Champagne (#F7E7CE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Champagne);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlanchedAlmond", {
            /**
             * BlanchedAlmond (#FFEBCD)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlanchedAlmond);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Vanilla", {
            /**
             * Vanilla (#F3E5AB)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Vanilla);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TanBrown", {
            /**
             * Tan Brown (#ECE5B6)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TanBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Peach", {
            /**
             * Peach (#FFE5B4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Peach);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Mustard", {
            /**
             * Mustard (#FFDB58)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Mustard);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RubberDuckyYellow", {
            /**
             * Rubber Ducky Yellow (#FFD801)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RubberDuckyYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BrightGold", {
            /**
             * Bright Gold (#FDD017)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BrightGold);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Goldenbrown", {
            /**
             * Golden brown (#EAC117)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Goldenbrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MacaroniandCheese", {
            /**
             * Macaroni and Cheese (#F2BB66)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MacaroniandCheese);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Saffron", {
            /**
             * Saffron (#FBB917)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Saffron);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Beer", {
            /**
             * Beer (#FBB117)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Beer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Cantaloupe", {
            /**
             * Cantaloupe (#FFA62F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Cantaloupe);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BeeYellow", {
            /**
             * Bee Yellow (#E9AB17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BeeYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BrownSugar", {
            /**
             * Brown Sugar (#E2A76F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BrownSugar);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BurlyWood", {
            /**
             * BurlyWood (#DEB887)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BurlyWood);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DeepPeach", {
            /**
             * Deep Peach (#FFCBA4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DeepPeach);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "GingerBrown", {
            /**
             * Ginger Brown (#C9BE62)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.GingerBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SchoolBusYellow", {
            /**
             * School Bus Yellow (#E8A317)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SchoolBusYellow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SandyBrown", {
            /**
             * Sandy Brown (#EE9A4D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SandyBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FallLeafBrown", {
            /**
             * Fall Leaf Brown (#C8B560)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FallLeafBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "OrangeGold", {
            /**
             * Orange Gold (#D4A017)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.OrangeGold);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sand", {
            /**
             * Sand (#C2B280)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sand);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CookieBrown", {
            /**
             * Cookie Brown (#C7A317)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CookieBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Caramel", {
            /**
             * Caramel (#C68E17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Caramel);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Brass", {
            /**
             * Brass (#B5A642)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Brass);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Khaki", {
            /**
             * Khaki (#ADA96E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Khaki);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Camelbrown", {
            /**
             * Camel brown (#C19A6B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Camelbrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Bronze", {
            /**
             * Bronze (#CD7F32)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Bronze);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TigerOrange", {
            /**
             * Tiger Orange (#C88141)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TigerOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Cinnamon", {
            /**
             * Cinnamon (#C58917)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Cinnamon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BulletShell", {
            /**
             * Bullet Shell (#AF9B60)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BulletShell);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkGoldenrod", {
            /**
             * Dark Goldenrod (#AF7817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkGoldenrod);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Copper", {
            /**
             * Copper (#B87333)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Copper);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Wood", {
            /**
             * Wood (#966F33)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Wood);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "OakBrown", {
            /**
             * Oak Brown (#806517)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.OakBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Moccasin", {
            /**
             * Moccasin (#827839)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Moccasin);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ArmyBrown", {
            /**
             * Army Brown (#827B60)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ArmyBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sandstone", {
            /**
             * Sandstone (#786D5F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sandstone);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Mocha", {
            /**
             * Mocha (#493D26)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Mocha);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Taupe", {
            /**
             * Taupe (#483C32)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Taupe);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Coffee", {
            /**
             * Coffee (#6F4E37)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Coffee);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BrownBear", {
            /**
             * Brown Bear (#835C3B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BrownBear);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RedDirt", {
            /**
             * Red Dirt (#7F5217)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RedDirt);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sepia", {
            /**
             * Sepia (#7F462C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sepia);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "OrangeSalmon", {
            /**
             * Orange Salmon (#C47451)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.OrangeSalmon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Rust", {
            /**
             * Rust (#C36241)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Rust);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RedFox", {
            /**
             * Red Fox (#C35817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RedFox);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Chocolate", {
            /**
             * Chocolate (#C85A17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Chocolate);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sedona", {
            /**
             * Sedona (#CC6600)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sedona);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PapayaOrange", {
            /**
             * Papaya Orange (#E56717)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PapayaOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HalloweenOrange", {
            /**
             * Halloween Orange (#E66C2C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HalloweenOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PumpkinOrange", {
            /**
             * Pumpkin Orange (#F87217)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PumpkinOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ConstructionConeOrange", {
            /**
             * Construction Cone Orange (#F87431)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ConstructionConeOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SunriseOrange", {
            /**
             * Sunrise Orange (#E67451)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SunriseOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MangoOrange", {
            /**
             * Mango Orange (#FF8040)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MangoOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkOrange", {
            /**
             * Dark Orange (#F88017)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Coral", {
            /**
             * Coral (#FF7F50)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Coral);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BasketBallOrange", {
            /**
             * Basket Ball Orange (#F88158)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BasketBallOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightSalmon", {
            /**
             * Light Salmon (#F9966B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightSalmon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Tangerine", {
            /**
             * Tangerine (#E78A61)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Tangerine);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkSalmon", {
            /**
             * Dark Salmon (#E18B6B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkSalmon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightCoral", {
            /**
             * Light Coral (#E77471)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightCoral);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BeanRed", {
            /**
             * Bean Red (#F75D59)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BeanRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ValentineRed", {
            /**
             * Valentine Red (#E55451)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ValentineRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ShockingOrange", {
            /**
             * Shocking Orange (#E55B3C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ShockingOrange);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Red", {
            /**
             * Red (#FF0000)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Red);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Scarlet", {
            /**
             * Scarlet (#FF2400)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Scarlet);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RubyRed", {
            /**
             * Ruby Red (#F62217)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RubyRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FerrariRed", {
            /**
             * Ferrari Red (#F70D1A)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FerrariRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FireEngineRed", {
            /**
             * Fire Engine Red (#F62817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FireEngineRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LavaRed", {
            /**
             * Lava Red (#E42217)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LavaRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LoveRed", {
            /**
             * Love Red (#E41B17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LoveRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Grapefruit", {
            /**
             * Grapefruit (#DC381F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Grapefruit);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ChestnutRed", {
            /**
             * Chestnut Red (#C34A2C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ChestnutRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CherryRed", {
            /**
             * Cherry Red (#C24641)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CherryRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Mahogany", {
            /**
             * Mahogany (#C04000)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Mahogany);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ChilliPepper", {
            /**
             * Chilli Pepper (#C11B17)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ChilliPepper);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Cranberry", {
            /**
             * Cranberry (#9F000F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Cranberry);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RedWine", {
            /**
             * Red Wine (#990012)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RedWine);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Burgundy", {
            /**
             * Burgundy (#8C001A)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Burgundy);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Chestnut", {
            /**
             * Chestnut (#954535)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Chestnut);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BloodRed", {
            /**
             * Blood Red (#7E3517)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BloodRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sienna", {
            /**
             * Sienna (#8A4117)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sienna);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Sangria", {
            /**
             * Sangria (#7E3817)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Sangria);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Firebrick", {
            /**
             * Firebrick (#800517)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Firebrick);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Maroon", {
            /**
             * Maroon (#810541)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Maroon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PlumPie", {
            /**
             * Plum Pie (#7D0541)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PlumPie);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "VelvetMaroon", {
            /**
             * Velvet Maroon (#7E354D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.VelvetMaroon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PlumVelvet", {
            /**
             * Plum Velvet (#7D0552)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PlumVelvet);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RosyFinch", {
            /**
             * Rosy Finch (#7F4E52)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RosyFinch);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Puce", {
            /**
             * Puce (#7F5A58)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Puce);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DullPurple", {
            /**
             * Dull Purple (#7F525D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DullPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RosyBrown", {
            /**
             * Rosy Brown (#B38481)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RosyBrown);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "KhakiRose", {
            /**
             * Khaki Rose (#C5908E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.KhakiRose);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkBow", {
            /**
             * Pink Bow (#C48189)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkBow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LipstickPink", {
            /**
             * Lipstick Pink (#C48793)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LipstickPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Rose", {
            /**
             * Rose (#E8ADAA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Rose);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RoseGold", {
            /**
             * Rose Gold (#ECC5C0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RoseGold);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DesertSand", {
            /**
             * Desert Sand (#EDC9AF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DesertSand);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PigPink", {
            /**
             * Pig Pink (#FDD7E4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PigPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CottonCandy", {
            /**
             * Cotton Candy (#FCDFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CottonCandy);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkBubbleGum", {
            /**
             * Pink Bubble Gum (#FFDFDD)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkBubbleGum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MistyRose", {
            /**
             * Misty Rose (#FBBBB9)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MistyRose);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Pink", {
            /**
             * Pink (#FAAFBE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Pink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LightPink", {
            /**
             * Light Pink (#FAAFBA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LightPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "FlamingoPink", {
            /**
             * Flamingo Pink (#F9A7B0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.FlamingoPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkRose", {
            /**
             * Pink Rose (#E7A1B0)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkRose);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkDaisy", {
            /**
             * Pink Daisy (#E799A3)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkDaisy);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CadillacPink", {
            /**
             * Cadillac Pink (#E38AAE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CadillacPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CarnationPink", {
            /**
             * Carnation Pink (#F778A1)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CarnationPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlushRed", {
            /**
             * Blush Red (#E56E94)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlushRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HotPink", {
            /**
             * Hot Pink (#F660AB)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HotPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "WatermelonPink", {
            /**
             * Watermelon Pink (#FC6C85)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.WatermelonPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "VioletRed", {
            /**
             * Violet Red (#F6358A)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.VioletRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DeepPink", {
            /**
             * Deep Pink (#F52887)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DeepPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkCupcake", {
            /**
             * Pink Cupcake (#E45E9D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkCupcake);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PinkLemonade", {
            /**
             * Pink Lemonade (#E4287C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PinkLemonade);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "NeonPink", {
            /**
             * Neon Pink (#F535AA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.NeonPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Magenta", {
            /**
             * Magenta (#FF00FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Magenta);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DimorphothecaMagenta", {
            /**
             * Dimorphotheca Magenta (#E3319D)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DimorphothecaMagenta);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BrightNeonPink", {
            /**
             * Bright Neon Pink (#F433FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BrightNeonPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PaleVioletRed", {
            /**
             * Pale Violet Red (#D16587)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PaleVioletRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TulipPink", {
            /**
             * Tulip Pink (#C25A7C)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TulipPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumVioletRed", {
            /**
             * Medium Violet Red (#CA226B)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumVioletRed);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "RoguePink", {
            /**
             * Rogue Pink (#C12869)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.RoguePink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BurntPink", {
            /**
             * Burnt Pink (#C12267)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BurntPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BashfulPink", {
            /**
             * Bashful Pink (#C25283)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BashfulPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkCarnationPink", {
            /**
             * Dark Carnation Pink (#C12283)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkCarnationPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Plum", {
            /**
             * Plum (#B93B8F)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Plum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "ViolaPurple", {
            /**
             * Viola Purple (#7E587E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.ViolaPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleIris", {
            /**
             * Purple Iris (#571B7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleIris);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PlumPurple", {
            /**
             * Plum Purple (#583759)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PlumPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Indigo", {
            /**
             * Indigo (#4B0082)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Indigo);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleMonster", {
            /**
             * Purple Monster (#461B7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleMonster);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleHaze", {
            /**
             * Purple Haze (#4E387E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleHaze);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Eggplant", {
            /**
             * Eggplant (#614051)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Eggplant);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Grape", {
            /**
             * Grape (#5E5A80)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Grape);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleJam", {
            /**
             * Purple Jam (#6A287E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleJam);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkOrchid", {
            /**
             * Dark Orchid (#7D1B7E)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkOrchid);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleFlower", {
            /**
             * Purple Flower (#A74AC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleFlower);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumOrchid", {
            /**
             * Medium Orchid (#B048B5)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumOrchid);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleAmethyst", {
            /**
             * Purple Amethyst (#6C2DC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleAmethyst);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "DarkViolet", {
            /**
             * Dark Violet (#842DCE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.DarkViolet);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Violet", {
            /**
             * Violet (#8D38C9)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Violet);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleSageBush", {
            /**
             * Purple Sage Bush (#7A5DC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleSageBush);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LovelyPurple", {
            /**
             * Lovely Purple (#7F38EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LovelyPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Purple", {
            /**
             * Purple (#8E35EF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Purple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "AztechPurple", {
            /**
             * Aztech Purple (#893BFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.AztechPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MediumPurple", {
            /**
             * Medium Purple (#8467D7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MediumPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "JasminePurple", {
            /**
             * Jasmine Purple (#A23BEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.JasminePurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleDaffodil", {
            /**
             * Purple Daffodil (#B041FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleDaffodil);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "TyrianPurple", {
            /**
             * Tyrian Purple (#C45AEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.TyrianPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "CrocusPurple", {
            /**
             * Crocus Purple (#9172EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.CrocusPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleMimosa", {
            /**
             * Purple Mimosa (#9E7BFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleMimosa);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "HeliotropePurple", {
            /**
             * Heliotrope Purple (#D462FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.HeliotropePurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Crimson", {
            /**
             * Crimson (#E238EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Crimson);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "PurpleDragon", {
            /**
             * Purple Dragon (#C38EC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.PurpleDragon);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Lilac", {
            /**
             * Lilac (#C8A2C8)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Lilac);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlushPink", {
            /**
             * Blush Pink (#E6A9EC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlushPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Mauve", {
            /**
             * Mauve (#E0B0FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Mauve);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "WisteriaPurple", {
            /**
             * Wisteria Purple (#C6AEC7)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.WisteriaPurple);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "BlossomPink", {
            /**
             * Blossom Pink (#F9B7FF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.BlossomPink);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Thistle", {
            /**
             * Thistle (#D2B9D3)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Thistle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Periwinkle", {
            /**
             * Periwinkle (#E9CFEC)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Periwinkle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "LavenderPinocchio", {
            /**
             * Lavender Pinocchio (#EBDDE2)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.LavenderPinocchio);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Lavenderblue", {
            /**
             * Lavender blue (#E3E4FA)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Lavenderblue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "Pearl", {
            /**
             * Pearl (#FDEEF4)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.Pearl);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "SeaShell", {
            /**
             * SeaShell (#FFF5EE)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.SeaShell);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "MilkWhite", {
            /**
             * Milk White (#FEFCFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.MilkWhite);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Brushes, "White", {
            /**
             * White (#FFFFFF)
            */
            get: function () {
                return Canvas.Color.FromHtmlColor(Canvas.White);
            },
            enumerable: true,
            configurable: true
        });
        return Brushes;
    }());
    Canvas.Brushes = Brushes;
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    /**
     * Black (#000000)
    */
    Canvas.Black = "#000000";
    /**
     * Night (#0C090A)
    */
    Canvas.Night = "#0C090A";
    /**
     * Gunmetal (#2C3539)
    */
    Canvas.Gunmetal = "#2C3539";
    /**
     * Midnight (#2B1B17)
    */
    Canvas.Midnight = "#2B1B17";
    /**
     * Charcoal (#34282C)
    */
    Canvas.Charcoal = "#34282C";
    /**
     * Dark Slate Grey (#25383C)
    */
    Canvas.DarkSlateGrey = "#25383C";
    /**
     * Oil (#3B3131)
    */
    Canvas.Oil = "#3B3131";
    /**
     * Black Cat (#413839)
    */
    Canvas.BlackCat = "#413839";
    /**
     * Iridium (#3D3C3A)
    */
    Canvas.Iridium = "#3D3C3A";
    /**
     * Black Eel (#463E3F)
    */
    Canvas.BlackEel = "#463E3F";
    /**
     * Black Cow (#4C4646)
    */
    Canvas.BlackCow = "#4C4646";
    /**
     * Gray Wolf (#504A4B)
    */
    Canvas.GrayWolf = "#504A4B";
    /**
     * Vampire Gray (#565051)
    */
    Canvas.VampireGray = "#565051";
    /**
     * Gray Dolphin (#5C5858)
    */
    Canvas.GrayDolphin = "#5C5858";
    /**
     * Carbon Gray (#625D5D)
    */
    Canvas.CarbonGray = "#625D5D";
    /**
     * Ash Gray (#666362)
    */
    Canvas.AshGray = "#666362";
    /**
     * Cloudy Gray (#6D6968)
    */
    Canvas.CloudyGray = "#6D6968";
    /**
     * Smokey Gray (#726E6D)
    */
    Canvas.SmokeyGray = "#726E6D";
    /**
     * Gray (#736F6E)
    */
    Canvas.Gray = "#736F6E";
    /**
     * Granite (#837E7C)
    */
    Canvas.Granite = "#837E7C";
    /**
     * Battleship Gray (#848482)
    */
    Canvas.BattleshipGray = "#848482";
    /**
     * Gray Cloud (#B6B6B4)
    */
    Canvas.GrayCloud = "#B6B6B4";
    /**
     * Gray Goose (#D1D0CE)
    */
    Canvas.GrayGoose = "#D1D0CE";
    /**
     * Platinum (#E5E4E2)
    */
    Canvas.Platinum = "#E5E4E2";
    /**
     * Metallic Silver (#BCC6CC)
    */
    Canvas.MetallicSilver = "#BCC6CC";
    /**
     * Blue Gray (#98AFC7)
    */
    Canvas.BlueGray = "#98AFC7";
    /**
     * Light Slate Gray (#6D7B8D)
    */
    Canvas.LightSlateGray = "#6D7B8D";
    /**
     * Slate Gray (#657383)
    */
    Canvas.SlateGray = "#657383";
    /**
     * Jet Gray (#616D7E)
    */
    Canvas.JetGray = "#616D7E";
    /**
     * Mist Blue (#646D7E)
    */
    Canvas.MistBlue = "#646D7E";
    /**
     * Marble Blue (#566D7E)
    */
    Canvas.MarbleBlue = "#566D7E";
    /**
     * Slate Blue (#737CA1)
    */
    Canvas.SlateBlue = "#737CA1";
    /**
     * Steel Blue (#4863A0)
    */
    Canvas.SteelBlue = "#4863A0";
    /**
     * Blue Jay (#2B547E)
    */
    Canvas.BlueJay = "#2B547E";
    /**
     * Dark Slate Blue (#2B3856)
    */
    Canvas.DarkSlateBlue = "#2B3856";
    /**
     * Midnight Blue (#151B54)
    */
    Canvas.MidnightBlue = "#151B54";
    /**
     * Navy Blue (#000080)
    */
    Canvas.NavyBlue = "#000080";
    /**
     * Blue Whale (#342D7E)
    */
    Canvas.BlueWhale = "#342D7E";
    /**
     * Lapis Blue (#15317E)
    */
    Canvas.LapisBlue = "#15317E";
    /**
     * Denim Dark Blue (#151B8D)
    */
    Canvas.DenimDarkBlue = "#151B8D";
    /**
     * Earth Blue (#0000A0)
    */
    Canvas.EarthBlue = "#0000A0";
    /**
     * Cobalt Blue (#0020C2)
    */
    Canvas.CobaltBlue = "#0020C2";
    /**
     * Blueberry Blue (#0041C2)
    */
    Canvas.BlueberryBlue = "#0041C2";
    /**
     * Sapphire Blue (#2554C7)
    */
    Canvas.SapphireBlue = "#2554C7";
    /**
     * Blue Eyes (#1569C7)
    */
    Canvas.BlueEyes = "#1569C7";
    /**
     * Royal Blue (#2B60DE)
    */
    Canvas.RoyalBlue = "#2B60DE";
    /**
     * Blue Orchid (#1F45FC)
    */
    Canvas.BlueOrchid = "#1F45FC";
    /**
     * Blue Lotus (#6960EC)
    */
    Canvas.BlueLotus = "#6960EC";
    /**
     * Light Slate Blue (#736AFF)
    */
    Canvas.LightSlateBlue = "#736AFF";
    /**
     * Windows Blue (#357EC7)
    */
    Canvas.WindowsBlue = "#357EC7";
    /**
     * Glacial Blue Ice (#368BC1)
    */
    Canvas.GlacialBlueIce = "#368BC1";
    /**
     * Silk Blue (#488AC7)
    */
    Canvas.SilkBlue = "#488AC7";
    /**
     * Blue Ivy (#3090C7)
    */
    Canvas.BlueIvy = "#3090C7";
    /**
     * Blue Koi (#659EC7)
    */
    Canvas.BlueKoi = "#659EC7";
    /**
     * Columbia Blue (#87AFC7)
    */
    Canvas.ColumbiaBlue = "#87AFC7";
    /**
     * Baby Blue (#95B9C7)
    */
    Canvas.BabyBlue = "#95B9C7";
    /**
     * Light Steel Blue (#728FCE)
    */
    Canvas.LightSteelBlue = "#728FCE";
    /**
     * Ocean Blue (#2B65EC)
    */
    Canvas.OceanBlue = "#2B65EC";
    /**
     * Blue Ribbon (#306EFF)
    */
    Canvas.BlueRibbon = "#306EFF";
    /**
     * Blue Dress (#157DEC)
    */
    Canvas.BlueDress = "#157DEC";
    /**
     * Dodger Blue (#1589FF)
    */
    Canvas.DodgerBlue = "#1589FF";
    /**
     * Cornflower Blue (#6495ED)
    */
    Canvas.CornflowerBlue = "#6495ED";
    /**
     * Sky Blue (#6698FF)
    */
    Canvas.SkyBlue = "#6698FF";
    /**
     * Butterfly Blue (#38ACEC)
    */
    Canvas.ButterflyBlue = "#38ACEC";
    /**
     * Iceberg (#56A5EC)
    */
    Canvas.Iceberg = "#56A5EC";
    /**
     * Crystal Blue (#5CB3FF)
    */
    Canvas.CrystalBlue = "#5CB3FF";
    /**
     * Deep Sky Blue (#3BB9FF)
    */
    Canvas.DeepSkyBlue = "#3BB9FF";
    /**
     * Denim Blue (#79BAEC)
    */
    Canvas.DenimBlue = "#79BAEC";
    /**
     * Light Sky Blue (#82CAFA)
    */
    Canvas.LightSkyBlue = "#82CAFA";
    /**
     * Day Sky Blue (#82CAFF)
    */
    Canvas.DaySkyBlue = "#82CAFF";
    /**
     * Jeans Blue (#A0CFEC)
    */
    Canvas.JeansBlue = "#A0CFEC";
    /**
     * Blue Angel (#B7CEEC)
    */
    Canvas.BlueAngel = "#B7CEEC";
    /**
     * Pastel Blue (#B4CFEC)
    */
    Canvas.PastelBlue = "#B4CFEC";
    /**
     * Sea Blue (#C2DFFF)
    */
    Canvas.SeaBlue = "#C2DFFF";
    /**
     * Powder Blue (#C6DEFF)
    */
    Canvas.PowderBlue = "#C6DEFF";
    /**
     * Coral Blue (#AFDCEC)
    */
    Canvas.CoralBlue = "#AFDCEC";
    /**
     * Light Blue (#ADDFFF)
    */
    Canvas.LightBlue = "#ADDFFF";
    /**
     * Robin Egg Blue (#BDEDFF)
    */
    Canvas.RobinEggBlue = "#BDEDFF";
    /**
     * Pale Blue Lily (#CFECEC)
    */
    Canvas.PaleBlueLily = "#CFECEC";
    /**
     * Light Cyan (#E0FFFF)
    */
    Canvas.LightCyan = "#E0FFFF";
    /**
     * Water (#EBF4FA)
    */
    Canvas.Water = "#EBF4FA";
    /**
     * AliceBlue (#F0F8FF)
    */
    Canvas.AliceBlue = "#F0F8FF";
    /**
     * Azure (#F0FFFF)
    */
    Canvas.Azure = "#F0FFFF";
    /**
     * Light Slate (#CCFFFF)
    */
    Canvas.LightSlate = "#CCFFFF";
    /**
     * Light Aquamarine (#93FFE8)
    */
    Canvas.LightAquamarine = "#93FFE8";
    /**
     * Electric Blue (#9AFEFF)
    */
    Canvas.ElectricBlue = "#9AFEFF";
    /**
     * Aquamarine (#7FFFD4)
    */
    Canvas.Aquamarine = "#7FFFD4";
    /**
     * Cyan or Aqua (#00FFFF)
    */
    Canvas.CyanorAqua = "#00FFFF";
    /**
     * Tron Blue (#7DFDFE)
    */
    Canvas.TronBlue = "#7DFDFE";
    /**
     * Blue Zircon (#57FEFF)
    */
    Canvas.BlueZircon = "#57FEFF";
    /**
     * Blue Lagoon (#8EEBEC)
    */
    Canvas.BlueLagoon = "#8EEBEC";
    /**
     * Celeste (#50EBEC)
    */
    Canvas.Celeste = "#50EBEC";
    /**
     * Blue Diamond (#4EE2EC)
    */
    Canvas.BlueDiamond = "#4EE2EC";
    /**
     * Tiffany Blue (#81D8D0)
    */
    Canvas.TiffanyBlue = "#81D8D0";
    /**
     * Cyan Opaque (#92C7C7)
    */
    Canvas.CyanOpaque = "#92C7C7";
    /**
     * Blue Hosta (#77BFC7)
    */
    Canvas.BlueHosta = "#77BFC7";
    /**
     * Northern Lights Blue (#78C7C7)
    */
    Canvas.NorthernLightsBlue = "#78C7C7";
    /**
     * Medium Turquoise (#48CCCD)
    */
    Canvas.MediumTurquoise = "#48CCCD";
    /**
     * Turquoise (#43C6DB)
    */
    Canvas.Turquoise = "#43C6DB";
    /**
     * Jellyfish (#46C7C7)
    */
    Canvas.Jellyfish = "#46C7C7";
    /**
     * Blue green (#7BCCB5)
    */
    Canvas.Bluegreen = "#7BCCB5";
    /**
     * Macaw Blue Green (#43BFC7)
    */
    Canvas.MacawBlueGreen = "#43BFC7";
    /**
     * Light Sea Green (#3EA99F)
    */
    Canvas.LightSeaGreen = "#3EA99F";
    /**
     * Dark Turquoise (#3B9C9C)
    */
    Canvas.DarkTurquoise = "#3B9C9C";
    /**
     * Sea Turtle Green (#438D80)
    */
    Canvas.SeaTurtleGreen = "#438D80";
    /**
     * Medium Aquamarine (#348781)
    */
    Canvas.MediumAquamarine = "#348781";
    /**
     * Greenish Blue (#307D7E)
    */
    Canvas.GreenishBlue = "#307D7E";
    /**
     * Grayish Turquoise (#5E7D7E)
    */
    Canvas.GrayishTurquoise = "#5E7D7E";
    /**
     * Beetle Green (#4C787E)
    */
    Canvas.BeetleGreen = "#4C787E";
    /**
     * Teal (#008080)
    */
    Canvas.Teal = "#008080";
    /**
     * Sea Green (#4E8975)
    */
    Canvas.SeaGreen = "#4E8975";
    /**
     * Camouflage Green (#78866B)
    */
    Canvas.CamouflageGreen = "#78866B";
    /**
     * Sage Green (#848b79)
    */
    Canvas.SageGreen = "#848b79";
    /**
     * Hazel Green (#617C58)
    */
    Canvas.HazelGreen = "#617C58";
    /**
     * Venom Green (#728C00)
    */
    Canvas.VenomGreen = "#728C00";
    /**
     * Fern Green (#667C26)
    */
    Canvas.FernGreen = "#667C26";
    /**
     * Dark Forest Green (#254117)
    */
    Canvas.DarkForestGreen = "#254117";
    /**
     * Medium Sea Green (#306754)
    */
    Canvas.MediumSeaGreen = "#306754";
    /**
     * Medium Forest Green (#347235)
    */
    Canvas.MediumForestGreen = "#347235";
    /**
     * Seaweed Green (#437C17)
    */
    Canvas.SeaweedGreen = "#437C17";
    /**
     * Pine Green (#387C44)
    */
    Canvas.PineGreen = "#387C44";
    /**
     * Jungle Green (#347C2C)
    */
    Canvas.JungleGreen = "#347C2C";
    /**
     * Shamrock Green (#347C17)
    */
    Canvas.ShamrockGreen = "#347C17";
    /**
     * Medium Spring Green (#348017)
    */
    Canvas.MediumSpringGreen = "#348017";
    /**
     * Forest Green (#4E9258)
    */
    Canvas.ForestGreen = "#4E9258";
    /**
     * Green Onion (#6AA121)
    */
    Canvas.GreenOnion = "#6AA121";
    /**
     * Spring Green (#4AA02C)
    */
    Canvas.SpringGreen = "#4AA02C";
    /**
     * Lime Green (#41A317)
    */
    Canvas.LimeGreen = "#41A317";
    /**
     * Clover Green (#3EA055)
    */
    Canvas.CloverGreen = "#3EA055";
    /**
     * Green Snake (#6CBB3C)
    */
    Canvas.GreenSnake = "#6CBB3C";
    /**
     * Alien Green (#6CC417)
    */
    Canvas.AlienGreen = "#6CC417";
    /**
     * Green Apple (#4CC417)
    */
    Canvas.GreenApple = "#4CC417";
    /**
     * Yellow Green (#52D017)
    */
    Canvas.YellowGreen = "#52D017";
    /**
     * Kelly Green (#4CC552)
    */
    Canvas.KellyGreen = "#4CC552";
    /**
     * Zombie Green (#54C571)
    */
    Canvas.ZombieGreen = "#54C571";
    /**
     * Frog Green (#99C68E)
    */
    Canvas.FrogGreen = "#99C68E";
    /**
     * Green Peas (#89C35C)
    */
    Canvas.GreenPeas = "#89C35C";
    /**
     * Dollar Bill Green (#85BB65)
    */
    Canvas.DollarBillGreen = "#85BB65";
    /**
     * Dark Sea Green (#8BB381)
    */
    Canvas.DarkSeaGreen = "#8BB381";
    /**
     * Iguana Green (#9CB071)
    */
    Canvas.IguanaGreen = "#9CB071";
    /**
     * Avocado Green (#B2C248)
    */
    Canvas.AvocadoGreen = "#B2C248";
    /**
     * Pistachio Green (#9DC209)
    */
    Canvas.PistachioGreen = "#9DC209";
    /**
     * Salad Green (#A1C935)
    */
    Canvas.SaladGreen = "#A1C935";
    /**
     * Hummingbird Green (#7FE817)
    */
    Canvas.HummingbirdGreen = "#7FE817";
    /**
     * Nebula Green (#59E817)
    */
    Canvas.NebulaGreen = "#59E817";
    /**
     * Stoplight Go Green (#57E964)
    */
    Canvas.StoplightGoGreen = "#57E964";
    /**
     * Algae Green (#64E986)
    */
    Canvas.AlgaeGreen = "#64E986";
    /**
     * Jade Green (#5EFB6E)
    */
    Canvas.JadeGreen = "#5EFB6E";
    /**
     * Green (#00FF00)
    */
    Canvas.Green = "#00FF00";
    /**
     * Emerald Green (#5FFB17)
    */
    Canvas.EmeraldGreen = "#5FFB17";
    /**
     * Lawn Green (#87F717)
    */
    Canvas.LawnGreen = "#87F717";
    /**
     * Chartreuse (#8AFB17)
    */
    Canvas.Chartreuse = "#8AFB17";
    /**
     * Dragon Green (#6AFB92)
    */
    Canvas.DragonGreen = "#6AFB92";
    /**
     * Mint green (#98FF98)
    */
    Canvas.Mintgreen = "#98FF98";
    /**
     * Green Thumb (#B5EAAA)
    */
    Canvas.GreenThumb = "#B5EAAA";
    /**
     * Light Jade (#C3FDB8)
    */
    Canvas.LightJade = "#C3FDB8";
    /**
     * Tea Green (#CCFB5D)
    */
    Canvas.TeaGreen = "#CCFB5D";
    /**
     * Green Yellow (#B1FB17)
    */
    Canvas.GreenYellow = "#B1FB17";
    /**
     * Slime Green (#BCE954)
    */
    Canvas.SlimeGreen = "#BCE954";
    /**
     * Goldenrod (#EDDA74)
    */
    Canvas.Goldenrod = "#EDDA74";
    /**
     * Harvest Gold (#EDE275)
    */
    Canvas.HarvestGold = "#EDE275";
    /**
     * Sun Yellow (#FFE87C)
    */
    Canvas.SunYellow = "#FFE87C";
    /**
     * Yellow (#FFFF00)
    */
    Canvas.Yellow = "#FFFF00";
    /**
     * Corn Yellow (#FFF380)
    */
    Canvas.CornYellow = "#FFF380";
    /**
     * Parchment (#FFFFC2)
    */
    Canvas.Parchment = "#FFFFC2";
    /**
     * Cream (#FFFFCC)
    */
    Canvas.Cream = "#FFFFCC";
    /**
     * Lemon Chiffon (#FFF8C6)
    */
    Canvas.LemonChiffon = "#FFF8C6";
    /**
     * Cornsilk (#FFF8DC)
    */
    Canvas.Cornsilk = "#FFF8DC";
    /**
     * Beige (#F5F5DC)
    */
    Canvas.Beige = "#F5F5DC";
    /**
     * Blonde (#FBF6D9)
    */
    Canvas.Blonde = "#FBF6D9";
    /**
     * AntiqueWhite (#FAEBD7)
    */
    Canvas.AntiqueWhite = "#FAEBD7";
    /**
     * Champagne (#F7E7CE)
    */
    Canvas.Champagne = "#F7E7CE";
    /**
     * BlanchedAlmond (#FFEBCD)
    */
    Canvas.BlanchedAlmond = "#FFEBCD";
    /**
     * Vanilla (#F3E5AB)
    */
    Canvas.Vanilla = "#F3E5AB";
    /**
     * Tan Brown (#ECE5B6)
    */
    Canvas.TanBrown = "#ECE5B6";
    /**
     * Peach (#FFE5B4)
    */
    Canvas.Peach = "#FFE5B4";
    /**
     * Mustard (#FFDB58)
    */
    Canvas.Mustard = "#FFDB58";
    /**
     * Rubber Ducky Yellow (#FFD801)
    */
    Canvas.RubberDuckyYellow = "#FFD801";
    /**
     * Bright Gold (#FDD017)
    */
    Canvas.BrightGold = "#FDD017";
    /**
     * Golden brown (#EAC117)
    */
    Canvas.Goldenbrown = "#EAC117";
    /**
     * Macaroni and Cheese (#F2BB66)
    */
    Canvas.MacaroniandCheese = "#F2BB66";
    /**
     * Saffron (#FBB917)
    */
    Canvas.Saffron = "#FBB917";
    /**
     * Beer (#FBB117)
    */
    Canvas.Beer = "#FBB117";
    /**
     * Cantaloupe (#FFA62F)
    */
    Canvas.Cantaloupe = "#FFA62F";
    /**
     * Bee Yellow (#E9AB17)
    */
    Canvas.BeeYellow = "#E9AB17";
    /**
     * Brown Sugar (#E2A76F)
    */
    Canvas.BrownSugar = "#E2A76F";
    /**
     * BurlyWood (#DEB887)
    */
    Canvas.BurlyWood = "#DEB887";
    /**
     * Deep Peach (#FFCBA4)
    */
    Canvas.DeepPeach = "#FFCBA4";
    /**
     * Ginger Brown (#C9BE62)
    */
    Canvas.GingerBrown = "#C9BE62";
    /**
     * School Bus Yellow (#E8A317)
    */
    Canvas.SchoolBusYellow = "#E8A317";
    /**
     * Sandy Brown (#EE9A4D)
    */
    Canvas.SandyBrown = "#EE9A4D";
    /**
     * Fall Leaf Brown (#C8B560)
    */
    Canvas.FallLeafBrown = "#C8B560";
    /**
     * Orange Gold (#D4A017)
    */
    Canvas.OrangeGold = "#D4A017";
    /**
     * Sand (#C2B280)
    */
    Canvas.Sand = "#C2B280";
    /**
     * Cookie Brown (#C7A317)
    */
    Canvas.CookieBrown = "#C7A317";
    /**
     * Caramel (#C68E17)
    */
    Canvas.Caramel = "#C68E17";
    /**
     * Brass (#B5A642)
    */
    Canvas.Brass = "#B5A642";
    /**
     * Khaki (#ADA96E)
    */
    Canvas.Khaki = "#ADA96E";
    /**
     * Camel brown (#C19A6B)
    */
    Canvas.Camelbrown = "#C19A6B";
    /**
     * Bronze (#CD7F32)
    */
    Canvas.Bronze = "#CD7F32";
    /**
     * Tiger Orange (#C88141)
    */
    Canvas.TigerOrange = "#C88141";
    /**
     * Cinnamon (#C58917)
    */
    Canvas.Cinnamon = "#C58917";
    /**
     * Bullet Shell (#AF9B60)
    */
    Canvas.BulletShell = "#AF9B60";
    /**
     * Dark Goldenrod (#AF7817)
    */
    Canvas.DarkGoldenrod = "#AF7817";
    /**
     * Copper (#B87333)
    */
    Canvas.Copper = "#B87333";
    /**
     * Wood (#966F33)
    */
    Canvas.Wood = "#966F33";
    /**
     * Oak Brown (#806517)
    */
    Canvas.OakBrown = "#806517";
    /**
     * Moccasin (#827839)
    */
    Canvas.Moccasin = "#827839";
    /**
     * Army Brown (#827B60)
    */
    Canvas.ArmyBrown = "#827B60";
    /**
     * Sandstone (#786D5F)
    */
    Canvas.Sandstone = "#786D5F";
    /**
     * Mocha (#493D26)
    */
    Canvas.Mocha = "#493D26";
    /**
     * Taupe (#483C32)
    */
    Canvas.Taupe = "#483C32";
    /**
     * Coffee (#6F4E37)
    */
    Canvas.Coffee = "#6F4E37";
    /**
     * Brown Bear (#835C3B)
    */
    Canvas.BrownBear = "#835C3B";
    /**
     * Red Dirt (#7F5217)
    */
    Canvas.RedDirt = "#7F5217";
    /**
     * Sepia (#7F462C)
    */
    Canvas.Sepia = "#7F462C";
    /**
     * Orange Salmon (#C47451)
    */
    Canvas.OrangeSalmon = "#C47451";
    /**
     * Rust (#C36241)
    */
    Canvas.Rust = "#C36241";
    /**
     * Red Fox (#C35817)
    */
    Canvas.RedFox = "#C35817";
    /**
     * Chocolate (#C85A17)
    */
    Canvas.Chocolate = "#C85A17";
    /**
     * Sedona (#CC6600)
    */
    Canvas.Sedona = "#CC6600";
    /**
     * Papaya Orange (#E56717)
    */
    Canvas.PapayaOrange = "#E56717";
    /**
     * Halloween Orange (#E66C2C)
    */
    Canvas.HalloweenOrange = "#E66C2C";
    /**
     * Pumpkin Orange (#F87217)
    */
    Canvas.PumpkinOrange = "#F87217";
    /**
     * Construction Cone Orange (#F87431)
    */
    Canvas.ConstructionConeOrange = "#F87431";
    /**
     * Sunrise Orange (#E67451)
    */
    Canvas.SunriseOrange = "#E67451";
    /**
     * Mango Orange (#FF8040)
    */
    Canvas.MangoOrange = "#FF8040";
    /**
     * Dark Orange (#F88017)
    */
    Canvas.DarkOrange = "#F88017";
    /**
     * Coral (#FF7F50)
    */
    Canvas.Coral = "#FF7F50";
    /**
     * Basket Ball Orange (#F88158)
    */
    Canvas.BasketBallOrange = "#F88158";
    /**
     * Light Salmon (#F9966B)
    */
    Canvas.LightSalmon = "#F9966B";
    /**
     * Tangerine (#E78A61)
    */
    Canvas.Tangerine = "#E78A61";
    /**
     * Dark Salmon (#E18B6B)
    */
    Canvas.DarkSalmon = "#E18B6B";
    /**
     * Light Coral (#E77471)
    */
    Canvas.LightCoral = "#E77471";
    /**
     * Bean Red (#F75D59)
    */
    Canvas.BeanRed = "#F75D59";
    /**
     * Valentine Red (#E55451)
    */
    Canvas.ValentineRed = "#E55451";
    /**
     * Shocking Orange (#E55B3C)
    */
    Canvas.ShockingOrange = "#E55B3C";
    /**
     * Red (#FF0000)
    */
    Canvas.Red = "#FF0000";
    /**
     * Scarlet (#FF2400)
    */
    Canvas.Scarlet = "#FF2400";
    /**
     * Ruby Red (#F62217)
    */
    Canvas.RubyRed = "#F62217";
    /**
     * Ferrari Red (#F70D1A)
    */
    Canvas.FerrariRed = "#F70D1A";
    /**
     * Fire Engine Red (#F62817)
    */
    Canvas.FireEngineRed = "#F62817";
    /**
     * Lava Red (#E42217)
    */
    Canvas.LavaRed = "#E42217";
    /**
     * Love Red (#E41B17)
    */
    Canvas.LoveRed = "#E41B17";
    /**
     * Grapefruit (#DC381F)
    */
    Canvas.Grapefruit = "#DC381F";
    /**
     * Chestnut Red (#C34A2C)
    */
    Canvas.ChestnutRed = "#C34A2C";
    /**
     * Cherry Red (#C24641)
    */
    Canvas.CherryRed = "#C24641";
    /**
     * Mahogany (#C04000)
    */
    Canvas.Mahogany = "#C04000";
    /**
     * Chilli Pepper (#C11B17)
    */
    Canvas.ChilliPepper = "#C11B17";
    /**
     * Cranberry (#9F000F)
    */
    Canvas.Cranberry = "#9F000F";
    /**
     * Red Wine (#990012)
    */
    Canvas.RedWine = "#990012";
    /**
     * Burgundy (#8C001A)
    */
    Canvas.Burgundy = "#8C001A";
    /**
     * Chestnut (#954535)
    */
    Canvas.Chestnut = "#954535";
    /**
     * Blood Red (#7E3517)
    */
    Canvas.BloodRed = "#7E3517";
    /**
     * Sienna (#8A4117)
    */
    Canvas.Sienna = "#8A4117";
    /**
     * Sangria (#7E3817)
    */
    Canvas.Sangria = "#7E3817";
    /**
     * Firebrick (#800517)
    */
    Canvas.Firebrick = "#800517";
    /**
     * Maroon (#810541)
    */
    Canvas.Maroon = "#810541";
    /**
     * Plum Pie (#7D0541)
    */
    Canvas.PlumPie = "#7D0541";
    /**
     * Velvet Maroon (#7E354D)
    */
    Canvas.VelvetMaroon = "#7E354D";
    /**
     * Plum Velvet (#7D0552)
    */
    Canvas.PlumVelvet = "#7D0552";
    /**
     * Rosy Finch (#7F4E52)
    */
    Canvas.RosyFinch = "#7F4E52";
    /**
     * Puce (#7F5A58)
    */
    Canvas.Puce = "#7F5A58";
    /**
     * Dull Purple (#7F525D)
    */
    Canvas.DullPurple = "#7F525D";
    /**
     * Rosy Brown (#B38481)
    */
    Canvas.RosyBrown = "#B38481";
    /**
     * Khaki Rose (#C5908E)
    */
    Canvas.KhakiRose = "#C5908E";
    /**
     * Pink Bow (#C48189)
    */
    Canvas.PinkBow = "#C48189";
    /**
     * Lipstick Pink (#C48793)
    */
    Canvas.LipstickPink = "#C48793";
    /**
     * Rose (#E8ADAA)
    */
    Canvas.Rose = "#E8ADAA";
    /**
     * Rose Gold (#ECC5C0)
    */
    Canvas.RoseGold = "#ECC5C0";
    /**
     * Desert Sand (#EDC9AF)
    */
    Canvas.DesertSand = "#EDC9AF";
    /**
     * Pig Pink (#FDD7E4)
    */
    Canvas.PigPink = "#FDD7E4";
    /**
     * Cotton Candy (#FCDFFF)
    */
    Canvas.CottonCandy = "#FCDFFF";
    /**
     * Pink Bubble Gum (#FFDFDD)
    */
    Canvas.PinkBubbleGum = "#FFDFDD";
    /**
     * Misty Rose (#FBBBB9)
    */
    Canvas.MistyRose = "#FBBBB9";
    /**
     * Pink (#FAAFBE)
    */
    Canvas.Pink = "#FAAFBE";
    /**
     * Light Pink (#FAAFBA)
    */
    Canvas.LightPink = "#FAAFBA";
    /**
     * Flamingo Pink (#F9A7B0)
    */
    Canvas.FlamingoPink = "#F9A7B0";
    /**
     * Pink Rose (#E7A1B0)
    */
    Canvas.PinkRose = "#E7A1B0";
    /**
     * Pink Daisy (#E799A3)
    */
    Canvas.PinkDaisy = "#E799A3";
    /**
     * Cadillac Pink (#E38AAE)
    */
    Canvas.CadillacPink = "#E38AAE";
    /**
     * Carnation Pink (#F778A1)
    */
    Canvas.CarnationPink = "#F778A1";
    /**
     * Blush Red (#E56E94)
    */
    Canvas.BlushRed = "#E56E94";
    /**
     * Hot Pink (#F660AB)
    */
    Canvas.HotPink = "#F660AB";
    /**
     * Watermelon Pink (#FC6C85)
    */
    Canvas.WatermelonPink = "#FC6C85";
    /**
     * Violet Red (#F6358A)
    */
    Canvas.VioletRed = "#F6358A";
    /**
     * Deep Pink (#F52887)
    */
    Canvas.DeepPink = "#F52887";
    /**
     * Pink Cupcake (#E45E9D)
    */
    Canvas.PinkCupcake = "#E45E9D";
    /**
     * Pink Lemonade (#E4287C)
    */
    Canvas.PinkLemonade = "#E4287C";
    /**
     * Neon Pink (#F535AA)
    */
    Canvas.NeonPink = "#F535AA";
    /**
     * Magenta (#FF00FF)
    */
    Canvas.Magenta = "#FF00FF";
    /**
     * Dimorphotheca Magenta (#E3319D)
    */
    Canvas.DimorphothecaMagenta = "#E3319D";
    /**
     * Bright Neon Pink (#F433FF)
    */
    Canvas.BrightNeonPink = "#F433FF";
    /**
     * Pale Violet Red (#D16587)
    */
    Canvas.PaleVioletRed = "#D16587";
    /**
     * Tulip Pink (#C25A7C)
    */
    Canvas.TulipPink = "#C25A7C";
    /**
     * Medium Violet Red (#CA226B)
    */
    Canvas.MediumVioletRed = "#CA226B";
    /**
     * Rogue Pink (#C12869)
    */
    Canvas.RoguePink = "#C12869";
    /**
     * Burnt Pink (#C12267)
    */
    Canvas.BurntPink = "#C12267";
    /**
     * Bashful Pink (#C25283)
    */
    Canvas.BashfulPink = "#C25283";
    /**
     * Dark Carnation Pink (#C12283)
    */
    Canvas.DarkCarnationPink = "#C12283";
    /**
     * Plum (#B93B8F)
    */
    Canvas.Plum = "#B93B8F";
    /**
     * Viola Purple (#7E587E)
    */
    Canvas.ViolaPurple = "#7E587E";
    /**
     * Purple Iris (#571B7E)
    */
    Canvas.PurpleIris = "#571B7E";
    /**
     * Plum Purple (#583759)
    */
    Canvas.PlumPurple = "#583759";
    /**
     * Indigo (#4B0082)
    */
    Canvas.Indigo = "#4B0082";
    /**
     * Purple Monster (#461B7E)
    */
    Canvas.PurpleMonster = "#461B7E";
    /**
     * Purple Haze (#4E387E)
    */
    Canvas.PurpleHaze = "#4E387E";
    /**
     * Eggplant (#614051)
    */
    Canvas.Eggplant = "#614051";
    /**
     * Grape (#5E5A80)
    */
    Canvas.Grape = "#5E5A80";
    /**
     * Purple Jam (#6A287E)
    */
    Canvas.PurpleJam = "#6A287E";
    /**
     * Dark Orchid (#7D1B7E)
    */
    Canvas.DarkOrchid = "#7D1B7E";
    /**
     * Purple Flower (#A74AC7)
    */
    Canvas.PurpleFlower = "#A74AC7";
    /**
     * Medium Orchid (#B048B5)
    */
    Canvas.MediumOrchid = "#B048B5";
    /**
     * Purple Amethyst (#6C2DC7)
    */
    Canvas.PurpleAmethyst = "#6C2DC7";
    /**
     * Dark Violet (#842DCE)
    */
    Canvas.DarkViolet = "#842DCE";
    /**
     * Violet (#8D38C9)
    */
    Canvas.Violet = "#8D38C9";
    /**
     * Purple Sage Bush (#7A5DC7)
    */
    Canvas.PurpleSageBush = "#7A5DC7";
    /**
     * Lovely Purple (#7F38EC)
    */
    Canvas.LovelyPurple = "#7F38EC";
    /**
     * Purple (#8E35EF)
    */
    Canvas.Purple = "#8E35EF";
    /**
     * Aztech Purple (#893BFF)
    */
    Canvas.AztechPurple = "#893BFF";
    /**
     * Medium Purple (#8467D7)
    */
    Canvas.MediumPurple = "#8467D7";
    /**
     * Jasmine Purple (#A23BEC)
    */
    Canvas.JasminePurple = "#A23BEC";
    /**
     * Purple Daffodil (#B041FF)
    */
    Canvas.PurpleDaffodil = "#B041FF";
    /**
     * Tyrian Purple (#C45AEC)
    */
    Canvas.TyrianPurple = "#C45AEC";
    /**
     * Crocus Purple (#9172EC)
    */
    Canvas.CrocusPurple = "#9172EC";
    /**
     * Purple Mimosa (#9E7BFF)
    */
    Canvas.PurpleMimosa = "#9E7BFF";
    /**
     * Heliotrope Purple (#D462FF)
    */
    Canvas.HeliotropePurple = "#D462FF";
    /**
     * Crimson (#E238EC)
    */
    Canvas.Crimson = "#E238EC";
    /**
     * Purple Dragon (#C38EC7)
    */
    Canvas.PurpleDragon = "#C38EC7";
    /**
     * Lilac (#C8A2C8)
    */
    Canvas.Lilac = "#C8A2C8";
    /**
     * Blush Pink (#E6A9EC)
    */
    Canvas.BlushPink = "#E6A9EC";
    /**
     * Mauve (#E0B0FF)
    */
    Canvas.Mauve = "#E0B0FF";
    /**
     * Wisteria Purple (#C6AEC7)
    */
    Canvas.WisteriaPurple = "#C6AEC7";
    /**
     * Blossom Pink (#F9B7FF)
    */
    Canvas.BlossomPink = "#F9B7FF";
    /**
     * Thistle (#D2B9D3)
    */
    Canvas.Thistle = "#D2B9D3";
    /**
     * Periwinkle (#E9CFEC)
    */
    Canvas.Periwinkle = "#E9CFEC";
    /**
     * Lavender Pinocchio (#EBDDE2)
    */
    Canvas.LavenderPinocchio = "#EBDDE2";
    /**
     * Lavender blue (#E3E4FA)
    */
    Canvas.Lavenderblue = "#E3E4FA";
    /**
     * Pearl (#FDEEF4)
    */
    Canvas.Pearl = "#FDEEF4";
    /**
     * SeaShell (#FFF5EE)
    */
    Canvas.SeaShell = "#FFF5EE";
    /**
     * Milk White (#FEFCFF)
    */
    Canvas.MilkWhite = "#FEFCFF";
    /**
     * White (#FFFFFF)
    */
    Canvas.White = "#FFFFFF";
})(Canvas || (Canvas = {}));
var Canvas;
(function (Canvas) {
    var Pens = /** @class */ (function () {
        function Pens() {
        }
        /**
         * Black (#000000)
        */
        Pens.Black = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Black, width);
        };
        /**
         * Night (#0C090A)
        */
        Pens.Night = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Night, width);
        };
        /**
         * Gunmetal (#2C3539)
        */
        Pens.Gunmetal = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Gunmetal, width);
        };
        /**
         * Midnight (#2B1B17)
        */
        Pens.Midnight = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Midnight, width);
        };
        /**
         * Charcoal (#34282C)
        */
        Pens.Charcoal = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Charcoal, width);
        };
        /**
         * Dark Slate Grey (#25383C)
        */
        Pens.DarkSlateGrey = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkSlateGrey, width);
        };
        /**
         * Oil (#3B3131)
        */
        Pens.Oil = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Oil, width);
        };
        /**
         * Black Cat (#413839)
        */
        Pens.BlackCat = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlackCat, width);
        };
        /**
         * Iridium (#3D3C3A)
        */
        Pens.Iridium = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Iridium, width);
        };
        /**
         * Black Eel (#463E3F)
        */
        Pens.BlackEel = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlackEel, width);
        };
        /**
         * Black Cow (#4C4646)
        */
        Pens.BlackCow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlackCow, width);
        };
        /**
         * Gray Wolf (#504A4B)
        */
        Pens.GrayWolf = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GrayWolf, width);
        };
        /**
         * Vampire Gray (#565051)
        */
        Pens.VampireGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.VampireGray, width);
        };
        /**
         * Gray Dolphin (#5C5858)
        */
        Pens.GrayDolphin = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GrayDolphin, width);
        };
        /**
         * Carbon Gray (#625D5D)
        */
        Pens.CarbonGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CarbonGray, width);
        };
        /**
         * Ash Gray (#666362)
        */
        Pens.AshGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AshGray, width);
        };
        /**
         * Cloudy Gray (#6D6968)
        */
        Pens.CloudyGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CloudyGray, width);
        };
        /**
         * Smokey Gray (#726E6D)
        */
        Pens.SmokeyGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SmokeyGray, width);
        };
        /**
         * Gray (#736F6E)
        */
        Pens.Gray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Gray, width);
        };
        /**
         * Granite (#837E7C)
        */
        Pens.Granite = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Granite, width);
        };
        /**
         * Battleship Gray (#848482)
        */
        Pens.BattleshipGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BattleshipGray, width);
        };
        /**
         * Gray Cloud (#B6B6B4)
        */
        Pens.GrayCloud = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GrayCloud, width);
        };
        /**
         * Gray Goose (#D1D0CE)
        */
        Pens.GrayGoose = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GrayGoose, width);
        };
        /**
         * Platinum (#E5E4E2)
        */
        Pens.Platinum = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Platinum, width);
        };
        /**
         * Metallic Silver (#BCC6CC)
        */
        Pens.MetallicSilver = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MetallicSilver, width);
        };
        /**
         * Blue Gray (#98AFC7)
        */
        Pens.BlueGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueGray, width);
        };
        /**
         * Light Slate Gray (#6D7B8D)
        */
        Pens.LightSlateGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSlateGray, width);
        };
        /**
         * Slate Gray (#657383)
        */
        Pens.SlateGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SlateGray, width);
        };
        /**
         * Jet Gray (#616D7E)
        */
        Pens.JetGray = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.JetGray, width);
        };
        /**
         * Mist Blue (#646D7E)
        */
        Pens.MistBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MistBlue, width);
        };
        /**
         * Marble Blue (#566D7E)
        */
        Pens.MarbleBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MarbleBlue, width);
        };
        /**
         * Slate Blue (#737CA1)
        */
        Pens.SlateBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SlateBlue, width);
        };
        /**
         * Steel Blue (#4863A0)
        */
        Pens.SteelBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SteelBlue, width);
        };
        /**
         * Blue Jay (#2B547E)
        */
        Pens.BlueJay = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueJay, width);
        };
        /**
         * Dark Slate Blue (#2B3856)
        */
        Pens.DarkSlateBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkSlateBlue, width);
        };
        /**
         * Midnight Blue (#151B54)
        */
        Pens.MidnightBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MidnightBlue, width);
        };
        /**
         * Navy Blue (#000080)
        */
        Pens.NavyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.NavyBlue, width);
        };
        /**
         * Blue Whale (#342D7E)
        */
        Pens.BlueWhale = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueWhale, width);
        };
        /**
         * Lapis Blue (#15317E)
        */
        Pens.LapisBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LapisBlue, width);
        };
        /**
         * Denim Dark Blue (#151B8D)
        */
        Pens.DenimDarkBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DenimDarkBlue, width);
        };
        /**
         * Earth Blue (#0000A0)
        */
        Pens.EarthBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.EarthBlue, width);
        };
        /**
         * Cobalt Blue (#0020C2)
        */
        Pens.CobaltBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CobaltBlue, width);
        };
        /**
         * Blueberry Blue (#0041C2)
        */
        Pens.BlueberryBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueberryBlue, width);
        };
        /**
         * Sapphire Blue (#2554C7)
        */
        Pens.SapphireBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SapphireBlue, width);
        };
        /**
         * Blue Eyes (#1569C7)
        */
        Pens.BlueEyes = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueEyes, width);
        };
        /**
         * Royal Blue (#2B60DE)
        */
        Pens.RoyalBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RoyalBlue, width);
        };
        /**
         * Blue Orchid (#1F45FC)
        */
        Pens.BlueOrchid = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueOrchid, width);
        };
        /**
         * Blue Lotus (#6960EC)
        */
        Pens.BlueLotus = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueLotus, width);
        };
        /**
         * Light Slate Blue (#736AFF)
        */
        Pens.LightSlateBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSlateBlue, width);
        };
        /**
         * Windows Blue (#357EC7)
        */
        Pens.WindowsBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.WindowsBlue, width);
        };
        /**
         * Glacial Blue Ice (#368BC1)
        */
        Pens.GlacialBlueIce = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GlacialBlueIce, width);
        };
        /**
         * Silk Blue (#488AC7)
        */
        Pens.SilkBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SilkBlue, width);
        };
        /**
         * Blue Ivy (#3090C7)
        */
        Pens.BlueIvy = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueIvy, width);
        };
        /**
         * Blue Koi (#659EC7)
        */
        Pens.BlueKoi = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueKoi, width);
        };
        /**
         * Columbia Blue (#87AFC7)
        */
        Pens.ColumbiaBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ColumbiaBlue, width);
        };
        /**
         * Baby Blue (#95B9C7)
        */
        Pens.BabyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BabyBlue, width);
        };
        /**
         * Light Steel Blue (#728FCE)
        */
        Pens.LightSteelBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSteelBlue, width);
        };
        /**
         * Ocean Blue (#2B65EC)
        */
        Pens.OceanBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.OceanBlue, width);
        };
        /**
         * Blue Ribbon (#306EFF)
        */
        Pens.BlueRibbon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueRibbon, width);
        };
        /**
         * Blue Dress (#157DEC)
        */
        Pens.BlueDress = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueDress, width);
        };
        /**
         * Dodger Blue (#1589FF)
        */
        Pens.DodgerBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DodgerBlue, width);
        };
        /**
         * Cornflower Blue (#6495ED)
        */
        Pens.CornflowerBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CornflowerBlue, width);
        };
        /**
         * Sky Blue (#6698FF)
        */
        Pens.SkyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SkyBlue, width);
        };
        /**
         * Butterfly Blue (#38ACEC)
        */
        Pens.ButterflyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ButterflyBlue, width);
        };
        /**
         * Iceberg (#56A5EC)
        */
        Pens.Iceberg = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Iceberg, width);
        };
        /**
         * Crystal Blue (#5CB3FF)
        */
        Pens.CrystalBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CrystalBlue, width);
        };
        /**
         * Deep Sky Blue (#3BB9FF)
        */
        Pens.DeepSkyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DeepSkyBlue, width);
        };
        /**
         * Denim Blue (#79BAEC)
        */
        Pens.DenimBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DenimBlue, width);
        };
        /**
         * Light Sky Blue (#82CAFA)
        */
        Pens.LightSkyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSkyBlue, width);
        };
        /**
         * Day Sky Blue (#82CAFF)
        */
        Pens.DaySkyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DaySkyBlue, width);
        };
        /**
         * Jeans Blue (#A0CFEC)
        */
        Pens.JeansBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.JeansBlue, width);
        };
        /**
         * Blue Angel (#B7CEEC)
        */
        Pens.BlueAngel = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueAngel, width);
        };
        /**
         * Pastel Blue (#B4CFEC)
        */
        Pens.PastelBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PastelBlue, width);
        };
        /**
         * Sea Blue (#C2DFFF)
        */
        Pens.SeaBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SeaBlue, width);
        };
        /**
         * Powder Blue (#C6DEFF)
        */
        Pens.PowderBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PowderBlue, width);
        };
        /**
         * Coral Blue (#AFDCEC)
        */
        Pens.CoralBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CoralBlue, width);
        };
        /**
         * Light Blue (#ADDFFF)
        */
        Pens.LightBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightBlue, width);
        };
        /**
         * Robin Egg Blue (#BDEDFF)
        */
        Pens.RobinEggBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RobinEggBlue, width);
        };
        /**
         * Pale Blue Lily (#CFECEC)
        */
        Pens.PaleBlueLily = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PaleBlueLily, width);
        };
        /**
         * Light Cyan (#E0FFFF)
        */
        Pens.LightCyan = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightCyan, width);
        };
        /**
         * Water (#EBF4FA)
        */
        Pens.Water = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Water, width);
        };
        /**
         * AliceBlue (#F0F8FF)
        */
        Pens.AliceBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AliceBlue, width);
        };
        /**
         * Azure (#F0FFFF)
        */
        Pens.Azure = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Azure, width);
        };
        /**
         * Light Slate (#CCFFFF)
        */
        Pens.LightSlate = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSlate, width);
        };
        /**
         * Light Aquamarine (#93FFE8)
        */
        Pens.LightAquamarine = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightAquamarine, width);
        };
        /**
         * Electric Blue (#9AFEFF)
        */
        Pens.ElectricBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ElectricBlue, width);
        };
        /**
         * Aquamarine (#7FFFD4)
        */
        Pens.Aquamarine = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Aquamarine, width);
        };
        /**
         * Cyan or Aqua (#00FFFF)
        */
        Pens.CyanorAqua = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CyanorAqua, width);
        };
        /**
         * Tron Blue (#7DFDFE)
        */
        Pens.TronBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TronBlue, width);
        };
        /**
         * Blue Zircon (#57FEFF)
        */
        Pens.BlueZircon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueZircon, width);
        };
        /**
         * Blue Lagoon (#8EEBEC)
        */
        Pens.BlueLagoon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueLagoon, width);
        };
        /**
         * Celeste (#50EBEC)
        */
        Pens.Celeste = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Celeste, width);
        };
        /**
         * Blue Diamond (#4EE2EC)
        */
        Pens.BlueDiamond = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueDiamond, width);
        };
        /**
         * Tiffany Blue (#81D8D0)
        */
        Pens.TiffanyBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TiffanyBlue, width);
        };
        /**
         * Cyan Opaque (#92C7C7)
        */
        Pens.CyanOpaque = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CyanOpaque, width);
        };
        /**
         * Blue Hosta (#77BFC7)
        */
        Pens.BlueHosta = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlueHosta, width);
        };
        /**
         * Northern Lights Blue (#78C7C7)
        */
        Pens.NorthernLightsBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.NorthernLightsBlue, width);
        };
        /**
         * Medium Turquoise (#48CCCD)
        */
        Pens.MediumTurquoise = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumTurquoise, width);
        };
        /**
         * Turquoise (#43C6DB)
        */
        Pens.Turquoise = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Turquoise, width);
        };
        /**
         * Jellyfish (#46C7C7)
        */
        Pens.Jellyfish = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Jellyfish, width);
        };
        /**
         * Blue green (#7BCCB5)
        */
        Pens.Bluegreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Bluegreen, width);
        };
        /**
         * Macaw Blue Green (#43BFC7)
        */
        Pens.MacawBlueGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MacawBlueGreen, width);
        };
        /**
         * Light Sea Green (#3EA99F)
        */
        Pens.LightSeaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSeaGreen, width);
        };
        /**
         * Dark Turquoise (#3B9C9C)
        */
        Pens.DarkTurquoise = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkTurquoise, width);
        };
        /**
         * Sea Turtle Green (#438D80)
        */
        Pens.SeaTurtleGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SeaTurtleGreen, width);
        };
        /**
         * Medium Aquamarine (#348781)
        */
        Pens.MediumAquamarine = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumAquamarine, width);
        };
        /**
         * Greenish Blue (#307D7E)
        */
        Pens.GreenishBlue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenishBlue, width);
        };
        /**
         * Grayish Turquoise (#5E7D7E)
        */
        Pens.GrayishTurquoise = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GrayishTurquoise, width);
        };
        /**
         * Beetle Green (#4C787E)
        */
        Pens.BeetleGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BeetleGreen, width);
        };
        /**
         * Teal (#008080)
        */
        Pens.Teal = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Teal, width);
        };
        /**
         * Sea Green (#4E8975)
        */
        Pens.SeaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SeaGreen, width);
        };
        /**
         * Camouflage Green (#78866B)
        */
        Pens.CamouflageGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CamouflageGreen, width);
        };
        /**
         * Sage Green (#848b79)
        */
        Pens.SageGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SageGreen, width);
        };
        /**
         * Hazel Green (#617C58)
        */
        Pens.HazelGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HazelGreen, width);
        };
        /**
         * Venom Green (#728C00)
        */
        Pens.VenomGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.VenomGreen, width);
        };
        /**
         * Fern Green (#667C26)
        */
        Pens.FernGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FernGreen, width);
        };
        /**
         * Dark Forest Green (#254117)
        */
        Pens.DarkForestGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkForestGreen, width);
        };
        /**
         * Medium Sea Green (#306754)
        */
        Pens.MediumSeaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumSeaGreen, width);
        };
        /**
         * Medium Forest Green (#347235)
        */
        Pens.MediumForestGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumForestGreen, width);
        };
        /**
         * Seaweed Green (#437C17)
        */
        Pens.SeaweedGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SeaweedGreen, width);
        };
        /**
         * Pine Green (#387C44)
        */
        Pens.PineGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PineGreen, width);
        };
        /**
         * Jungle Green (#347C2C)
        */
        Pens.JungleGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.JungleGreen, width);
        };
        /**
         * Shamrock Green (#347C17)
        */
        Pens.ShamrockGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ShamrockGreen, width);
        };
        /**
         * Medium Spring Green (#348017)
        */
        Pens.MediumSpringGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumSpringGreen, width);
        };
        /**
         * Forest Green (#4E9258)
        */
        Pens.ForestGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ForestGreen, width);
        };
        /**
         * Green Onion (#6AA121)
        */
        Pens.GreenOnion = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenOnion, width);
        };
        /**
         * Spring Green (#4AA02C)
        */
        Pens.SpringGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SpringGreen, width);
        };
        /**
         * Lime Green (#41A317)
        */
        Pens.LimeGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LimeGreen, width);
        };
        /**
         * Clover Green (#3EA055)
        */
        Pens.CloverGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CloverGreen, width);
        };
        /**
         * Green Snake (#6CBB3C)
        */
        Pens.GreenSnake = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenSnake, width);
        };
        /**
         * Alien Green (#6CC417)
        */
        Pens.AlienGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AlienGreen, width);
        };
        /**
         * Green Apple (#4CC417)
        */
        Pens.GreenApple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenApple, width);
        };
        /**
         * Yellow Green (#52D017)
        */
        Pens.YellowGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.YellowGreen, width);
        };
        /**
         * Kelly Green (#4CC552)
        */
        Pens.KellyGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.KellyGreen, width);
        };
        /**
         * Zombie Green (#54C571)
        */
        Pens.ZombieGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ZombieGreen, width);
        };
        /**
         * Frog Green (#99C68E)
        */
        Pens.FrogGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FrogGreen, width);
        };
        /**
         * Green Peas (#89C35C)
        */
        Pens.GreenPeas = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenPeas, width);
        };
        /**
         * Dollar Bill Green (#85BB65)
        */
        Pens.DollarBillGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DollarBillGreen, width);
        };
        /**
         * Dark Sea Green (#8BB381)
        */
        Pens.DarkSeaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkSeaGreen, width);
        };
        /**
         * Iguana Green (#9CB071)
        */
        Pens.IguanaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.IguanaGreen, width);
        };
        /**
         * Avocado Green (#B2C248)
        */
        Pens.AvocadoGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AvocadoGreen, width);
        };
        /**
         * Pistachio Green (#9DC209)
        */
        Pens.PistachioGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PistachioGreen, width);
        };
        /**
         * Salad Green (#A1C935)
        */
        Pens.SaladGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SaladGreen, width);
        };
        /**
         * Hummingbird Green (#7FE817)
        */
        Pens.HummingbirdGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HummingbirdGreen, width);
        };
        /**
         * Nebula Green (#59E817)
        */
        Pens.NebulaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.NebulaGreen, width);
        };
        /**
         * Stoplight Go Green (#57E964)
        */
        Pens.StoplightGoGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.StoplightGoGreen, width);
        };
        /**
         * Algae Green (#64E986)
        */
        Pens.AlgaeGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AlgaeGreen, width);
        };
        /**
         * Jade Green (#5EFB6E)
        */
        Pens.JadeGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.JadeGreen, width);
        };
        /**
         * Green (#00FF00)
        */
        Pens.Green = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Green, width);
        };
        /**
         * Emerald Green (#5FFB17)
        */
        Pens.EmeraldGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.EmeraldGreen, width);
        };
        /**
         * Lawn Green (#87F717)
        */
        Pens.LawnGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LawnGreen, width);
        };
        /**
         * Chartreuse (#8AFB17)
        */
        Pens.Chartreuse = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Chartreuse, width);
        };
        /**
         * Dragon Green (#6AFB92)
        */
        Pens.DragonGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DragonGreen, width);
        };
        /**
         * Mint green (#98FF98)
        */
        Pens.Mintgreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Mintgreen, width);
        };
        /**
         * Green Thumb (#B5EAAA)
        */
        Pens.GreenThumb = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenThumb, width);
        };
        /**
         * Light Jade (#C3FDB8)
        */
        Pens.LightJade = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightJade, width);
        };
        /**
         * Tea Green (#CCFB5D)
        */
        Pens.TeaGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TeaGreen, width);
        };
        /**
         * Green Yellow (#B1FB17)
        */
        Pens.GreenYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GreenYellow, width);
        };
        /**
         * Slime Green (#BCE954)
        */
        Pens.SlimeGreen = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SlimeGreen, width);
        };
        /**
         * Goldenrod (#EDDA74)
        */
        Pens.Goldenrod = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Goldenrod, width);
        };
        /**
         * Harvest Gold (#EDE275)
        */
        Pens.HarvestGold = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HarvestGold, width);
        };
        /**
         * Sun Yellow (#FFE87C)
        */
        Pens.SunYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SunYellow, width);
        };
        /**
         * Yellow (#FFFF00)
        */
        Pens.Yellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Yellow, width);
        };
        /**
         * Corn Yellow (#FFF380)
        */
        Pens.CornYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CornYellow, width);
        };
        /**
         * Parchment (#FFFFC2)
        */
        Pens.Parchment = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Parchment, width);
        };
        /**
         * Cream (#FFFFCC)
        */
        Pens.Cream = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Cream, width);
        };
        /**
         * Lemon Chiffon (#FFF8C6)
        */
        Pens.LemonChiffon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LemonChiffon, width);
        };
        /**
         * Cornsilk (#FFF8DC)
        */
        Pens.Cornsilk = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Cornsilk, width);
        };
        /**
         * Beige (#F5F5DC)
        */
        Pens.Beige = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Beige, width);
        };
        /**
         * Blonde (#FBF6D9)
        */
        Pens.Blonde = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Blonde, width);
        };
        /**
         * AntiqueWhite (#FAEBD7)
        */
        Pens.AntiqueWhite = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AntiqueWhite, width);
        };
        /**
         * Champagne (#F7E7CE)
        */
        Pens.Champagne = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Champagne, width);
        };
        /**
         * BlanchedAlmond (#FFEBCD)
        */
        Pens.BlanchedAlmond = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlanchedAlmond, width);
        };
        /**
         * Vanilla (#F3E5AB)
        */
        Pens.Vanilla = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Vanilla, width);
        };
        /**
         * Tan Brown (#ECE5B6)
        */
        Pens.TanBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TanBrown, width);
        };
        /**
         * Peach (#FFE5B4)
        */
        Pens.Peach = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Peach, width);
        };
        /**
         * Mustard (#FFDB58)
        */
        Pens.Mustard = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Mustard, width);
        };
        /**
         * Rubber Ducky Yellow (#FFD801)
        */
        Pens.RubberDuckyYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RubberDuckyYellow, width);
        };
        /**
         * Bright Gold (#FDD017)
        */
        Pens.BrightGold = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BrightGold, width);
        };
        /**
         * Golden brown (#EAC117)
        */
        Pens.Goldenbrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Goldenbrown, width);
        };
        /**
         * Macaroni and Cheese (#F2BB66)
        */
        Pens.MacaroniandCheese = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MacaroniandCheese, width);
        };
        /**
         * Saffron (#FBB917)
        */
        Pens.Saffron = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Saffron, width);
        };
        /**
         * Beer (#FBB117)
        */
        Pens.Beer = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Beer, width);
        };
        /**
         * Cantaloupe (#FFA62F)
        */
        Pens.Cantaloupe = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Cantaloupe, width);
        };
        /**
         * Bee Yellow (#E9AB17)
        */
        Pens.BeeYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BeeYellow, width);
        };
        /**
         * Brown Sugar (#E2A76F)
        */
        Pens.BrownSugar = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BrownSugar, width);
        };
        /**
         * BurlyWood (#DEB887)
        */
        Pens.BurlyWood = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BurlyWood, width);
        };
        /**
         * Deep Peach (#FFCBA4)
        */
        Pens.DeepPeach = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DeepPeach, width);
        };
        /**
         * Ginger Brown (#C9BE62)
        */
        Pens.GingerBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.GingerBrown, width);
        };
        /**
         * School Bus Yellow (#E8A317)
        */
        Pens.SchoolBusYellow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SchoolBusYellow, width);
        };
        /**
         * Sandy Brown (#EE9A4D)
        */
        Pens.SandyBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SandyBrown, width);
        };
        /**
         * Fall Leaf Brown (#C8B560)
        */
        Pens.FallLeafBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FallLeafBrown, width);
        };
        /**
         * Orange Gold (#D4A017)
        */
        Pens.OrangeGold = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.OrangeGold, width);
        };
        /**
         * Sand (#C2B280)
        */
        Pens.Sand = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sand, width);
        };
        /**
         * Cookie Brown (#C7A317)
        */
        Pens.CookieBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CookieBrown, width);
        };
        /**
         * Caramel (#C68E17)
        */
        Pens.Caramel = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Caramel, width);
        };
        /**
         * Brass (#B5A642)
        */
        Pens.Brass = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Brass, width);
        };
        /**
         * Khaki (#ADA96E)
        */
        Pens.Khaki = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Khaki, width);
        };
        /**
         * Camel brown (#C19A6B)
        */
        Pens.Camelbrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Camelbrown, width);
        };
        /**
         * Bronze (#CD7F32)
        */
        Pens.Bronze = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Bronze, width);
        };
        /**
         * Tiger Orange (#C88141)
        */
        Pens.TigerOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TigerOrange, width);
        };
        /**
         * Cinnamon (#C58917)
        */
        Pens.Cinnamon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Cinnamon, width);
        };
        /**
         * Bullet Shell (#AF9B60)
        */
        Pens.BulletShell = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BulletShell, width);
        };
        /**
         * Dark Goldenrod (#AF7817)
        */
        Pens.DarkGoldenrod = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkGoldenrod, width);
        };
        /**
         * Copper (#B87333)
        */
        Pens.Copper = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Copper, width);
        };
        /**
         * Wood (#966F33)
        */
        Pens.Wood = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Wood, width);
        };
        /**
         * Oak Brown (#806517)
        */
        Pens.OakBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.OakBrown, width);
        };
        /**
         * Moccasin (#827839)
        */
        Pens.Moccasin = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Moccasin, width);
        };
        /**
         * Army Brown (#827B60)
        */
        Pens.ArmyBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ArmyBrown, width);
        };
        /**
         * Sandstone (#786D5F)
        */
        Pens.Sandstone = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sandstone, width);
        };
        /**
         * Mocha (#493D26)
        */
        Pens.Mocha = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Mocha, width);
        };
        /**
         * Taupe (#483C32)
        */
        Pens.Taupe = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Taupe, width);
        };
        /**
         * Coffee (#6F4E37)
        */
        Pens.Coffee = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Coffee, width);
        };
        /**
         * Brown Bear (#835C3B)
        */
        Pens.BrownBear = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BrownBear, width);
        };
        /**
         * Red Dirt (#7F5217)
        */
        Pens.RedDirt = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RedDirt, width);
        };
        /**
         * Sepia (#7F462C)
        */
        Pens.Sepia = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sepia, width);
        };
        /**
         * Orange Salmon (#C47451)
        */
        Pens.OrangeSalmon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.OrangeSalmon, width);
        };
        /**
         * Rust (#C36241)
        */
        Pens.Rust = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Rust, width);
        };
        /**
         * Red Fox (#C35817)
        */
        Pens.RedFox = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RedFox, width);
        };
        /**
         * Chocolate (#C85A17)
        */
        Pens.Chocolate = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Chocolate, width);
        };
        /**
         * Sedona (#CC6600)
        */
        Pens.Sedona = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sedona, width);
        };
        /**
         * Papaya Orange (#E56717)
        */
        Pens.PapayaOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PapayaOrange, width);
        };
        /**
         * Halloween Orange (#E66C2C)
        */
        Pens.HalloweenOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HalloweenOrange, width);
        };
        /**
         * Pumpkin Orange (#F87217)
        */
        Pens.PumpkinOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PumpkinOrange, width);
        };
        /**
         * Construction Cone Orange (#F87431)
        */
        Pens.ConstructionConeOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ConstructionConeOrange, width);
        };
        /**
         * Sunrise Orange (#E67451)
        */
        Pens.SunriseOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SunriseOrange, width);
        };
        /**
         * Mango Orange (#FF8040)
        */
        Pens.MangoOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MangoOrange, width);
        };
        /**
         * Dark Orange (#F88017)
        */
        Pens.DarkOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkOrange, width);
        };
        /**
         * Coral (#FF7F50)
        */
        Pens.Coral = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Coral, width);
        };
        /**
         * Basket Ball Orange (#F88158)
        */
        Pens.BasketBallOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BasketBallOrange, width);
        };
        /**
         * Light Salmon (#F9966B)
        */
        Pens.LightSalmon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightSalmon, width);
        };
        /**
         * Tangerine (#E78A61)
        */
        Pens.Tangerine = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Tangerine, width);
        };
        /**
         * Dark Salmon (#E18B6B)
        */
        Pens.DarkSalmon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkSalmon, width);
        };
        /**
         * Light Coral (#E77471)
        */
        Pens.LightCoral = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightCoral, width);
        };
        /**
         * Bean Red (#F75D59)
        */
        Pens.BeanRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BeanRed, width);
        };
        /**
         * Valentine Red (#E55451)
        */
        Pens.ValentineRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ValentineRed, width);
        };
        /**
         * Shocking Orange (#E55B3C)
        */
        Pens.ShockingOrange = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ShockingOrange, width);
        };
        /**
         * Red (#FF0000)
        */
        Pens.Red = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Red, width);
        };
        /**
         * Scarlet (#FF2400)
        */
        Pens.Scarlet = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Scarlet, width);
        };
        /**
         * Ruby Red (#F62217)
        */
        Pens.RubyRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RubyRed, width);
        };
        /**
         * Ferrari Red (#F70D1A)
        */
        Pens.FerrariRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FerrariRed, width);
        };
        /**
         * Fire Engine Red (#F62817)
        */
        Pens.FireEngineRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FireEngineRed, width);
        };
        /**
         * Lava Red (#E42217)
        */
        Pens.LavaRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LavaRed, width);
        };
        /**
         * Love Red (#E41B17)
        */
        Pens.LoveRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LoveRed, width);
        };
        /**
         * Grapefruit (#DC381F)
        */
        Pens.Grapefruit = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Grapefruit, width);
        };
        /**
         * Chestnut Red (#C34A2C)
        */
        Pens.ChestnutRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ChestnutRed, width);
        };
        /**
         * Cherry Red (#C24641)
        */
        Pens.CherryRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CherryRed, width);
        };
        /**
         * Mahogany (#C04000)
        */
        Pens.Mahogany = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Mahogany, width);
        };
        /**
         * Chilli Pepper (#C11B17)
        */
        Pens.ChilliPepper = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ChilliPepper, width);
        };
        /**
         * Cranberry (#9F000F)
        */
        Pens.Cranberry = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Cranberry, width);
        };
        /**
         * Red Wine (#990012)
        */
        Pens.RedWine = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RedWine, width);
        };
        /**
         * Burgundy (#8C001A)
        */
        Pens.Burgundy = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Burgundy, width);
        };
        /**
         * Chestnut (#954535)
        */
        Pens.Chestnut = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Chestnut, width);
        };
        /**
         * Blood Red (#7E3517)
        */
        Pens.BloodRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BloodRed, width);
        };
        /**
         * Sienna (#8A4117)
        */
        Pens.Sienna = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sienna, width);
        };
        /**
         * Sangria (#7E3817)
        */
        Pens.Sangria = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Sangria, width);
        };
        /**
         * Firebrick (#800517)
        */
        Pens.Firebrick = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Firebrick, width);
        };
        /**
         * Maroon (#810541)
        */
        Pens.Maroon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Maroon, width);
        };
        /**
         * Plum Pie (#7D0541)
        */
        Pens.PlumPie = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PlumPie, width);
        };
        /**
         * Velvet Maroon (#7E354D)
        */
        Pens.VelvetMaroon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.VelvetMaroon, width);
        };
        /**
         * Plum Velvet (#7D0552)
        */
        Pens.PlumVelvet = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PlumVelvet, width);
        };
        /**
         * Rosy Finch (#7F4E52)
        */
        Pens.RosyFinch = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RosyFinch, width);
        };
        /**
         * Puce (#7F5A58)
        */
        Pens.Puce = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Puce, width);
        };
        /**
         * Dull Purple (#7F525D)
        */
        Pens.DullPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DullPurple, width);
        };
        /**
         * Rosy Brown (#B38481)
        */
        Pens.RosyBrown = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RosyBrown, width);
        };
        /**
         * Khaki Rose (#C5908E)
        */
        Pens.KhakiRose = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.KhakiRose, width);
        };
        /**
         * Pink Bow (#C48189)
        */
        Pens.PinkBow = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkBow, width);
        };
        /**
         * Lipstick Pink (#C48793)
        */
        Pens.LipstickPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LipstickPink, width);
        };
        /**
         * Rose (#E8ADAA)
        */
        Pens.Rose = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Rose, width);
        };
        /**
         * Rose Gold (#ECC5C0)
        */
        Pens.RoseGold = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RoseGold, width);
        };
        /**
         * Desert Sand (#EDC9AF)
        */
        Pens.DesertSand = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DesertSand, width);
        };
        /**
         * Pig Pink (#FDD7E4)
        */
        Pens.PigPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PigPink, width);
        };
        /**
         * Cotton Candy (#FCDFFF)
        */
        Pens.CottonCandy = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CottonCandy, width);
        };
        /**
         * Pink Bubble Gum (#FFDFDD)
        */
        Pens.PinkBubbleGum = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkBubbleGum, width);
        };
        /**
         * Misty Rose (#FBBBB9)
        */
        Pens.MistyRose = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MistyRose, width);
        };
        /**
         * Pink (#FAAFBE)
        */
        Pens.Pink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Pink, width);
        };
        /**
         * Light Pink (#FAAFBA)
        */
        Pens.LightPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LightPink, width);
        };
        /**
         * Flamingo Pink (#F9A7B0)
        */
        Pens.FlamingoPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.FlamingoPink, width);
        };
        /**
         * Pink Rose (#E7A1B0)
        */
        Pens.PinkRose = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkRose, width);
        };
        /**
         * Pink Daisy (#E799A3)
        */
        Pens.PinkDaisy = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkDaisy, width);
        };
        /**
         * Cadillac Pink (#E38AAE)
        */
        Pens.CadillacPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CadillacPink, width);
        };
        /**
         * Carnation Pink (#F778A1)
        */
        Pens.CarnationPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CarnationPink, width);
        };
        /**
         * Blush Red (#E56E94)
        */
        Pens.BlushRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlushRed, width);
        };
        /**
         * Hot Pink (#F660AB)
        */
        Pens.HotPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HotPink, width);
        };
        /**
         * Watermelon Pink (#FC6C85)
        */
        Pens.WatermelonPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.WatermelonPink, width);
        };
        /**
         * Violet Red (#F6358A)
        */
        Pens.VioletRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.VioletRed, width);
        };
        /**
         * Deep Pink (#F52887)
        */
        Pens.DeepPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DeepPink, width);
        };
        /**
         * Pink Cupcake (#E45E9D)
        */
        Pens.PinkCupcake = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkCupcake, width);
        };
        /**
         * Pink Lemonade (#E4287C)
        */
        Pens.PinkLemonade = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PinkLemonade, width);
        };
        /**
         * Neon Pink (#F535AA)
        */
        Pens.NeonPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.NeonPink, width);
        };
        /**
         * Magenta (#FF00FF)
        */
        Pens.Magenta = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Magenta, width);
        };
        /**
         * Dimorphotheca Magenta (#E3319D)
        */
        Pens.DimorphothecaMagenta = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DimorphothecaMagenta, width);
        };
        /**
         * Bright Neon Pink (#F433FF)
        */
        Pens.BrightNeonPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BrightNeonPink, width);
        };
        /**
         * Pale Violet Red (#D16587)
        */
        Pens.PaleVioletRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PaleVioletRed, width);
        };
        /**
         * Tulip Pink (#C25A7C)
        */
        Pens.TulipPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TulipPink, width);
        };
        /**
         * Medium Violet Red (#CA226B)
        */
        Pens.MediumVioletRed = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumVioletRed, width);
        };
        /**
         * Rogue Pink (#C12869)
        */
        Pens.RoguePink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.RoguePink, width);
        };
        /**
         * Burnt Pink (#C12267)
        */
        Pens.BurntPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BurntPink, width);
        };
        /**
         * Bashful Pink (#C25283)
        */
        Pens.BashfulPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BashfulPink, width);
        };
        /**
         * Dark Carnation Pink (#C12283)
        */
        Pens.DarkCarnationPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkCarnationPink, width);
        };
        /**
         * Plum (#B93B8F)
        */
        Pens.Plum = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Plum, width);
        };
        /**
         * Viola Purple (#7E587E)
        */
        Pens.ViolaPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.ViolaPurple, width);
        };
        /**
         * Purple Iris (#571B7E)
        */
        Pens.PurpleIris = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleIris, width);
        };
        /**
         * Plum Purple (#583759)
        */
        Pens.PlumPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PlumPurple, width);
        };
        /**
         * Indigo (#4B0082)
        */
        Pens.Indigo = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Indigo, width);
        };
        /**
         * Purple Monster (#461B7E)
        */
        Pens.PurpleMonster = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleMonster, width);
        };
        /**
         * Purple Haze (#4E387E)
        */
        Pens.PurpleHaze = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleHaze, width);
        };
        /**
         * Eggplant (#614051)
        */
        Pens.Eggplant = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Eggplant, width);
        };
        /**
         * Grape (#5E5A80)
        */
        Pens.Grape = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Grape, width);
        };
        /**
         * Purple Jam (#6A287E)
        */
        Pens.PurpleJam = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleJam, width);
        };
        /**
         * Dark Orchid (#7D1B7E)
        */
        Pens.DarkOrchid = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkOrchid, width);
        };
        /**
         * Purple Flower (#A74AC7)
        */
        Pens.PurpleFlower = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleFlower, width);
        };
        /**
         * Medium Orchid (#B048B5)
        */
        Pens.MediumOrchid = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumOrchid, width);
        };
        /**
         * Purple Amethyst (#6C2DC7)
        */
        Pens.PurpleAmethyst = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleAmethyst, width);
        };
        /**
         * Dark Violet (#842DCE)
        */
        Pens.DarkViolet = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.DarkViolet, width);
        };
        /**
         * Violet (#8D38C9)
        */
        Pens.Violet = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Violet, width);
        };
        /**
         * Purple Sage Bush (#7A5DC7)
        */
        Pens.PurpleSageBush = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleSageBush, width);
        };
        /**
         * Lovely Purple (#7F38EC)
        */
        Pens.LovelyPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LovelyPurple, width);
        };
        /**
         * Purple (#8E35EF)
        */
        Pens.Purple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Purple, width);
        };
        /**
         * Aztech Purple (#893BFF)
        */
        Pens.AztechPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.AztechPurple, width);
        };
        /**
         * Medium Purple (#8467D7)
        */
        Pens.MediumPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MediumPurple, width);
        };
        /**
         * Jasmine Purple (#A23BEC)
        */
        Pens.JasminePurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.JasminePurple, width);
        };
        /**
         * Purple Daffodil (#B041FF)
        */
        Pens.PurpleDaffodil = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleDaffodil, width);
        };
        /**
         * Tyrian Purple (#C45AEC)
        */
        Pens.TyrianPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.TyrianPurple, width);
        };
        /**
         * Crocus Purple (#9172EC)
        */
        Pens.CrocusPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.CrocusPurple, width);
        };
        /**
         * Purple Mimosa (#9E7BFF)
        */
        Pens.PurpleMimosa = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleMimosa, width);
        };
        /**
         * Heliotrope Purple (#D462FF)
        */
        Pens.HeliotropePurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.HeliotropePurple, width);
        };
        /**
         * Crimson (#E238EC)
        */
        Pens.Crimson = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Crimson, width);
        };
        /**
         * Purple Dragon (#C38EC7)
        */
        Pens.PurpleDragon = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.PurpleDragon, width);
        };
        /**
         * Lilac (#C8A2C8)
        */
        Pens.Lilac = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Lilac, width);
        };
        /**
         * Blush Pink (#E6A9EC)
        */
        Pens.BlushPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlushPink, width);
        };
        /**
         * Mauve (#E0B0FF)
        */
        Pens.Mauve = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Mauve, width);
        };
        /**
         * Wisteria Purple (#C6AEC7)
        */
        Pens.WisteriaPurple = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.WisteriaPurple, width);
        };
        /**
         * Blossom Pink (#F9B7FF)
        */
        Pens.BlossomPink = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.BlossomPink, width);
        };
        /**
         * Thistle (#D2B9D3)
        */
        Pens.Thistle = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Thistle, width);
        };
        /**
         * Periwinkle (#E9CFEC)
        */
        Pens.Periwinkle = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Periwinkle, width);
        };
        /**
         * Lavender Pinocchio (#EBDDE2)
        */
        Pens.LavenderPinocchio = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.LavenderPinocchio, width);
        };
        /**
         * Lavender blue (#E3E4FA)
        */
        Pens.Lavenderblue = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Lavenderblue, width);
        };
        /**
         * Pearl (#FDEEF4)
        */
        Pens.Pearl = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.Pearl, width);
        };
        /**
         * SeaShell (#FFF5EE)
        */
        Pens.SeaShell = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.SeaShell, width);
        };
        /**
         * Milk White (#FEFCFF)
        */
        Pens.MilkWhite = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.MilkWhite, width);
        };
        /**
         * White (#FFFFFF)
        */
        Pens.White = function (width) {
            if (width === void 0) { width = 1; }
            return new Canvas.Pen(Canvas.Brushes.White, width);
        };
        return Pens;
    }());
    Canvas.Pens = Pens;
})(Canvas || (Canvas = {}));
//# sourceMappingURL=svg.js.map