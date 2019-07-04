/// <reference path="linq.d.ts" />
declare module SvgUtils {
    /**
     * 这个函数会直接从目标的width和height属性来获取值
    */
    function getSize(container: HTMLElement, defaultSize?: number[] | Canvas.Size): Canvas.Size;
    function size(width: number, height: number): Canvas.Size;
    /**
     * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @param c The rgb color component numeric value
    */
    function componentToHex(c: any): string;
    const HTML5svgFeature: string;
    /**
     * 测试当前的浏览器是否支持HTML5的高级特性
    */
    function hasSVG2Feature(): boolean;
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
    function svgNode(n: string, v?: any): SVGElement;
}
/**
 * SVG画布元素
*/
declare namespace Canvas {
    /**
     * CSS style object model
    */
    interface ICSSStyle {
        /**
         * Apply CSS style to a given svg node element
         *
         * @param node a given svg document node object
        */
        Styling(node: SVGElement): SVGElement;
        /**
         * Generate css style string value from this
         * css style object model.
        */
        CSSStyle(): string;
    }
    /**
     * The object location data model
    */
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        toString(): string;
        /**
         * Calculate the 2d distance to other point from this point.
        */
        dist(p2: Point): number;
        /**
         * Is this point equals to a given point by numeric value equals
         * of the ``x`` and ``y``?
        */
        Equals(p2: Point): boolean;
    }
    /**
     * 表示一个矩形区域的大小
    */
    class Size {
        /**
         * 宽度
        */
        width: number;
        /**
         * 高度
        */
        height: number;
        constructor(width: number, height: number);
        toString(): string;
    }
    /**
     * 表示一个二维平面上的矩形区域
    */
    class Rectangle extends Size {
        left: number;
        top: number;
        constructor(x: number, y: number, width: number, height: number);
        Location(): Point;
        Size(): Size;
        toString(): string;
    }
    class Margin {
        top: number;
        right: number;
        bottom: number;
        left: number;
        readonly horizontal: number;
        readonly vertical: number;
        constructor(top: number, right: number, bottom: number, left: number);
        static Object(obj: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        } | number[]): Margin;
        toString(): string;
    }
}
declare namespace Canvas {
    /**
     * The css border style
    */
    class Pen implements ICSSStyle {
        color: Color;
        width: number;
        /**
         * Create a new css border style for svg rectangle, line, etc.
         *
         * @param color The border color
         * @param width The border width
        */
        constructor(color: Color, width?: number);
        Styling(node: SVGElement): SVGElement;
        CSSStyle(): string;
    }
}
/**
 * 提供类似于VB.NET之中的Graphics对象的模拟
*/
declare class Graphics {
    private svg;
    private container;
    /**
     * The css z-index layer order
    */
    private z;
    /**
     * 创建一个SVG画布对象
     *
     * @param div div id
    */
    constructor(div: string);
    /**
     * Set the size value of the svg canvas
    */
    size(width: number, height: number): Graphics;
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
    viewBox(minX: number, minY: number, width: number, height: number): Graphics;
    /**
     * Draw a basic svg line shape
     *
     * @param pen Defines the line border: color and line width
    */
    drawLine(pen: Canvas.Pen, a: Canvas.Point, b: Canvas.Point, id?: string, className?: string): Graphics;
    drawCircle(center: Canvas.Point, radius: number, border?: Canvas.Pen, fill?: Canvas.Color, id?: string, className?: string): Graphics;
    /**
     * The ``<ellipse>`` element is an SVG basic shape, used to create ellipses
     * based on a center coordinate, and both their x and y radius.
     *
     * @description Note: Ellipses are unable to specify the exact orientation of
     * the ellipse (if, for example, you wanted to draw an ellipse tilted at a 45
     * degree angle), but it can be rotated by using the ``transform`` attribute.
    */
    drawEllipse(center: Canvas.Point, rx: number, ry: number, border?: Canvas.Pen, fill?: Canvas.Color, id?: string, className?: string): Graphics;
    /**
     * Draw a basic svg rectangle shape
    */
    drawRectangle(rect: Canvas.Rectangle, border?: Canvas.Pen, fill?: Canvas.Color, id?: string, className?: string): Graphics;
    /**
     * The ``<path>`` SVG element is the generic element to define a shape.
     * All the basic shapes can be created with a path element.
    */
    drawPath(path: Canvas.Path, border?: Canvas.Pen, fill?: Canvas.Color, id?: string, className?: string): Graphics;
}
declare abstract class SvgChart {
    size: [number, number];
    margin: Canvas.Margin;
    readonly width: number;
    readonly height: number;
    constructor(size?: Canvas.Size | number[], margin?: Canvas.Margin);
}
declare namespace Canvas {
    /**
     * RGB color data model
    */
    class Color {
        r: number;
        g: number;
        b: number;
        constructor(r: number, g: number, b: number);
        /**
         * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        */
        static FromHtmlColor(htmlColor: string): Color;
        ToHtmlColor(): string;
        ToRGBColor(): string;
    }
}
declare namespace Canvas {
    class Font implements ICSSStyle {
        size: string;
        family: string;
        bold: boolean;
        italic: boolean;
        constructor(family: string, size?: any, bold?: boolean, italic?: boolean);
        Styling(node: SVGElement): SVGElement;
        CSSStyle(): string;
    }
}
declare namespace Canvas {
    /**
     * ``path``元素是用来定义形状的通用元素。所有的基本形状都可以
     * 用``path``元素来创建。
    */
    class Path {
        private pathStack;
        /**
         * 获取SVG的path字符串结果
        */
        readonly d: string;
        constructor();
        toString(): string;
        /**
         * 从给定的（x,y）坐标开启一个新的子路径或路径。M表示后面跟随的是绝对坐标值。
         * m表示后面跟随的是一个相对坐标值。如果"moveto"指令后面跟随着多个坐标值，那么
         * 这多个坐标值之间会被当做用线段连接。因此如果moveto是相对的，那么lineto也将会
         * 是相对的，反之也成立。如果一个相对的moveto出现在path的第一个位置，那么它会
         * 被认为是一个绝对的坐标。在这种情况下，子序列的坐标将会被当做相对的坐标，即便
         * 它在初始化的时候是绝对坐标。
        */
        MoveTo(x: number, y: number, relative?: boolean): Path;
        /**
         * 从（cpx,cpy）画一个水平线到（x,cpy）。H表示后面跟随的参数是绝对的坐标，h表示
         * 后面跟随的参数是相对坐标。可以为其提供多个x值作为参数。在指令执行结束后，
         * 最新的当前点将是参数提供的最后值（x，cpy）
        */
        HorizontalTo(x: number, relative?: boolean): Path;
        /**
         * 从当前点（cpx，cpy）到（cpx，y）画一条竖直线段。V表示后面的参数是绝对坐标
         * 值，v表示后面跟着的参数是相对坐标值。可以供多个y值作为参数使用。在指令的最
         * 后，根据最后的参数y值最新的当前点的坐标值是（cpx,y）.
        */
        VerticalTo(y: number, relative?: boolean): Path;
        /**
         * 画一条从当前点到给定的（x,y）坐标，这个给定的坐标将变为新的当前点。L表示后面
         * 跟随的参数将是绝对坐标值；l表示后面跟随的参数将是相对坐标值。可以通过指定一系
         * 列的坐标来描绘折线。在命令执行后，新的当前点将会被设置成被提供坐标序列的最后
         * 一个坐标。
        */
        LineTo(x: number, y: number, relative?: boolean): Path;
        /**
         * 在曲线开始的时候，用（x1，y1）作为当前点（x，y）的控制点，
         * 在曲线结束的时候，用（x2，y2）作为当前点的控制点，
         * 画一段立方体的贝塞尔曲线。C表示后面跟随的参数是绝对坐标值；
         * c表示后面跟随的参数是相对坐标值。可以为贝塞尔函数提供多个参数
         * 值。在指令执行完毕后，最后的当前点将变为在贝塞尔函数中只用的
         * 最后的（x，y）坐标值
        */
        CurveTo(x1: number, y1: number, x2: number, y2: number, endX: number, endY: number, relative?: boolean): Path;
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
        SmoothCurveTo(x2: number, y2: number, endX: number, endY: number, relative?: boolean): Path;
        /**
         * 从当前点（x，y）开始，以（x1，y1）为控制点，画出一个二次贝塞尔曲线。
         * Q表示后面跟随的参数是绝对坐标值，q表示后面跟随的参数是相对坐标值。
         * 可以为贝塞尔函数指定多个参数值。在指令执行结束后，新的当前点是贝塞尔曲线调用参数中最后一个坐标值（x，y）。
        */
        QuadraticBelzier(x: number, y: number, endX: number, endY: number, relative?: boolean): Path;
        /**
         * 用来从当前点（x，y）来画出一个椭圆弧曲线。曲线的形状和方向通过椭圆半径（rx，ry）
         * 和一个沿X轴旋转度来指明椭圆作为一个整体在当前坐标系下旋转的情形。椭圆的中心
         * （cx，cy）是通过满足其他参数的约束自动计算出来的。large-arc-flag和sweep-flag决定了计算和帮助要画的弧度大小。
        */
        EllipticalArc(rX: number, rY: number, xrotation: number, flag1: number, flag2: number, x: number, y: number, relative?: boolean): Path;
        /**
         * ClosePath命令将在当前路径从，从当前点到第一个点简单画一条直线。它是最简单的命令，
         * 而且不带有任何参数。它沿着到开始点的最短的线性路径，如果别的路径落在这路上，将
         * 可能路径相交。句法是``Z``或``z``，两种写法作用都一样。
        */
        ClosePath(): Path;
    }
}
declare namespace Canvas {
    class Brushes {
        /**
         * Black (#000000)
        */
        static Black(): Color;
        /**
         * Night (#0C090A)
        */
        static Night(): Color;
        /**
         * Gunmetal (#2C3539)
        */
        static Gunmetal(): Color;
        /**
         * Midnight (#2B1B17)
        */
        static Midnight(): Color;
        /**
         * Charcoal (#34282C)
        */
        static Charcoal(): Color;
        /**
         * Dark Slate Grey (#25383C)
        */
        static DarkSlateGrey(): Color;
        /**
         * Oil (#3B3131)
        */
        static Oil(): Color;
        /**
         * Black Cat (#413839)
        */
        static BlackCat(): Color;
        /**
         * Iridium (#3D3C3A)
        */
        static Iridium(): Color;
        /**
         * Black Eel (#463E3F)
        */
        static BlackEel(): Color;
        /**
         * Black Cow (#4C4646)
        */
        static BlackCow(): Color;
        /**
         * Gray Wolf (#504A4B)
        */
        static GrayWolf(): Color;
        /**
         * Vampire Gray (#565051)
        */
        static VampireGray(): Color;
        /**
         * Gray Dolphin (#5C5858)
        */
        static GrayDolphin(): Color;
        /**
         * Carbon Gray (#625D5D)
        */
        static CarbonGray(): Color;
        /**
         * Ash Gray (#666362)
        */
        static AshGray(): Color;
        /**
         * Cloudy Gray (#6D6968)
        */
        static CloudyGray(): Color;
        /**
         * Smokey Gray (#726E6D)
        */
        static SmokeyGray(): Color;
        /**
         * Gray (#736F6E)
        */
        static Gray(): Color;
        /**
         * Granite (#837E7C)
        */
        static Granite(): Color;
        /**
         * Battleship Gray (#848482)
        */
        static BattleshipGray(): Color;
        /**
         * Gray Cloud (#B6B6B4)
        */
        static GrayCloud(): Color;
        /**
         * Gray Goose (#D1D0CE)
        */
        static GrayGoose(): Color;
        /**
         * Platinum (#E5E4E2)
        */
        static Platinum(): Color;
        /**
         * Metallic Silver (#BCC6CC)
        */
        static MetallicSilver(): Color;
        /**
         * Blue Gray (#98AFC7)
        */
        static BlueGray(): Color;
        /**
         * Light Slate Gray (#6D7B8D)
        */
        static LightSlateGray(): Color;
        /**
         * Slate Gray (#657383)
        */
        static SlateGray(): Color;
        /**
         * Jet Gray (#616D7E)
        */
        static JetGray(): Color;
        /**
         * Mist Blue (#646D7E)
        */
        static MistBlue(): Color;
        /**
         * Marble Blue (#566D7E)
        */
        static MarbleBlue(): Color;
        /**
         * Slate Blue (#737CA1)
        */
        static SlateBlue(): Color;
        /**
         * Steel Blue (#4863A0)
        */
        static SteelBlue(): Color;
        /**
         * Blue Jay (#2B547E)
        */
        static BlueJay(): Color;
        /**
         * Dark Slate Blue (#2B3856)
        */
        static DarkSlateBlue(): Color;
        /**
         * Midnight Blue (#151B54)
        */
        static MidnightBlue(): Color;
        /**
         * Navy Blue (#000080)
        */
        static NavyBlue(): Color;
        /**
         * Blue Whale (#342D7E)
        */
        static BlueWhale(): Color;
        /**
         * Lapis Blue (#15317E)
        */
        static LapisBlue(): Color;
        /**
         * Denim Dark Blue (#151B8D)
        */
        static DenimDarkBlue(): Color;
        /**
         * Earth Blue (#0000A0)
        */
        static EarthBlue(): Color;
        /**
         * Cobalt Blue (#0020C2)
        */
        static CobaltBlue(): Color;
        /**
         * Blueberry Blue (#0041C2)
        */
        static BlueberryBlue(): Color;
        /**
         * Sapphire Blue (#2554C7)
        */
        static SapphireBlue(): Color;
        /**
         * Blue Eyes (#1569C7)
        */
        static BlueEyes(): Color;
        /**
         * Royal Blue (#2B60DE)
        */
        static RoyalBlue(): Color;
        /**
         * Blue Orchid (#1F45FC)
        */
        static BlueOrchid(): Color;
        /**
         * Blue Lotus (#6960EC)
        */
        static BlueLotus(): Color;
        /**
         * Light Slate Blue (#736AFF)
        */
        static LightSlateBlue(): Color;
        /**
         * Windows Blue (#357EC7)
        */
        static WindowsBlue(): Color;
        /**
         * Glacial Blue Ice (#368BC1)
        */
        static GlacialBlueIce(): Color;
        /**
         * Silk Blue (#488AC7)
        */
        static SilkBlue(): Color;
        /**
         * Blue Ivy (#3090C7)
        */
        static BlueIvy(): Color;
        /**
         * Blue Koi (#659EC7)
        */
        static BlueKoi(): Color;
        /**
         * Columbia Blue (#87AFC7)
        */
        static ColumbiaBlue(): Color;
        /**
         * Baby Blue (#95B9C7)
        */
        static BabyBlue(): Color;
        /**
         * Light Steel Blue (#728FCE)
        */
        static LightSteelBlue(): Color;
        /**
         * Ocean Blue (#2B65EC)
        */
        static OceanBlue(): Color;
        /**
         * Blue Ribbon (#306EFF)
        */
        static BlueRibbon(): Color;
        /**
         * Blue Dress (#157DEC)
        */
        static BlueDress(): Color;
        /**
         * Dodger Blue (#1589FF)
        */
        static DodgerBlue(): Color;
        /**
         * Cornflower Blue (#6495ED)
        */
        static CornflowerBlue(): Color;
        /**
         * Sky Blue (#6698FF)
        */
        static SkyBlue(): Color;
        /**
         * Butterfly Blue (#38ACEC)
        */
        static ButterflyBlue(): Color;
        /**
         * Iceberg (#56A5EC)
        */
        static Iceberg(): Color;
        /**
         * Crystal Blue (#5CB3FF)
        */
        static CrystalBlue(): Color;
        /**
         * Deep Sky Blue (#3BB9FF)
        */
        static DeepSkyBlue(): Color;
        /**
         * Denim Blue (#79BAEC)
        */
        static DenimBlue(): Color;
        /**
         * Light Sky Blue (#82CAFA)
        */
        static LightSkyBlue(): Color;
        /**
         * Day Sky Blue (#82CAFF)
        */
        static DaySkyBlue(): Color;
        /**
         * Jeans Blue (#A0CFEC)
        */
        static JeansBlue(): Color;
        /**
         * Blue Angel (#B7CEEC)
        */
        static BlueAngel(): Color;
        /**
         * Pastel Blue (#B4CFEC)
        */
        static PastelBlue(): Color;
        /**
         * Sea Blue (#C2DFFF)
        */
        static SeaBlue(): Color;
        /**
         * Powder Blue (#C6DEFF)
        */
        static PowderBlue(): Color;
        /**
         * Coral Blue (#AFDCEC)
        */
        static CoralBlue(): Color;
        /**
         * Light Blue (#ADDFFF)
        */
        static LightBlue(): Color;
        /**
         * Robin Egg Blue (#BDEDFF)
        */
        static RobinEggBlue(): Color;
        /**
         * Pale Blue Lily (#CFECEC)
        */
        static PaleBlueLily(): Color;
        /**
         * Light Cyan (#E0FFFF)
        */
        static LightCyan(): Color;
        /**
         * Water (#EBF4FA)
        */
        static Water(): Color;
        /**
         * AliceBlue (#F0F8FF)
        */
        static AliceBlue(): Color;
        /**
         * Azure (#F0FFFF)
        */
        static Azure(): Color;
        /**
         * Light Slate (#CCFFFF)
        */
        static LightSlate(): Color;
        /**
         * Light Aquamarine (#93FFE8)
        */
        static LightAquamarine(): Color;
        /**
         * Electric Blue (#9AFEFF)
        */
        static ElectricBlue(): Color;
        /**
         * Aquamarine (#7FFFD4)
        */
        static Aquamarine(): Color;
        /**
         * Cyan or Aqua (#00FFFF)
        */
        static CyanorAqua(): Color;
        /**
         * Tron Blue (#7DFDFE)
        */
        static TronBlue(): Color;
        /**
         * Blue Zircon (#57FEFF)
        */
        static BlueZircon(): Color;
        /**
         * Blue Lagoon (#8EEBEC)
        */
        static BlueLagoon(): Color;
        /**
         * Celeste (#50EBEC)
        */
        static Celeste(): Color;
        /**
         * Blue Diamond (#4EE2EC)
        */
        static BlueDiamond(): Color;
        /**
         * Tiffany Blue (#81D8D0)
        */
        static TiffanyBlue(): Color;
        /**
         * Cyan Opaque (#92C7C7)
        */
        static CyanOpaque(): Color;
        /**
         * Blue Hosta (#77BFC7)
        */
        static BlueHosta(): Color;
        /**
         * Northern Lights Blue (#78C7C7)
        */
        static NorthernLightsBlue(): Color;
        /**
         * Medium Turquoise (#48CCCD)
        */
        static MediumTurquoise(): Color;
        /**
         * Turquoise (#43C6DB)
        */
        static Turquoise(): Color;
        /**
         * Jellyfish (#46C7C7)
        */
        static Jellyfish(): Color;
        /**
         * Blue green (#7BCCB5)
        */
        static Bluegreen(): Color;
        /**
         * Macaw Blue Green (#43BFC7)
        */
        static MacawBlueGreen(): Color;
        /**
         * Light Sea Green (#3EA99F)
        */
        static LightSeaGreen(): Color;
        /**
         * Dark Turquoise (#3B9C9C)
        */
        static DarkTurquoise(): Color;
        /**
         * Sea Turtle Green (#438D80)
        */
        static SeaTurtleGreen(): Color;
        /**
         * Medium Aquamarine (#348781)
        */
        static MediumAquamarine(): Color;
        /**
         * Greenish Blue (#307D7E)
        */
        static GreenishBlue(): Color;
        /**
         * Grayish Turquoise (#5E7D7E)
        */
        static GrayishTurquoise(): Color;
        /**
         * Beetle Green (#4C787E)
        */
        static BeetleGreen(): Color;
        /**
         * Teal (#008080)
        */
        static Teal(): Color;
        /**
         * Sea Green (#4E8975)
        */
        static SeaGreen(): Color;
        /**
         * Camouflage Green (#78866B)
        */
        static CamouflageGreen(): Color;
        /**
         * Sage Green (#848b79)
        */
        static SageGreen(): Color;
        /**
         * Hazel Green (#617C58)
        */
        static HazelGreen(): Color;
        /**
         * Venom Green (#728C00)
        */
        static VenomGreen(): Color;
        /**
         * Fern Green (#667C26)
        */
        static FernGreen(): Color;
        /**
         * Dark Forest Green (#254117)
        */
        static DarkForestGreen(): Color;
        /**
         * Medium Sea Green (#306754)
        */
        static MediumSeaGreen(): Color;
        /**
         * Medium Forest Green (#347235)
        */
        static MediumForestGreen(): Color;
        /**
         * Seaweed Green (#437C17)
        */
        static SeaweedGreen(): Color;
        /**
         * Pine Green (#387C44)
        */
        static PineGreen(): Color;
        /**
         * Jungle Green (#347C2C)
        */
        static JungleGreen(): Color;
        /**
         * Shamrock Green (#347C17)
        */
        static ShamrockGreen(): Color;
        /**
         * Medium Spring Green (#348017)
        */
        static MediumSpringGreen(): Color;
        /**
         * Forest Green (#4E9258)
        */
        static ForestGreen(): Color;
        /**
         * Green Onion (#6AA121)
        */
        static GreenOnion(): Color;
        /**
         * Spring Green (#4AA02C)
        */
        static SpringGreen(): Color;
        /**
         * Lime Green (#41A317)
        */
        static LimeGreen(): Color;
        /**
         * Clover Green (#3EA055)
        */
        static CloverGreen(): Color;
        /**
         * Green Snake (#6CBB3C)
        */
        static GreenSnake(): Color;
        /**
         * Alien Green (#6CC417)
        */
        static AlienGreen(): Color;
        /**
         * Green Apple (#4CC417)
        */
        static GreenApple(): Color;
        /**
         * Yellow Green (#52D017)
        */
        static YellowGreen(): Color;
        /**
         * Kelly Green (#4CC552)
        */
        static KellyGreen(): Color;
        /**
         * Zombie Green (#54C571)
        */
        static ZombieGreen(): Color;
        /**
         * Frog Green (#99C68E)
        */
        static FrogGreen(): Color;
        /**
         * Green Peas (#89C35C)
        */
        static GreenPeas(): Color;
        /**
         * Dollar Bill Green (#85BB65)
        */
        static DollarBillGreen(): Color;
        /**
         * Dark Sea Green (#8BB381)
        */
        static DarkSeaGreen(): Color;
        /**
         * Iguana Green (#9CB071)
        */
        static IguanaGreen(): Color;
        /**
         * Avocado Green (#B2C248)
        */
        static AvocadoGreen(): Color;
        /**
         * Pistachio Green (#9DC209)
        */
        static PistachioGreen(): Color;
        /**
         * Salad Green (#A1C935)
        */
        static SaladGreen(): Color;
        /**
         * Hummingbird Green (#7FE817)
        */
        static HummingbirdGreen(): Color;
        /**
         * Nebula Green (#59E817)
        */
        static NebulaGreen(): Color;
        /**
         * Stoplight Go Green (#57E964)
        */
        static StoplightGoGreen(): Color;
        /**
         * Algae Green (#64E986)
        */
        static AlgaeGreen(): Color;
        /**
         * Jade Green (#5EFB6E)
        */
        static JadeGreen(): Color;
        /**
         * Green (#00FF00)
        */
        static Green(): Color;
        /**
         * Emerald Green (#5FFB17)
        */
        static EmeraldGreen(): Color;
        /**
         * Lawn Green (#87F717)
        */
        static LawnGreen(): Color;
        /**
         * Chartreuse (#8AFB17)
        */
        static Chartreuse(): Color;
        /**
         * Dragon Green (#6AFB92)
        */
        static DragonGreen(): Color;
        /**
         * Mint green (#98FF98)
        */
        static Mintgreen(): Color;
        /**
         * Green Thumb (#B5EAAA)
        */
        static GreenThumb(): Color;
        /**
         * Light Jade (#C3FDB8)
        */
        static LightJade(): Color;
        /**
         * Tea Green (#CCFB5D)
        */
        static TeaGreen(): Color;
        /**
         * Green Yellow (#B1FB17)
        */
        static GreenYellow(): Color;
        /**
         * Slime Green (#BCE954)
        */
        static SlimeGreen(): Color;
        /**
         * Goldenrod (#EDDA74)
        */
        static Goldenrod(): Color;
        /**
         * Harvest Gold (#EDE275)
        */
        static HarvestGold(): Color;
        /**
         * Sun Yellow (#FFE87C)
        */
        static SunYellow(): Color;
        /**
         * Yellow (#FFFF00)
        */
        static Yellow(): Color;
        /**
         * Corn Yellow (#FFF380)
        */
        static CornYellow(): Color;
        /**
         * Parchment (#FFFFC2)
        */
        static Parchment(): Color;
        /**
         * Cream (#FFFFCC)
        */
        static Cream(): Color;
        /**
         * Lemon Chiffon (#FFF8C6)
        */
        static LemonChiffon(): Color;
        /**
         * Cornsilk (#FFF8DC)
        */
        static Cornsilk(): Color;
        /**
         * Beige (#F5F5DC)
        */
        static Beige(): Color;
        /**
         * Blonde (#FBF6D9)
        */
        static Blonde(): Color;
        /**
         * AntiqueWhite (#FAEBD7)
        */
        static AntiqueWhite(): Color;
        /**
         * Champagne (#F7E7CE)
        */
        static Champagne(): Color;
        /**
         * BlanchedAlmond (#FFEBCD)
        */
        static BlanchedAlmond(): Color;
        /**
         * Vanilla (#F3E5AB)
        */
        static Vanilla(): Color;
        /**
         * Tan Brown (#ECE5B6)
        */
        static TanBrown(): Color;
        /**
         * Peach (#FFE5B4)
        */
        static Peach(): Color;
        /**
         * Mustard (#FFDB58)
        */
        static Mustard(): Color;
        /**
         * Rubber Ducky Yellow (#FFD801)
        */
        static RubberDuckyYellow(): Color;
        /**
         * Bright Gold (#FDD017)
        */
        static BrightGold(): Color;
        /**
         * Golden brown (#EAC117)
        */
        static Goldenbrown(): Color;
        /**
         * Macaroni and Cheese (#F2BB66)
        */
        static MacaroniandCheese(): Color;
        /**
         * Saffron (#FBB917)
        */
        static Saffron(): Color;
        /**
         * Beer (#FBB117)
        */
        static Beer(): Color;
        /**
         * Cantaloupe (#FFA62F)
        */
        static Cantaloupe(): Color;
        /**
         * Bee Yellow (#E9AB17)
        */
        static BeeYellow(): Color;
        /**
         * Brown Sugar (#E2A76F)
        */
        static BrownSugar(): Color;
        /**
         * BurlyWood (#DEB887)
        */
        static BurlyWood(): Color;
        /**
         * Deep Peach (#FFCBA4)
        */
        static DeepPeach(): Color;
        /**
         * Ginger Brown (#C9BE62)
        */
        static GingerBrown(): Color;
        /**
         * School Bus Yellow (#E8A317)
        */
        static SchoolBusYellow(): Color;
        /**
         * Sandy Brown (#EE9A4D)
        */
        static SandyBrown(): Color;
        /**
         * Fall Leaf Brown (#C8B560)
        */
        static FallLeafBrown(): Color;
        /**
         * Orange Gold (#D4A017)
        */
        static OrangeGold(): Color;
        /**
         * Sand (#C2B280)
        */
        static Sand(): Color;
        /**
         * Cookie Brown (#C7A317)
        */
        static CookieBrown(): Color;
        /**
         * Caramel (#C68E17)
        */
        static Caramel(): Color;
        /**
         * Brass (#B5A642)
        */
        static Brass(): Color;
        /**
         * Khaki (#ADA96E)
        */
        static Khaki(): Color;
        /**
         * Camel brown (#C19A6B)
        */
        static Camelbrown(): Color;
        /**
         * Bronze (#CD7F32)
        */
        static Bronze(): Color;
        /**
         * Tiger Orange (#C88141)
        */
        static TigerOrange(): Color;
        /**
         * Cinnamon (#C58917)
        */
        static Cinnamon(): Color;
        /**
         * Bullet Shell (#AF9B60)
        */
        static BulletShell(): Color;
        /**
         * Dark Goldenrod (#AF7817)
        */
        static DarkGoldenrod(): Color;
        /**
         * Copper (#B87333)
        */
        static Copper(): Color;
        /**
         * Wood (#966F33)
        */
        static Wood(): Color;
        /**
         * Oak Brown (#806517)
        */
        static OakBrown(): Color;
        /**
         * Moccasin (#827839)
        */
        static Moccasin(): Color;
        /**
         * Army Brown (#827B60)
        */
        static ArmyBrown(): Color;
        /**
         * Sandstone (#786D5F)
        */
        static Sandstone(): Color;
        /**
         * Mocha (#493D26)
        */
        static Mocha(): Color;
        /**
         * Taupe (#483C32)
        */
        static Taupe(): Color;
        /**
         * Coffee (#6F4E37)
        */
        static Coffee(): Color;
        /**
         * Brown Bear (#835C3B)
        */
        static BrownBear(): Color;
        /**
         * Red Dirt (#7F5217)
        */
        static RedDirt(): Color;
        /**
         * Sepia (#7F462C)
        */
        static Sepia(): Color;
        /**
         * Orange Salmon (#C47451)
        */
        static OrangeSalmon(): Color;
        /**
         * Rust (#C36241)
        */
        static Rust(): Color;
        /**
         * Red Fox (#C35817)
        */
        static RedFox(): Color;
        /**
         * Chocolate (#C85A17)
        */
        static Chocolate(): Color;
        /**
         * Sedona (#CC6600)
        */
        static Sedona(): Color;
        /**
         * Papaya Orange (#E56717)
        */
        static PapayaOrange(): Color;
        /**
         * Halloween Orange (#E66C2C)
        */
        static HalloweenOrange(): Color;
        /**
         * Pumpkin Orange (#F87217)
        */
        static PumpkinOrange(): Color;
        /**
         * Construction Cone Orange (#F87431)
        */
        static ConstructionConeOrange(): Color;
        /**
         * Sunrise Orange (#E67451)
        */
        static SunriseOrange(): Color;
        /**
         * Mango Orange (#FF8040)
        */
        static MangoOrange(): Color;
        /**
         * Dark Orange (#F88017)
        */
        static DarkOrange(): Color;
        /**
         * Coral (#FF7F50)
        */
        static Coral(): Color;
        /**
         * Basket Ball Orange (#F88158)
        */
        static BasketBallOrange(): Color;
        /**
         * Light Salmon (#F9966B)
        */
        static LightSalmon(): Color;
        /**
         * Tangerine (#E78A61)
        */
        static Tangerine(): Color;
        /**
         * Dark Salmon (#E18B6B)
        */
        static DarkSalmon(): Color;
        /**
         * Light Coral (#E77471)
        */
        static LightCoral(): Color;
        /**
         * Bean Red (#F75D59)
        */
        static BeanRed(): Color;
        /**
         * Valentine Red (#E55451)
        */
        static ValentineRed(): Color;
        /**
         * Shocking Orange (#E55B3C)
        */
        static ShockingOrange(): Color;
        /**
         * Red (#FF0000)
        */
        static Red(): Color;
        /**
         * Scarlet (#FF2400)
        */
        static Scarlet(): Color;
        /**
         * Ruby Red (#F62217)
        */
        static RubyRed(): Color;
        /**
         * Ferrari Red (#F70D1A)
        */
        static FerrariRed(): Color;
        /**
         * Fire Engine Red (#F62817)
        */
        static FireEngineRed(): Color;
        /**
         * Lava Red (#E42217)
        */
        static LavaRed(): Color;
        /**
         * Love Red (#E41B17)
        */
        static LoveRed(): Color;
        /**
         * Grapefruit (#DC381F)
        */
        static Grapefruit(): Color;
        /**
         * Chestnut Red (#C34A2C)
        */
        static ChestnutRed(): Color;
        /**
         * Cherry Red (#C24641)
        */
        static CherryRed(): Color;
        /**
         * Mahogany (#C04000)
        */
        static Mahogany(): Color;
        /**
         * Chilli Pepper (#C11B17)
        */
        static ChilliPepper(): Color;
        /**
         * Cranberry (#9F000F)
        */
        static Cranberry(): Color;
        /**
         * Red Wine (#990012)
        */
        static RedWine(): Color;
        /**
         * Burgundy (#8C001A)
        */
        static Burgundy(): Color;
        /**
         * Chestnut (#954535)
        */
        static Chestnut(): Color;
        /**
         * Blood Red (#7E3517)
        */
        static BloodRed(): Color;
        /**
         * Sienna (#8A4117)
        */
        static Sienna(): Color;
        /**
         * Sangria (#7E3817)
        */
        static Sangria(): Color;
        /**
         * Firebrick (#800517)
        */
        static Firebrick(): Color;
        /**
         * Maroon (#810541)
        */
        static Maroon(): Color;
        /**
         * Plum Pie (#7D0541)
        */
        static PlumPie(): Color;
        /**
         * Velvet Maroon (#7E354D)
        */
        static VelvetMaroon(): Color;
        /**
         * Plum Velvet (#7D0552)
        */
        static PlumVelvet(): Color;
        /**
         * Rosy Finch (#7F4E52)
        */
        static RosyFinch(): Color;
        /**
         * Puce (#7F5A58)
        */
        static Puce(): Color;
        /**
         * Dull Purple (#7F525D)
        */
        static DullPurple(): Color;
        /**
         * Rosy Brown (#B38481)
        */
        static RosyBrown(): Color;
        /**
         * Khaki Rose (#C5908E)
        */
        static KhakiRose(): Color;
        /**
         * Pink Bow (#C48189)
        */
        static PinkBow(): Color;
        /**
         * Lipstick Pink (#C48793)
        */
        static LipstickPink(): Color;
        /**
         * Rose (#E8ADAA)
        */
        static Rose(): Color;
        /**
         * Rose Gold (#ECC5C0)
        */
        static RoseGold(): Color;
        /**
         * Desert Sand (#EDC9AF)
        */
        static DesertSand(): Color;
        /**
         * Pig Pink (#FDD7E4)
        */
        static PigPink(): Color;
        /**
         * Cotton Candy (#FCDFFF)
        */
        static CottonCandy(): Color;
        /**
         * Pink Bubble Gum (#FFDFDD)
        */
        static PinkBubbleGum(): Color;
        /**
         * Misty Rose (#FBBBB9)
        */
        static MistyRose(): Color;
        /**
         * Pink (#FAAFBE)
        */
        static Pink(): Color;
        /**
         * Light Pink (#FAAFBA)
        */
        static LightPink(): Color;
        /**
         * Flamingo Pink (#F9A7B0)
        */
        static FlamingoPink(): Color;
        /**
         * Pink Rose (#E7A1B0)
        */
        static PinkRose(): Color;
        /**
         * Pink Daisy (#E799A3)
        */
        static PinkDaisy(): Color;
        /**
         * Cadillac Pink (#E38AAE)
        */
        static CadillacPink(): Color;
        /**
         * Carnation Pink (#F778A1)
        */
        static CarnationPink(): Color;
        /**
         * Blush Red (#E56E94)
        */
        static BlushRed(): Color;
        /**
         * Hot Pink (#F660AB)
        */
        static HotPink(): Color;
        /**
         * Watermelon Pink (#FC6C85)
        */
        static WatermelonPink(): Color;
        /**
         * Violet Red (#F6358A)
        */
        static VioletRed(): Color;
        /**
         * Deep Pink (#F52887)
        */
        static DeepPink(): Color;
        /**
         * Pink Cupcake (#E45E9D)
        */
        static PinkCupcake(): Color;
        /**
         * Pink Lemonade (#E4287C)
        */
        static PinkLemonade(): Color;
        /**
         * Neon Pink (#F535AA)
        */
        static NeonPink(): Color;
        /**
         * Magenta (#FF00FF)
        */
        static Magenta(): Color;
        /**
         * Dimorphotheca Magenta (#E3319D)
        */
        static DimorphothecaMagenta(): Color;
        /**
         * Bright Neon Pink (#F433FF)
        */
        static BrightNeonPink(): Color;
        /**
         * Pale Violet Red (#D16587)
        */
        static PaleVioletRed(): Color;
        /**
         * Tulip Pink (#C25A7C)
        */
        static TulipPink(): Color;
        /**
         * Medium Violet Red (#CA226B)
        */
        static MediumVioletRed(): Color;
        /**
         * Rogue Pink (#C12869)
        */
        static RoguePink(): Color;
        /**
         * Burnt Pink (#C12267)
        */
        static BurntPink(): Color;
        /**
         * Bashful Pink (#C25283)
        */
        static BashfulPink(): Color;
        /**
         * Dark Carnation Pink (#C12283)
        */
        static DarkCarnationPink(): Color;
        /**
         * Plum (#B93B8F)
        */
        static Plum(): Color;
        /**
         * Viola Purple (#7E587E)
        */
        static ViolaPurple(): Color;
        /**
         * Purple Iris (#571B7E)
        */
        static PurpleIris(): Color;
        /**
         * Plum Purple (#583759)
        */
        static PlumPurple(): Color;
        /**
         * Indigo (#4B0082)
        */
        static Indigo(): Color;
        /**
         * Purple Monster (#461B7E)
        */
        static PurpleMonster(): Color;
        /**
         * Purple Haze (#4E387E)
        */
        static PurpleHaze(): Color;
        /**
         * Eggplant (#614051)
        */
        static Eggplant(): Color;
        /**
         * Grape (#5E5A80)
        */
        static Grape(): Color;
        /**
         * Purple Jam (#6A287E)
        */
        static PurpleJam(): Color;
        /**
         * Dark Orchid (#7D1B7E)
        */
        static DarkOrchid(): Color;
        /**
         * Purple Flower (#A74AC7)
        */
        static PurpleFlower(): Color;
        /**
         * Medium Orchid (#B048B5)
        */
        static MediumOrchid(): Color;
        /**
         * Purple Amethyst (#6C2DC7)
        */
        static PurpleAmethyst(): Color;
        /**
         * Dark Violet (#842DCE)
        */
        static DarkViolet(): Color;
        /**
         * Violet (#8D38C9)
        */
        static Violet(): Color;
        /**
         * Purple Sage Bush (#7A5DC7)
        */
        static PurpleSageBush(): Color;
        /**
         * Lovely Purple (#7F38EC)
        */
        static LovelyPurple(): Color;
        /**
         * Purple (#8E35EF)
        */
        static Purple(): Color;
        /**
         * Aztech Purple (#893BFF)
        */
        static AztechPurple(): Color;
        /**
         * Medium Purple (#8467D7)
        */
        static MediumPurple(): Color;
        /**
         * Jasmine Purple (#A23BEC)
        */
        static JasminePurple(): Color;
        /**
         * Purple Daffodil (#B041FF)
        */
        static PurpleDaffodil(): Color;
        /**
         * Tyrian Purple (#C45AEC)
        */
        static TyrianPurple(): Color;
        /**
         * Crocus Purple (#9172EC)
        */
        static CrocusPurple(): Color;
        /**
         * Purple Mimosa (#9E7BFF)
        */
        static PurpleMimosa(): Color;
        /**
         * Heliotrope Purple (#D462FF)
        */
        static HeliotropePurple(): Color;
        /**
         * Crimson (#E238EC)
        */
        static Crimson(): Color;
        /**
         * Purple Dragon (#C38EC7)
        */
        static PurpleDragon(): Color;
        /**
         * Lilac (#C8A2C8)
        */
        static Lilac(): Color;
        /**
         * Blush Pink (#E6A9EC)
        */
        static BlushPink(): Color;
        /**
         * Mauve (#E0B0FF)
        */
        static Mauve(): Color;
        /**
         * Wisteria Purple (#C6AEC7)
        */
        static WisteriaPurple(): Color;
        /**
         * Blossom Pink (#F9B7FF)
        */
        static BlossomPink(): Color;
        /**
         * Thistle (#D2B9D3)
        */
        static Thistle(): Color;
        /**
         * Periwinkle (#E9CFEC)
        */
        static Periwinkle(): Color;
        /**
         * Lavender Pinocchio (#EBDDE2)
        */
        static LavenderPinocchio(): Color;
        /**
         * Lavender blue (#E3E4FA)
        */
        static Lavenderblue(): Color;
        /**
         * Pearl (#FDEEF4)
        */
        static Pearl(): Color;
        /**
         * SeaShell (#FFF5EE)
        */
        static SeaShell(): Color;
        /**
         * Milk White (#FEFCFF)
        */
        static MilkWhite(): Color;
        /**
         * White (#FFFFFF)
        */
        static White(): Color;
    }
}
declare namespace Canvas {
    /**
     * Black (#000000)
    */
    const Black: string;
    /**
     * Night (#0C090A)
    */
    const Night: string;
    /**
     * Gunmetal (#2C3539)
    */
    const Gunmetal: string;
    /**
     * Midnight (#2B1B17)
    */
    const Midnight: string;
    /**
     * Charcoal (#34282C)
    */
    const Charcoal: string;
    /**
     * Dark Slate Grey (#25383C)
    */
    const DarkSlateGrey: string;
    /**
     * Oil (#3B3131)
    */
    const Oil: string;
    /**
     * Black Cat (#413839)
    */
    const BlackCat: string;
    /**
     * Iridium (#3D3C3A)
    */
    const Iridium: string;
    /**
     * Black Eel (#463E3F)
    */
    const BlackEel: string;
    /**
     * Black Cow (#4C4646)
    */
    const BlackCow: string;
    /**
     * Gray Wolf (#504A4B)
    */
    const GrayWolf: string;
    /**
     * Vampire Gray (#565051)
    */
    const VampireGray: string;
    /**
     * Gray Dolphin (#5C5858)
    */
    const GrayDolphin: string;
    /**
     * Carbon Gray (#625D5D)
    */
    const CarbonGray: string;
    /**
     * Ash Gray (#666362)
    */
    const AshGray: string;
    /**
     * Cloudy Gray (#6D6968)
    */
    const CloudyGray: string;
    /**
     * Smokey Gray (#726E6D)
    */
    const SmokeyGray: string;
    /**
     * Gray (#736F6E)
    */
    const Gray: string;
    /**
     * Granite (#837E7C)
    */
    const Granite: string;
    /**
     * Battleship Gray (#848482)
    */
    const BattleshipGray: string;
    /**
     * Gray Cloud (#B6B6B4)
    */
    const GrayCloud: string;
    /**
     * Gray Goose (#D1D0CE)
    */
    const GrayGoose: string;
    /**
     * Platinum (#E5E4E2)
    */
    const Platinum: string;
    /**
     * Metallic Silver (#BCC6CC)
    */
    const MetallicSilver: string;
    /**
     * Blue Gray (#98AFC7)
    */
    const BlueGray: string;
    /**
     * Light Slate Gray (#6D7B8D)
    */
    const LightSlateGray: string;
    /**
     * Slate Gray (#657383)
    */
    const SlateGray: string;
    /**
     * Jet Gray (#616D7E)
    */
    const JetGray: string;
    /**
     * Mist Blue (#646D7E)
    */
    const MistBlue: string;
    /**
     * Marble Blue (#566D7E)
    */
    const MarbleBlue: string;
    /**
     * Slate Blue (#737CA1)
    */
    const SlateBlue: string;
    /**
     * Steel Blue (#4863A0)
    */
    const SteelBlue: string;
    /**
     * Blue Jay (#2B547E)
    */
    const BlueJay: string;
    /**
     * Dark Slate Blue (#2B3856)
    */
    const DarkSlateBlue: string;
    /**
     * Midnight Blue (#151B54)
    */
    const MidnightBlue: string;
    /**
     * Navy Blue (#000080)
    */
    const NavyBlue: string;
    /**
     * Blue Whale (#342D7E)
    */
    const BlueWhale: string;
    /**
     * Lapis Blue (#15317E)
    */
    const LapisBlue: string;
    /**
     * Denim Dark Blue (#151B8D)
    */
    const DenimDarkBlue: string;
    /**
     * Earth Blue (#0000A0)
    */
    const EarthBlue: string;
    /**
     * Cobalt Blue (#0020C2)
    */
    const CobaltBlue: string;
    /**
     * Blueberry Blue (#0041C2)
    */
    const BlueberryBlue: string;
    /**
     * Sapphire Blue (#2554C7)
    */
    const SapphireBlue: string;
    /**
     * Blue Eyes (#1569C7)
    */
    const BlueEyes: string;
    /**
     * Royal Blue (#2B60DE)
    */
    const RoyalBlue: string;
    /**
     * Blue Orchid (#1F45FC)
    */
    const BlueOrchid: string;
    /**
     * Blue Lotus (#6960EC)
    */
    const BlueLotus: string;
    /**
     * Light Slate Blue (#736AFF)
    */
    const LightSlateBlue: string;
    /**
     * Windows Blue (#357EC7)
    */
    const WindowsBlue: string;
    /**
     * Glacial Blue Ice (#368BC1)
    */
    const GlacialBlueIce: string;
    /**
     * Silk Blue (#488AC7)
    */
    const SilkBlue: string;
    /**
     * Blue Ivy (#3090C7)
    */
    const BlueIvy: string;
    /**
     * Blue Koi (#659EC7)
    */
    const BlueKoi: string;
    /**
     * Columbia Blue (#87AFC7)
    */
    const ColumbiaBlue: string;
    /**
     * Baby Blue (#95B9C7)
    */
    const BabyBlue: string;
    /**
     * Light Steel Blue (#728FCE)
    */
    const LightSteelBlue: string;
    /**
     * Ocean Blue (#2B65EC)
    */
    const OceanBlue: string;
    /**
     * Blue Ribbon (#306EFF)
    */
    const BlueRibbon: string;
    /**
     * Blue Dress (#157DEC)
    */
    const BlueDress: string;
    /**
     * Dodger Blue (#1589FF)
    */
    const DodgerBlue: string;
    /**
     * Cornflower Blue (#6495ED)
    */
    const CornflowerBlue: string;
    /**
     * Sky Blue (#6698FF)
    */
    const SkyBlue: string;
    /**
     * Butterfly Blue (#38ACEC)
    */
    const ButterflyBlue: string;
    /**
     * Iceberg (#56A5EC)
    */
    const Iceberg: string;
    /**
     * Crystal Blue (#5CB3FF)
    */
    const CrystalBlue: string;
    /**
     * Deep Sky Blue (#3BB9FF)
    */
    const DeepSkyBlue: string;
    /**
     * Denim Blue (#79BAEC)
    */
    const DenimBlue: string;
    /**
     * Light Sky Blue (#82CAFA)
    */
    const LightSkyBlue: string;
    /**
     * Day Sky Blue (#82CAFF)
    */
    const DaySkyBlue: string;
    /**
     * Jeans Blue (#A0CFEC)
    */
    const JeansBlue: string;
    /**
     * Blue Angel (#B7CEEC)
    */
    const BlueAngel: string;
    /**
     * Pastel Blue (#B4CFEC)
    */
    const PastelBlue: string;
    /**
     * Sea Blue (#C2DFFF)
    */
    const SeaBlue: string;
    /**
     * Powder Blue (#C6DEFF)
    */
    const PowderBlue: string;
    /**
     * Coral Blue (#AFDCEC)
    */
    const CoralBlue: string;
    /**
     * Light Blue (#ADDFFF)
    */
    const LightBlue: string;
    /**
     * Robin Egg Blue (#BDEDFF)
    */
    const RobinEggBlue: string;
    /**
     * Pale Blue Lily (#CFECEC)
    */
    const PaleBlueLily: string;
    /**
     * Light Cyan (#E0FFFF)
    */
    const LightCyan: string;
    /**
     * Water (#EBF4FA)
    */
    const Water: string;
    /**
     * AliceBlue (#F0F8FF)
    */
    const AliceBlue: string;
    /**
     * Azure (#F0FFFF)
    */
    const Azure: string;
    /**
     * Light Slate (#CCFFFF)
    */
    const LightSlate: string;
    /**
     * Light Aquamarine (#93FFE8)
    */
    const LightAquamarine: string;
    /**
     * Electric Blue (#9AFEFF)
    */
    const ElectricBlue: string;
    /**
     * Aquamarine (#7FFFD4)
    */
    const Aquamarine: string;
    /**
     * Cyan or Aqua (#00FFFF)
    */
    const CyanorAqua: string;
    /**
     * Tron Blue (#7DFDFE)
    */
    const TronBlue: string;
    /**
     * Blue Zircon (#57FEFF)
    */
    const BlueZircon: string;
    /**
     * Blue Lagoon (#8EEBEC)
    */
    const BlueLagoon: string;
    /**
     * Celeste (#50EBEC)
    */
    const Celeste: string;
    /**
     * Blue Diamond (#4EE2EC)
    */
    const BlueDiamond: string;
    /**
     * Tiffany Blue (#81D8D0)
    */
    const TiffanyBlue: string;
    /**
     * Cyan Opaque (#92C7C7)
    */
    const CyanOpaque: string;
    /**
     * Blue Hosta (#77BFC7)
    */
    const BlueHosta: string;
    /**
     * Northern Lights Blue (#78C7C7)
    */
    const NorthernLightsBlue: string;
    /**
     * Medium Turquoise (#48CCCD)
    */
    const MediumTurquoise: string;
    /**
     * Turquoise (#43C6DB)
    */
    const Turquoise: string;
    /**
     * Jellyfish (#46C7C7)
    */
    const Jellyfish: string;
    /**
     * Blue green (#7BCCB5)
    */
    const Bluegreen: string;
    /**
     * Macaw Blue Green (#43BFC7)
    */
    const MacawBlueGreen: string;
    /**
     * Light Sea Green (#3EA99F)
    */
    const LightSeaGreen: string;
    /**
     * Dark Turquoise (#3B9C9C)
    */
    const DarkTurquoise: string;
    /**
     * Sea Turtle Green (#438D80)
    */
    const SeaTurtleGreen: string;
    /**
     * Medium Aquamarine (#348781)
    */
    const MediumAquamarine: string;
    /**
     * Greenish Blue (#307D7E)
    */
    const GreenishBlue: string;
    /**
     * Grayish Turquoise (#5E7D7E)
    */
    const GrayishTurquoise: string;
    /**
     * Beetle Green (#4C787E)
    */
    const BeetleGreen: string;
    /**
     * Teal (#008080)
    */
    const Teal: string;
    /**
     * Sea Green (#4E8975)
    */
    const SeaGreen: string;
    /**
     * Camouflage Green (#78866B)
    */
    const CamouflageGreen: string;
    /**
     * Sage Green (#848b79)
    */
    const SageGreen: string;
    /**
     * Hazel Green (#617C58)
    */
    const HazelGreen: string;
    /**
     * Venom Green (#728C00)
    */
    const VenomGreen: string;
    /**
     * Fern Green (#667C26)
    */
    const FernGreen: string;
    /**
     * Dark Forest Green (#254117)
    */
    const DarkForestGreen: string;
    /**
     * Medium Sea Green (#306754)
    */
    const MediumSeaGreen: string;
    /**
     * Medium Forest Green (#347235)
    */
    const MediumForestGreen: string;
    /**
     * Seaweed Green (#437C17)
    */
    const SeaweedGreen: string;
    /**
     * Pine Green (#387C44)
    */
    const PineGreen: string;
    /**
     * Jungle Green (#347C2C)
    */
    const JungleGreen: string;
    /**
     * Shamrock Green (#347C17)
    */
    const ShamrockGreen: string;
    /**
     * Medium Spring Green (#348017)
    */
    const MediumSpringGreen: string;
    /**
     * Forest Green (#4E9258)
    */
    const ForestGreen: string;
    /**
     * Green Onion (#6AA121)
    */
    const GreenOnion: string;
    /**
     * Spring Green (#4AA02C)
    */
    const SpringGreen: string;
    /**
     * Lime Green (#41A317)
    */
    const LimeGreen: string;
    /**
     * Clover Green (#3EA055)
    */
    const CloverGreen: string;
    /**
     * Green Snake (#6CBB3C)
    */
    const GreenSnake: string;
    /**
     * Alien Green (#6CC417)
    */
    const AlienGreen: string;
    /**
     * Green Apple (#4CC417)
    */
    const GreenApple: string;
    /**
     * Yellow Green (#52D017)
    */
    const YellowGreen: string;
    /**
     * Kelly Green (#4CC552)
    */
    const KellyGreen: string;
    /**
     * Zombie Green (#54C571)
    */
    const ZombieGreen: string;
    /**
     * Frog Green (#99C68E)
    */
    const FrogGreen: string;
    /**
     * Green Peas (#89C35C)
    */
    const GreenPeas: string;
    /**
     * Dollar Bill Green (#85BB65)
    */
    const DollarBillGreen: string;
    /**
     * Dark Sea Green (#8BB381)
    */
    const DarkSeaGreen: string;
    /**
     * Iguana Green (#9CB071)
    */
    const IguanaGreen: string;
    /**
     * Avocado Green (#B2C248)
    */
    const AvocadoGreen: string;
    /**
     * Pistachio Green (#9DC209)
    */
    const PistachioGreen: string;
    /**
     * Salad Green (#A1C935)
    */
    const SaladGreen: string;
    /**
     * Hummingbird Green (#7FE817)
    */
    const HummingbirdGreen: string;
    /**
     * Nebula Green (#59E817)
    */
    const NebulaGreen: string;
    /**
     * Stoplight Go Green (#57E964)
    */
    const StoplightGoGreen: string;
    /**
     * Algae Green (#64E986)
    */
    const AlgaeGreen: string;
    /**
     * Jade Green (#5EFB6E)
    */
    const JadeGreen: string;
    /**
     * Green (#00FF00)
    */
    const Green: string;
    /**
     * Emerald Green (#5FFB17)
    */
    const EmeraldGreen: string;
    /**
     * Lawn Green (#87F717)
    */
    const LawnGreen: string;
    /**
     * Chartreuse (#8AFB17)
    */
    const Chartreuse: string;
    /**
     * Dragon Green (#6AFB92)
    */
    const DragonGreen: string;
    /**
     * Mint green (#98FF98)
    */
    const Mintgreen: string;
    /**
     * Green Thumb (#B5EAAA)
    */
    const GreenThumb: string;
    /**
     * Light Jade (#C3FDB8)
    */
    const LightJade: string;
    /**
     * Tea Green (#CCFB5D)
    */
    const TeaGreen: string;
    /**
     * Green Yellow (#B1FB17)
    */
    const GreenYellow: string;
    /**
     * Slime Green (#BCE954)
    */
    const SlimeGreen: string;
    /**
     * Goldenrod (#EDDA74)
    */
    const Goldenrod: string;
    /**
     * Harvest Gold (#EDE275)
    */
    const HarvestGold: string;
    /**
     * Sun Yellow (#FFE87C)
    */
    const SunYellow: string;
    /**
     * Yellow (#FFFF00)
    */
    const Yellow: string;
    /**
     * Corn Yellow (#FFF380)
    */
    const CornYellow: string;
    /**
     * Parchment (#FFFFC2)
    */
    const Parchment: string;
    /**
     * Cream (#FFFFCC)
    */
    const Cream: string;
    /**
     * Lemon Chiffon (#FFF8C6)
    */
    const LemonChiffon: string;
    /**
     * Cornsilk (#FFF8DC)
    */
    const Cornsilk: string;
    /**
     * Beige (#F5F5DC)
    */
    const Beige: string;
    /**
     * Blonde (#FBF6D9)
    */
    const Blonde: string;
    /**
     * AntiqueWhite (#FAEBD7)
    */
    const AntiqueWhite: string;
    /**
     * Champagne (#F7E7CE)
    */
    const Champagne: string;
    /**
     * BlanchedAlmond (#FFEBCD)
    */
    const BlanchedAlmond: string;
    /**
     * Vanilla (#F3E5AB)
    */
    const Vanilla: string;
    /**
     * Tan Brown (#ECE5B6)
    */
    const TanBrown: string;
    /**
     * Peach (#FFE5B4)
    */
    const Peach: string;
    /**
     * Mustard (#FFDB58)
    */
    const Mustard: string;
    /**
     * Rubber Ducky Yellow (#FFD801)
    */
    const RubberDuckyYellow: string;
    /**
     * Bright Gold (#FDD017)
    */
    const BrightGold: string;
    /**
     * Golden brown (#EAC117)
    */
    const Goldenbrown: string;
    /**
     * Macaroni and Cheese (#F2BB66)
    */
    const MacaroniandCheese: string;
    /**
     * Saffron (#FBB917)
    */
    const Saffron: string;
    /**
     * Beer (#FBB117)
    */
    const Beer: string;
    /**
     * Cantaloupe (#FFA62F)
    */
    const Cantaloupe: string;
    /**
     * Bee Yellow (#E9AB17)
    */
    const BeeYellow: string;
    /**
     * Brown Sugar (#E2A76F)
    */
    const BrownSugar: string;
    /**
     * BurlyWood (#DEB887)
    */
    const BurlyWood: string;
    /**
     * Deep Peach (#FFCBA4)
    */
    const DeepPeach: string;
    /**
     * Ginger Brown (#C9BE62)
    */
    const GingerBrown: string;
    /**
     * School Bus Yellow (#E8A317)
    */
    const SchoolBusYellow: string;
    /**
     * Sandy Brown (#EE9A4D)
    */
    const SandyBrown: string;
    /**
     * Fall Leaf Brown (#C8B560)
    */
    const FallLeafBrown: string;
    /**
     * Orange Gold (#D4A017)
    */
    const OrangeGold: string;
    /**
     * Sand (#C2B280)
    */
    const Sand: string;
    /**
     * Cookie Brown (#C7A317)
    */
    const CookieBrown: string;
    /**
     * Caramel (#C68E17)
    */
    const Caramel: string;
    /**
     * Brass (#B5A642)
    */
    const Brass: string;
    /**
     * Khaki (#ADA96E)
    */
    const Khaki: string;
    /**
     * Camel brown (#C19A6B)
    */
    const Camelbrown: string;
    /**
     * Bronze (#CD7F32)
    */
    const Bronze: string;
    /**
     * Tiger Orange (#C88141)
    */
    const TigerOrange: string;
    /**
     * Cinnamon (#C58917)
    */
    const Cinnamon: string;
    /**
     * Bullet Shell (#AF9B60)
    */
    const BulletShell: string;
    /**
     * Dark Goldenrod (#AF7817)
    */
    const DarkGoldenrod: string;
    /**
     * Copper (#B87333)
    */
    const Copper: string;
    /**
     * Wood (#966F33)
    */
    const Wood: string;
    /**
     * Oak Brown (#806517)
    */
    const OakBrown: string;
    /**
     * Moccasin (#827839)
    */
    const Moccasin: string;
    /**
     * Army Brown (#827B60)
    */
    const ArmyBrown: string;
    /**
     * Sandstone (#786D5F)
    */
    const Sandstone: string;
    /**
     * Mocha (#493D26)
    */
    const Mocha: string;
    /**
     * Taupe (#483C32)
    */
    const Taupe: string;
    /**
     * Coffee (#6F4E37)
    */
    const Coffee: string;
    /**
     * Brown Bear (#835C3B)
    */
    const BrownBear: string;
    /**
     * Red Dirt (#7F5217)
    */
    const RedDirt: string;
    /**
     * Sepia (#7F462C)
    */
    const Sepia: string;
    /**
     * Orange Salmon (#C47451)
    */
    const OrangeSalmon: string;
    /**
     * Rust (#C36241)
    */
    const Rust: string;
    /**
     * Red Fox (#C35817)
    */
    const RedFox: string;
    /**
     * Chocolate (#C85A17)
    */
    const Chocolate: string;
    /**
     * Sedona (#CC6600)
    */
    const Sedona: string;
    /**
     * Papaya Orange (#E56717)
    */
    const PapayaOrange: string;
    /**
     * Halloween Orange (#E66C2C)
    */
    const HalloweenOrange: string;
    /**
     * Pumpkin Orange (#F87217)
    */
    const PumpkinOrange: string;
    /**
     * Construction Cone Orange (#F87431)
    */
    const ConstructionConeOrange: string;
    /**
     * Sunrise Orange (#E67451)
    */
    const SunriseOrange: string;
    /**
     * Mango Orange (#FF8040)
    */
    const MangoOrange: string;
    /**
     * Dark Orange (#F88017)
    */
    const DarkOrange: string;
    /**
     * Coral (#FF7F50)
    */
    const Coral: string;
    /**
     * Basket Ball Orange (#F88158)
    */
    const BasketBallOrange: string;
    /**
     * Light Salmon (#F9966B)
    */
    const LightSalmon: string;
    /**
     * Tangerine (#E78A61)
    */
    const Tangerine: string;
    /**
     * Dark Salmon (#E18B6B)
    */
    const DarkSalmon: string;
    /**
     * Light Coral (#E77471)
    */
    const LightCoral: string;
    /**
     * Bean Red (#F75D59)
    */
    const BeanRed: string;
    /**
     * Valentine Red (#E55451)
    */
    const ValentineRed: string;
    /**
     * Shocking Orange (#E55B3C)
    */
    const ShockingOrange: string;
    /**
     * Red (#FF0000)
    */
    const Red: string;
    /**
     * Scarlet (#FF2400)
    */
    const Scarlet: string;
    /**
     * Ruby Red (#F62217)
    */
    const RubyRed: string;
    /**
     * Ferrari Red (#F70D1A)
    */
    const FerrariRed: string;
    /**
     * Fire Engine Red (#F62817)
    */
    const FireEngineRed: string;
    /**
     * Lava Red (#E42217)
    */
    const LavaRed: string;
    /**
     * Love Red (#E41B17)
    */
    const LoveRed: string;
    /**
     * Grapefruit (#DC381F)
    */
    const Grapefruit: string;
    /**
     * Chestnut Red (#C34A2C)
    */
    const ChestnutRed: string;
    /**
     * Cherry Red (#C24641)
    */
    const CherryRed: string;
    /**
     * Mahogany (#C04000)
    */
    const Mahogany: string;
    /**
     * Chilli Pepper (#C11B17)
    */
    const ChilliPepper: string;
    /**
     * Cranberry (#9F000F)
    */
    const Cranberry: string;
    /**
     * Red Wine (#990012)
    */
    const RedWine: string;
    /**
     * Burgundy (#8C001A)
    */
    const Burgundy: string;
    /**
     * Chestnut (#954535)
    */
    const Chestnut: string;
    /**
     * Blood Red (#7E3517)
    */
    const BloodRed: string;
    /**
     * Sienna (#8A4117)
    */
    const Sienna: string;
    /**
     * Sangria (#7E3817)
    */
    const Sangria: string;
    /**
     * Firebrick (#800517)
    */
    const Firebrick: string;
    /**
     * Maroon (#810541)
    */
    const Maroon: string;
    /**
     * Plum Pie (#7D0541)
    */
    const PlumPie: string;
    /**
     * Velvet Maroon (#7E354D)
    */
    const VelvetMaroon: string;
    /**
     * Plum Velvet (#7D0552)
    */
    const PlumVelvet: string;
    /**
     * Rosy Finch (#7F4E52)
    */
    const RosyFinch: string;
    /**
     * Puce (#7F5A58)
    */
    const Puce: string;
    /**
     * Dull Purple (#7F525D)
    */
    const DullPurple: string;
    /**
     * Rosy Brown (#B38481)
    */
    const RosyBrown: string;
    /**
     * Khaki Rose (#C5908E)
    */
    const KhakiRose: string;
    /**
     * Pink Bow (#C48189)
    */
    const PinkBow: string;
    /**
     * Lipstick Pink (#C48793)
    */
    const LipstickPink: string;
    /**
     * Rose (#E8ADAA)
    */
    const Rose: string;
    /**
     * Rose Gold (#ECC5C0)
    */
    const RoseGold: string;
    /**
     * Desert Sand (#EDC9AF)
    */
    const DesertSand: string;
    /**
     * Pig Pink (#FDD7E4)
    */
    const PigPink: string;
    /**
     * Cotton Candy (#FCDFFF)
    */
    const CottonCandy: string;
    /**
     * Pink Bubble Gum (#FFDFDD)
    */
    const PinkBubbleGum: string;
    /**
     * Misty Rose (#FBBBB9)
    */
    const MistyRose: string;
    /**
     * Pink (#FAAFBE)
    */
    const Pink: string;
    /**
     * Light Pink (#FAAFBA)
    */
    const LightPink: string;
    /**
     * Flamingo Pink (#F9A7B0)
    */
    const FlamingoPink: string;
    /**
     * Pink Rose (#E7A1B0)
    */
    const PinkRose: string;
    /**
     * Pink Daisy (#E799A3)
    */
    const PinkDaisy: string;
    /**
     * Cadillac Pink (#E38AAE)
    */
    const CadillacPink: string;
    /**
     * Carnation Pink (#F778A1)
    */
    const CarnationPink: string;
    /**
     * Blush Red (#E56E94)
    */
    const BlushRed: string;
    /**
     * Hot Pink (#F660AB)
    */
    const HotPink: string;
    /**
     * Watermelon Pink (#FC6C85)
    */
    const WatermelonPink: string;
    /**
     * Violet Red (#F6358A)
    */
    const VioletRed: string;
    /**
     * Deep Pink (#F52887)
    */
    const DeepPink: string;
    /**
     * Pink Cupcake (#E45E9D)
    */
    const PinkCupcake: string;
    /**
     * Pink Lemonade (#E4287C)
    */
    const PinkLemonade: string;
    /**
     * Neon Pink (#F535AA)
    */
    const NeonPink: string;
    /**
     * Magenta (#FF00FF)
    */
    const Magenta: string;
    /**
     * Dimorphotheca Magenta (#E3319D)
    */
    const DimorphothecaMagenta: string;
    /**
     * Bright Neon Pink (#F433FF)
    */
    const BrightNeonPink: string;
    /**
     * Pale Violet Red (#D16587)
    */
    const PaleVioletRed: string;
    /**
     * Tulip Pink (#C25A7C)
    */
    const TulipPink: string;
    /**
     * Medium Violet Red (#CA226B)
    */
    const MediumVioletRed: string;
    /**
     * Rogue Pink (#C12869)
    */
    const RoguePink: string;
    /**
     * Burnt Pink (#C12267)
    */
    const BurntPink: string;
    /**
     * Bashful Pink (#C25283)
    */
    const BashfulPink: string;
    /**
     * Dark Carnation Pink (#C12283)
    */
    const DarkCarnationPink: string;
    /**
     * Plum (#B93B8F)
    */
    const Plum: string;
    /**
     * Viola Purple (#7E587E)
    */
    const ViolaPurple: string;
    /**
     * Purple Iris (#571B7E)
    */
    const PurpleIris: string;
    /**
     * Plum Purple (#583759)
    */
    const PlumPurple: string;
    /**
     * Indigo (#4B0082)
    */
    const Indigo: string;
    /**
     * Purple Monster (#461B7E)
    */
    const PurpleMonster: string;
    /**
     * Purple Haze (#4E387E)
    */
    const PurpleHaze: string;
    /**
     * Eggplant (#614051)
    */
    const Eggplant: string;
    /**
     * Grape (#5E5A80)
    */
    const Grape: string;
    /**
     * Purple Jam (#6A287E)
    */
    const PurpleJam: string;
    /**
     * Dark Orchid (#7D1B7E)
    */
    const DarkOrchid: string;
    /**
     * Purple Flower (#A74AC7)
    */
    const PurpleFlower: string;
    /**
     * Medium Orchid (#B048B5)
    */
    const MediumOrchid: string;
    /**
     * Purple Amethyst (#6C2DC7)
    */
    const PurpleAmethyst: string;
    /**
     * Dark Violet (#842DCE)
    */
    const DarkViolet: string;
    /**
     * Violet (#8D38C9)
    */
    const Violet: string;
    /**
     * Purple Sage Bush (#7A5DC7)
    */
    const PurpleSageBush: string;
    /**
     * Lovely Purple (#7F38EC)
    */
    const LovelyPurple: string;
    /**
     * Purple (#8E35EF)
    */
    const Purple: string;
    /**
     * Aztech Purple (#893BFF)
    */
    const AztechPurple: string;
    /**
     * Medium Purple (#8467D7)
    */
    const MediumPurple: string;
    /**
     * Jasmine Purple (#A23BEC)
    */
    const JasminePurple: string;
    /**
     * Purple Daffodil (#B041FF)
    */
    const PurpleDaffodil: string;
    /**
     * Tyrian Purple (#C45AEC)
    */
    const TyrianPurple: string;
    /**
     * Crocus Purple (#9172EC)
    */
    const CrocusPurple: string;
    /**
     * Purple Mimosa (#9E7BFF)
    */
    const PurpleMimosa: string;
    /**
     * Heliotrope Purple (#D462FF)
    */
    const HeliotropePurple: string;
    /**
     * Crimson (#E238EC)
    */
    const Crimson: string;
    /**
     * Purple Dragon (#C38EC7)
    */
    const PurpleDragon: string;
    /**
     * Lilac (#C8A2C8)
    */
    const Lilac: string;
    /**
     * Blush Pink (#E6A9EC)
    */
    const BlushPink: string;
    /**
     * Mauve (#E0B0FF)
    */
    const Mauve: string;
    /**
     * Wisteria Purple (#C6AEC7)
    */
    const WisteriaPurple: string;
    /**
     * Blossom Pink (#F9B7FF)
    */
    const BlossomPink: string;
    /**
     * Thistle (#D2B9D3)
    */
    const Thistle: string;
    /**
     * Periwinkle (#E9CFEC)
    */
    const Periwinkle: string;
    /**
     * Lavender Pinocchio (#EBDDE2)
    */
    const LavenderPinocchio: string;
    /**
     * Lavender blue (#E3E4FA)
    */
    const Lavenderblue: string;
    /**
     * Pearl (#FDEEF4)
    */
    const Pearl: string;
    /**
     * SeaShell (#FFF5EE)
    */
    const SeaShell: string;
    /**
     * Milk White (#FEFCFF)
    */
    const MilkWhite: string;
    /**
     * White (#FFFFFF)
    */
    const White: string;
}
declare namespace Canvas {
    class Pens {
        /**
         * Black (#000000)
        */
        static Black(width?: number): Pen;
        /**
         * Night (#0C090A)
        */
        static Night(width?: number): Pen;
        /**
         * Gunmetal (#2C3539)
        */
        static Gunmetal(width?: number): Pen;
        /**
         * Midnight (#2B1B17)
        */
        static Midnight(width?: number): Pen;
        /**
         * Charcoal (#34282C)
        */
        static Charcoal(width?: number): Pen;
        /**
         * Dark Slate Grey (#25383C)
        */
        static DarkSlateGrey(width?: number): Pen;
        /**
         * Oil (#3B3131)
        */
        static Oil(width?: number): Pen;
        /**
         * Black Cat (#413839)
        */
        static BlackCat(width?: number): Pen;
        /**
         * Iridium (#3D3C3A)
        */
        static Iridium(width?: number): Pen;
        /**
         * Black Eel (#463E3F)
        */
        static BlackEel(width?: number): Pen;
        /**
         * Black Cow (#4C4646)
        */
        static BlackCow(width?: number): Pen;
        /**
         * Gray Wolf (#504A4B)
        */
        static GrayWolf(width?: number): Pen;
        /**
         * Vampire Gray (#565051)
        */
        static VampireGray(width?: number): Pen;
        /**
         * Gray Dolphin (#5C5858)
        */
        static GrayDolphin(width?: number): Pen;
        /**
         * Carbon Gray (#625D5D)
        */
        static CarbonGray(width?: number): Pen;
        /**
         * Ash Gray (#666362)
        */
        static AshGray(width?: number): Pen;
        /**
         * Cloudy Gray (#6D6968)
        */
        static CloudyGray(width?: number): Pen;
        /**
         * Smokey Gray (#726E6D)
        */
        static SmokeyGray(width?: number): Pen;
        /**
         * Gray (#736F6E)
        */
        static Gray(width?: number): Pen;
        /**
         * Granite (#837E7C)
        */
        static Granite(width?: number): Pen;
        /**
         * Battleship Gray (#848482)
        */
        static BattleshipGray(width?: number): Pen;
        /**
         * Gray Cloud (#B6B6B4)
        */
        static GrayCloud(width?: number): Pen;
        /**
         * Gray Goose (#D1D0CE)
        */
        static GrayGoose(width?: number): Pen;
        /**
         * Platinum (#E5E4E2)
        */
        static Platinum(width?: number): Pen;
        /**
         * Metallic Silver (#BCC6CC)
        */
        static MetallicSilver(width?: number): Pen;
        /**
         * Blue Gray (#98AFC7)
        */
        static BlueGray(width?: number): Pen;
        /**
         * Light Slate Gray (#6D7B8D)
        */
        static LightSlateGray(width?: number): Pen;
        /**
         * Slate Gray (#657383)
        */
        static SlateGray(width?: number): Pen;
        /**
         * Jet Gray (#616D7E)
        */
        static JetGray(width?: number): Pen;
        /**
         * Mist Blue (#646D7E)
        */
        static MistBlue(width?: number): Pen;
        /**
         * Marble Blue (#566D7E)
        */
        static MarbleBlue(width?: number): Pen;
        /**
         * Slate Blue (#737CA1)
        */
        static SlateBlue(width?: number): Pen;
        /**
         * Steel Blue (#4863A0)
        */
        static SteelBlue(width?: number): Pen;
        /**
         * Blue Jay (#2B547E)
        */
        static BlueJay(width?: number): Pen;
        /**
         * Dark Slate Blue (#2B3856)
        */
        static DarkSlateBlue(width?: number): Pen;
        /**
         * Midnight Blue (#151B54)
        */
        static MidnightBlue(width?: number): Pen;
        /**
         * Navy Blue (#000080)
        */
        static NavyBlue(width?: number): Pen;
        /**
         * Blue Whale (#342D7E)
        */
        static BlueWhale(width?: number): Pen;
        /**
         * Lapis Blue (#15317E)
        */
        static LapisBlue(width?: number): Pen;
        /**
         * Denim Dark Blue (#151B8D)
        */
        static DenimDarkBlue(width?: number): Pen;
        /**
         * Earth Blue (#0000A0)
        */
        static EarthBlue(width?: number): Pen;
        /**
         * Cobalt Blue (#0020C2)
        */
        static CobaltBlue(width?: number): Pen;
        /**
         * Blueberry Blue (#0041C2)
        */
        static BlueberryBlue(width?: number): Pen;
        /**
         * Sapphire Blue (#2554C7)
        */
        static SapphireBlue(width?: number): Pen;
        /**
         * Blue Eyes (#1569C7)
        */
        static BlueEyes(width?: number): Pen;
        /**
         * Royal Blue (#2B60DE)
        */
        static RoyalBlue(width?: number): Pen;
        /**
         * Blue Orchid (#1F45FC)
        */
        static BlueOrchid(width?: number): Pen;
        /**
         * Blue Lotus (#6960EC)
        */
        static BlueLotus(width?: number): Pen;
        /**
         * Light Slate Blue (#736AFF)
        */
        static LightSlateBlue(width?: number): Pen;
        /**
         * Windows Blue (#357EC7)
        */
        static WindowsBlue(width?: number): Pen;
        /**
         * Glacial Blue Ice (#368BC1)
        */
        static GlacialBlueIce(width?: number): Pen;
        /**
         * Silk Blue (#488AC7)
        */
        static SilkBlue(width?: number): Pen;
        /**
         * Blue Ivy (#3090C7)
        */
        static BlueIvy(width?: number): Pen;
        /**
         * Blue Koi (#659EC7)
        */
        static BlueKoi(width?: number): Pen;
        /**
         * Columbia Blue (#87AFC7)
        */
        static ColumbiaBlue(width?: number): Pen;
        /**
         * Baby Blue (#95B9C7)
        */
        static BabyBlue(width?: number): Pen;
        /**
         * Light Steel Blue (#728FCE)
        */
        static LightSteelBlue(width?: number): Pen;
        /**
         * Ocean Blue (#2B65EC)
        */
        static OceanBlue(width?: number): Pen;
        /**
         * Blue Ribbon (#306EFF)
        */
        static BlueRibbon(width?: number): Pen;
        /**
         * Blue Dress (#157DEC)
        */
        static BlueDress(width?: number): Pen;
        /**
         * Dodger Blue (#1589FF)
        */
        static DodgerBlue(width?: number): Pen;
        /**
         * Cornflower Blue (#6495ED)
        */
        static CornflowerBlue(width?: number): Pen;
        /**
         * Sky Blue (#6698FF)
        */
        static SkyBlue(width?: number): Pen;
        /**
         * Butterfly Blue (#38ACEC)
        */
        static ButterflyBlue(width?: number): Pen;
        /**
         * Iceberg (#56A5EC)
        */
        static Iceberg(width?: number): Pen;
        /**
         * Crystal Blue (#5CB3FF)
        */
        static CrystalBlue(width?: number): Pen;
        /**
         * Deep Sky Blue (#3BB9FF)
        */
        static DeepSkyBlue(width?: number): Pen;
        /**
         * Denim Blue (#79BAEC)
        */
        static DenimBlue(width?: number): Pen;
        /**
         * Light Sky Blue (#82CAFA)
        */
        static LightSkyBlue(width?: number): Pen;
        /**
         * Day Sky Blue (#82CAFF)
        */
        static DaySkyBlue(width?: number): Pen;
        /**
         * Jeans Blue (#A0CFEC)
        */
        static JeansBlue(width?: number): Pen;
        /**
         * Blue Angel (#B7CEEC)
        */
        static BlueAngel(width?: number): Pen;
        /**
         * Pastel Blue (#B4CFEC)
        */
        static PastelBlue(width?: number): Pen;
        /**
         * Sea Blue (#C2DFFF)
        */
        static SeaBlue(width?: number): Pen;
        /**
         * Powder Blue (#C6DEFF)
        */
        static PowderBlue(width?: number): Pen;
        /**
         * Coral Blue (#AFDCEC)
        */
        static CoralBlue(width?: number): Pen;
        /**
         * Light Blue (#ADDFFF)
        */
        static LightBlue(width?: number): Pen;
        /**
         * Robin Egg Blue (#BDEDFF)
        */
        static RobinEggBlue(width?: number): Pen;
        /**
         * Pale Blue Lily (#CFECEC)
        */
        static PaleBlueLily(width?: number): Pen;
        /**
         * Light Cyan (#E0FFFF)
        */
        static LightCyan(width?: number): Pen;
        /**
         * Water (#EBF4FA)
        */
        static Water(width?: number): Pen;
        /**
         * AliceBlue (#F0F8FF)
        */
        static AliceBlue(width?: number): Pen;
        /**
         * Azure (#F0FFFF)
        */
        static Azure(width?: number): Pen;
        /**
         * Light Slate (#CCFFFF)
        */
        static LightSlate(width?: number): Pen;
        /**
         * Light Aquamarine (#93FFE8)
        */
        static LightAquamarine(width?: number): Pen;
        /**
         * Electric Blue (#9AFEFF)
        */
        static ElectricBlue(width?: number): Pen;
        /**
         * Aquamarine (#7FFFD4)
        */
        static Aquamarine(width?: number): Pen;
        /**
         * Cyan or Aqua (#00FFFF)
        */
        static CyanorAqua(width?: number): Pen;
        /**
         * Tron Blue (#7DFDFE)
        */
        static TronBlue(width?: number): Pen;
        /**
         * Blue Zircon (#57FEFF)
        */
        static BlueZircon(width?: number): Pen;
        /**
         * Blue Lagoon (#8EEBEC)
        */
        static BlueLagoon(width?: number): Pen;
        /**
         * Celeste (#50EBEC)
        */
        static Celeste(width?: number): Pen;
        /**
         * Blue Diamond (#4EE2EC)
        */
        static BlueDiamond(width?: number): Pen;
        /**
         * Tiffany Blue (#81D8D0)
        */
        static TiffanyBlue(width?: number): Pen;
        /**
         * Cyan Opaque (#92C7C7)
        */
        static CyanOpaque(width?: number): Pen;
        /**
         * Blue Hosta (#77BFC7)
        */
        static BlueHosta(width?: number): Pen;
        /**
         * Northern Lights Blue (#78C7C7)
        */
        static NorthernLightsBlue(width?: number): Pen;
        /**
         * Medium Turquoise (#48CCCD)
        */
        static MediumTurquoise(width?: number): Pen;
        /**
         * Turquoise (#43C6DB)
        */
        static Turquoise(width?: number): Pen;
        /**
         * Jellyfish (#46C7C7)
        */
        static Jellyfish(width?: number): Pen;
        /**
         * Blue green (#7BCCB5)
        */
        static Bluegreen(width?: number): Pen;
        /**
         * Macaw Blue Green (#43BFC7)
        */
        static MacawBlueGreen(width?: number): Pen;
        /**
         * Light Sea Green (#3EA99F)
        */
        static LightSeaGreen(width?: number): Pen;
        /**
         * Dark Turquoise (#3B9C9C)
        */
        static DarkTurquoise(width?: number): Pen;
        /**
         * Sea Turtle Green (#438D80)
        */
        static SeaTurtleGreen(width?: number): Pen;
        /**
         * Medium Aquamarine (#348781)
        */
        static MediumAquamarine(width?: number): Pen;
        /**
         * Greenish Blue (#307D7E)
        */
        static GreenishBlue(width?: number): Pen;
        /**
         * Grayish Turquoise (#5E7D7E)
        */
        static GrayishTurquoise(width?: number): Pen;
        /**
         * Beetle Green (#4C787E)
        */
        static BeetleGreen(width?: number): Pen;
        /**
         * Teal (#008080)
        */
        static Teal(width?: number): Pen;
        /**
         * Sea Green (#4E8975)
        */
        static SeaGreen(width?: number): Pen;
        /**
         * Camouflage Green (#78866B)
        */
        static CamouflageGreen(width?: number): Pen;
        /**
         * Sage Green (#848b79)
        */
        static SageGreen(width?: number): Pen;
        /**
         * Hazel Green (#617C58)
        */
        static HazelGreen(width?: number): Pen;
        /**
         * Venom Green (#728C00)
        */
        static VenomGreen(width?: number): Pen;
        /**
         * Fern Green (#667C26)
        */
        static FernGreen(width?: number): Pen;
        /**
         * Dark Forest Green (#254117)
        */
        static DarkForestGreen(width?: number): Pen;
        /**
         * Medium Sea Green (#306754)
        */
        static MediumSeaGreen(width?: number): Pen;
        /**
         * Medium Forest Green (#347235)
        */
        static MediumForestGreen(width?: number): Pen;
        /**
         * Seaweed Green (#437C17)
        */
        static SeaweedGreen(width?: number): Pen;
        /**
         * Pine Green (#387C44)
        */
        static PineGreen(width?: number): Pen;
        /**
         * Jungle Green (#347C2C)
        */
        static JungleGreen(width?: number): Pen;
        /**
         * Shamrock Green (#347C17)
        */
        static ShamrockGreen(width?: number): Pen;
        /**
         * Medium Spring Green (#348017)
        */
        static MediumSpringGreen(width?: number): Pen;
        /**
         * Forest Green (#4E9258)
        */
        static ForestGreen(width?: number): Pen;
        /**
         * Green Onion (#6AA121)
        */
        static GreenOnion(width?: number): Pen;
        /**
         * Spring Green (#4AA02C)
        */
        static SpringGreen(width?: number): Pen;
        /**
         * Lime Green (#41A317)
        */
        static LimeGreen(width?: number): Pen;
        /**
         * Clover Green (#3EA055)
        */
        static CloverGreen(width?: number): Pen;
        /**
         * Green Snake (#6CBB3C)
        */
        static GreenSnake(width?: number): Pen;
        /**
         * Alien Green (#6CC417)
        */
        static AlienGreen(width?: number): Pen;
        /**
         * Green Apple (#4CC417)
        */
        static GreenApple(width?: number): Pen;
        /**
         * Yellow Green (#52D017)
        */
        static YellowGreen(width?: number): Pen;
        /**
         * Kelly Green (#4CC552)
        */
        static KellyGreen(width?: number): Pen;
        /**
         * Zombie Green (#54C571)
        */
        static ZombieGreen(width?: number): Pen;
        /**
         * Frog Green (#99C68E)
        */
        static FrogGreen(width?: number): Pen;
        /**
         * Green Peas (#89C35C)
        */
        static GreenPeas(width?: number): Pen;
        /**
         * Dollar Bill Green (#85BB65)
        */
        static DollarBillGreen(width?: number): Pen;
        /**
         * Dark Sea Green (#8BB381)
        */
        static DarkSeaGreen(width?: number): Pen;
        /**
         * Iguana Green (#9CB071)
        */
        static IguanaGreen(width?: number): Pen;
        /**
         * Avocado Green (#B2C248)
        */
        static AvocadoGreen(width?: number): Pen;
        /**
         * Pistachio Green (#9DC209)
        */
        static PistachioGreen(width?: number): Pen;
        /**
         * Salad Green (#A1C935)
        */
        static SaladGreen(width?: number): Pen;
        /**
         * Hummingbird Green (#7FE817)
        */
        static HummingbirdGreen(width?: number): Pen;
        /**
         * Nebula Green (#59E817)
        */
        static NebulaGreen(width?: number): Pen;
        /**
         * Stoplight Go Green (#57E964)
        */
        static StoplightGoGreen(width?: number): Pen;
        /**
         * Algae Green (#64E986)
        */
        static AlgaeGreen(width?: number): Pen;
        /**
         * Jade Green (#5EFB6E)
        */
        static JadeGreen(width?: number): Pen;
        /**
         * Green (#00FF00)
        */
        static Green(width?: number): Pen;
        /**
         * Emerald Green (#5FFB17)
        */
        static EmeraldGreen(width?: number): Pen;
        /**
         * Lawn Green (#87F717)
        */
        static LawnGreen(width?: number): Pen;
        /**
         * Chartreuse (#8AFB17)
        */
        static Chartreuse(width?: number): Pen;
        /**
         * Dragon Green (#6AFB92)
        */
        static DragonGreen(width?: number): Pen;
        /**
         * Mint green (#98FF98)
        */
        static Mintgreen(width?: number): Pen;
        /**
         * Green Thumb (#B5EAAA)
        */
        static GreenThumb(width?: number): Pen;
        /**
         * Light Jade (#C3FDB8)
        */
        static LightJade(width?: number): Pen;
        /**
         * Tea Green (#CCFB5D)
        */
        static TeaGreen(width?: number): Pen;
        /**
         * Green Yellow (#B1FB17)
        */
        static GreenYellow(width?: number): Pen;
        /**
         * Slime Green (#BCE954)
        */
        static SlimeGreen(width?: number): Pen;
        /**
         * Goldenrod (#EDDA74)
        */
        static Goldenrod(width?: number): Pen;
        /**
         * Harvest Gold (#EDE275)
        */
        static HarvestGold(width?: number): Pen;
        /**
         * Sun Yellow (#FFE87C)
        */
        static SunYellow(width?: number): Pen;
        /**
         * Yellow (#FFFF00)
        */
        static Yellow(width?: number): Pen;
        /**
         * Corn Yellow (#FFF380)
        */
        static CornYellow(width?: number): Pen;
        /**
         * Parchment (#FFFFC2)
        */
        static Parchment(width?: number): Pen;
        /**
         * Cream (#FFFFCC)
        */
        static Cream(width?: number): Pen;
        /**
         * Lemon Chiffon (#FFF8C6)
        */
        static LemonChiffon(width?: number): Pen;
        /**
         * Cornsilk (#FFF8DC)
        */
        static Cornsilk(width?: number): Pen;
        /**
         * Beige (#F5F5DC)
        */
        static Beige(width?: number): Pen;
        /**
         * Blonde (#FBF6D9)
        */
        static Blonde(width?: number): Pen;
        /**
         * AntiqueWhite (#FAEBD7)
        */
        static AntiqueWhite(width?: number): Pen;
        /**
         * Champagne (#F7E7CE)
        */
        static Champagne(width?: number): Pen;
        /**
         * BlanchedAlmond (#FFEBCD)
        */
        static BlanchedAlmond(width?: number): Pen;
        /**
         * Vanilla (#F3E5AB)
        */
        static Vanilla(width?: number): Pen;
        /**
         * Tan Brown (#ECE5B6)
        */
        static TanBrown(width?: number): Pen;
        /**
         * Peach (#FFE5B4)
        */
        static Peach(width?: number): Pen;
        /**
         * Mustard (#FFDB58)
        */
        static Mustard(width?: number): Pen;
        /**
         * Rubber Ducky Yellow (#FFD801)
        */
        static RubberDuckyYellow(width?: number): Pen;
        /**
         * Bright Gold (#FDD017)
        */
        static BrightGold(width?: number): Pen;
        /**
         * Golden brown (#EAC117)
        */
        static Goldenbrown(width?: number): Pen;
        /**
         * Macaroni and Cheese (#F2BB66)
        */
        static MacaroniandCheese(width?: number): Pen;
        /**
         * Saffron (#FBB917)
        */
        static Saffron(width?: number): Pen;
        /**
         * Beer (#FBB117)
        */
        static Beer(width?: number): Pen;
        /**
         * Cantaloupe (#FFA62F)
        */
        static Cantaloupe(width?: number): Pen;
        /**
         * Bee Yellow (#E9AB17)
        */
        static BeeYellow(width?: number): Pen;
        /**
         * Brown Sugar (#E2A76F)
        */
        static BrownSugar(width?: number): Pen;
        /**
         * BurlyWood (#DEB887)
        */
        static BurlyWood(width?: number): Pen;
        /**
         * Deep Peach (#FFCBA4)
        */
        static DeepPeach(width?: number): Pen;
        /**
         * Ginger Brown (#C9BE62)
        */
        static GingerBrown(width?: number): Pen;
        /**
         * School Bus Yellow (#E8A317)
        */
        static SchoolBusYellow(width?: number): Pen;
        /**
         * Sandy Brown (#EE9A4D)
        */
        static SandyBrown(width?: number): Pen;
        /**
         * Fall Leaf Brown (#C8B560)
        */
        static FallLeafBrown(width?: number): Pen;
        /**
         * Orange Gold (#D4A017)
        */
        static OrangeGold(width?: number): Pen;
        /**
         * Sand (#C2B280)
        */
        static Sand(width?: number): Pen;
        /**
         * Cookie Brown (#C7A317)
        */
        static CookieBrown(width?: number): Pen;
        /**
         * Caramel (#C68E17)
        */
        static Caramel(width?: number): Pen;
        /**
         * Brass (#B5A642)
        */
        static Brass(width?: number): Pen;
        /**
         * Khaki (#ADA96E)
        */
        static Khaki(width?: number): Pen;
        /**
         * Camel brown (#C19A6B)
        */
        static Camelbrown(width?: number): Pen;
        /**
         * Bronze (#CD7F32)
        */
        static Bronze(width?: number): Pen;
        /**
         * Tiger Orange (#C88141)
        */
        static TigerOrange(width?: number): Pen;
        /**
         * Cinnamon (#C58917)
        */
        static Cinnamon(width?: number): Pen;
        /**
         * Bullet Shell (#AF9B60)
        */
        static BulletShell(width?: number): Pen;
        /**
         * Dark Goldenrod (#AF7817)
        */
        static DarkGoldenrod(width?: number): Pen;
        /**
         * Copper (#B87333)
        */
        static Copper(width?: number): Pen;
        /**
         * Wood (#966F33)
        */
        static Wood(width?: number): Pen;
        /**
         * Oak Brown (#806517)
        */
        static OakBrown(width?: number): Pen;
        /**
         * Moccasin (#827839)
        */
        static Moccasin(width?: number): Pen;
        /**
         * Army Brown (#827B60)
        */
        static ArmyBrown(width?: number): Pen;
        /**
         * Sandstone (#786D5F)
        */
        static Sandstone(width?: number): Pen;
        /**
         * Mocha (#493D26)
        */
        static Mocha(width?: number): Pen;
        /**
         * Taupe (#483C32)
        */
        static Taupe(width?: number): Pen;
        /**
         * Coffee (#6F4E37)
        */
        static Coffee(width?: number): Pen;
        /**
         * Brown Bear (#835C3B)
        */
        static BrownBear(width?: number): Pen;
        /**
         * Red Dirt (#7F5217)
        */
        static RedDirt(width?: number): Pen;
        /**
         * Sepia (#7F462C)
        */
        static Sepia(width?: number): Pen;
        /**
         * Orange Salmon (#C47451)
        */
        static OrangeSalmon(width?: number): Pen;
        /**
         * Rust (#C36241)
        */
        static Rust(width?: number): Pen;
        /**
         * Red Fox (#C35817)
        */
        static RedFox(width?: number): Pen;
        /**
         * Chocolate (#C85A17)
        */
        static Chocolate(width?: number): Pen;
        /**
         * Sedona (#CC6600)
        */
        static Sedona(width?: number): Pen;
        /**
         * Papaya Orange (#E56717)
        */
        static PapayaOrange(width?: number): Pen;
        /**
         * Halloween Orange (#E66C2C)
        */
        static HalloweenOrange(width?: number): Pen;
        /**
         * Pumpkin Orange (#F87217)
        */
        static PumpkinOrange(width?: number): Pen;
        /**
         * Construction Cone Orange (#F87431)
        */
        static ConstructionConeOrange(width?: number): Pen;
        /**
         * Sunrise Orange (#E67451)
        */
        static SunriseOrange(width?: number): Pen;
        /**
         * Mango Orange (#FF8040)
        */
        static MangoOrange(width?: number): Pen;
        /**
         * Dark Orange (#F88017)
        */
        static DarkOrange(width?: number): Pen;
        /**
         * Coral (#FF7F50)
        */
        static Coral(width?: number): Pen;
        /**
         * Basket Ball Orange (#F88158)
        */
        static BasketBallOrange(width?: number): Pen;
        /**
         * Light Salmon (#F9966B)
        */
        static LightSalmon(width?: number): Pen;
        /**
         * Tangerine (#E78A61)
        */
        static Tangerine(width?: number): Pen;
        /**
         * Dark Salmon (#E18B6B)
        */
        static DarkSalmon(width?: number): Pen;
        /**
         * Light Coral (#E77471)
        */
        static LightCoral(width?: number): Pen;
        /**
         * Bean Red (#F75D59)
        */
        static BeanRed(width?: number): Pen;
        /**
         * Valentine Red (#E55451)
        */
        static ValentineRed(width?: number): Pen;
        /**
         * Shocking Orange (#E55B3C)
        */
        static ShockingOrange(width?: number): Pen;
        /**
         * Red (#FF0000)
        */
        static Red(width?: number): Pen;
        /**
         * Scarlet (#FF2400)
        */
        static Scarlet(width?: number): Pen;
        /**
         * Ruby Red (#F62217)
        */
        static RubyRed(width?: number): Pen;
        /**
         * Ferrari Red (#F70D1A)
        */
        static FerrariRed(width?: number): Pen;
        /**
         * Fire Engine Red (#F62817)
        */
        static FireEngineRed(width?: number): Pen;
        /**
         * Lava Red (#E42217)
        */
        static LavaRed(width?: number): Pen;
        /**
         * Love Red (#E41B17)
        */
        static LoveRed(width?: number): Pen;
        /**
         * Grapefruit (#DC381F)
        */
        static Grapefruit(width?: number): Pen;
        /**
         * Chestnut Red (#C34A2C)
        */
        static ChestnutRed(width?: number): Pen;
        /**
         * Cherry Red (#C24641)
        */
        static CherryRed(width?: number): Pen;
        /**
         * Mahogany (#C04000)
        */
        static Mahogany(width?: number): Pen;
        /**
         * Chilli Pepper (#C11B17)
        */
        static ChilliPepper(width?: number): Pen;
        /**
         * Cranberry (#9F000F)
        */
        static Cranberry(width?: number): Pen;
        /**
         * Red Wine (#990012)
        */
        static RedWine(width?: number): Pen;
        /**
         * Burgundy (#8C001A)
        */
        static Burgundy(width?: number): Pen;
        /**
         * Chestnut (#954535)
        */
        static Chestnut(width?: number): Pen;
        /**
         * Blood Red (#7E3517)
        */
        static BloodRed(width?: number): Pen;
        /**
         * Sienna (#8A4117)
        */
        static Sienna(width?: number): Pen;
        /**
         * Sangria (#7E3817)
        */
        static Sangria(width?: number): Pen;
        /**
         * Firebrick (#800517)
        */
        static Firebrick(width?: number): Pen;
        /**
         * Maroon (#810541)
        */
        static Maroon(width?: number): Pen;
        /**
         * Plum Pie (#7D0541)
        */
        static PlumPie(width?: number): Pen;
        /**
         * Velvet Maroon (#7E354D)
        */
        static VelvetMaroon(width?: number): Pen;
        /**
         * Plum Velvet (#7D0552)
        */
        static PlumVelvet(width?: number): Pen;
        /**
         * Rosy Finch (#7F4E52)
        */
        static RosyFinch(width?: number): Pen;
        /**
         * Puce (#7F5A58)
        */
        static Puce(width?: number): Pen;
        /**
         * Dull Purple (#7F525D)
        */
        static DullPurple(width?: number): Pen;
        /**
         * Rosy Brown (#B38481)
        */
        static RosyBrown(width?: number): Pen;
        /**
         * Khaki Rose (#C5908E)
        */
        static KhakiRose(width?: number): Pen;
        /**
         * Pink Bow (#C48189)
        */
        static PinkBow(width?: number): Pen;
        /**
         * Lipstick Pink (#C48793)
        */
        static LipstickPink(width?: number): Pen;
        /**
         * Rose (#E8ADAA)
        */
        static Rose(width?: number): Pen;
        /**
         * Rose Gold (#ECC5C0)
        */
        static RoseGold(width?: number): Pen;
        /**
         * Desert Sand (#EDC9AF)
        */
        static DesertSand(width?: number): Pen;
        /**
         * Pig Pink (#FDD7E4)
        */
        static PigPink(width?: number): Pen;
        /**
         * Cotton Candy (#FCDFFF)
        */
        static CottonCandy(width?: number): Pen;
        /**
         * Pink Bubble Gum (#FFDFDD)
        */
        static PinkBubbleGum(width?: number): Pen;
        /**
         * Misty Rose (#FBBBB9)
        */
        static MistyRose(width?: number): Pen;
        /**
         * Pink (#FAAFBE)
        */
        static Pink(width?: number): Pen;
        /**
         * Light Pink (#FAAFBA)
        */
        static LightPink(width?: number): Pen;
        /**
         * Flamingo Pink (#F9A7B0)
        */
        static FlamingoPink(width?: number): Pen;
        /**
         * Pink Rose (#E7A1B0)
        */
        static PinkRose(width?: number): Pen;
        /**
         * Pink Daisy (#E799A3)
        */
        static PinkDaisy(width?: number): Pen;
        /**
         * Cadillac Pink (#E38AAE)
        */
        static CadillacPink(width?: number): Pen;
        /**
         * Carnation Pink (#F778A1)
        */
        static CarnationPink(width?: number): Pen;
        /**
         * Blush Red (#E56E94)
        */
        static BlushRed(width?: number): Pen;
        /**
         * Hot Pink (#F660AB)
        */
        static HotPink(width?: number): Pen;
        /**
         * Watermelon Pink (#FC6C85)
        */
        static WatermelonPink(width?: number): Pen;
        /**
         * Violet Red (#F6358A)
        */
        static VioletRed(width?: number): Pen;
        /**
         * Deep Pink (#F52887)
        */
        static DeepPink(width?: number): Pen;
        /**
         * Pink Cupcake (#E45E9D)
        */
        static PinkCupcake(width?: number): Pen;
        /**
         * Pink Lemonade (#E4287C)
        */
        static PinkLemonade(width?: number): Pen;
        /**
         * Neon Pink (#F535AA)
        */
        static NeonPink(width?: number): Pen;
        /**
         * Magenta (#FF00FF)
        */
        static Magenta(width?: number): Pen;
        /**
         * Dimorphotheca Magenta (#E3319D)
        */
        static DimorphothecaMagenta(width?: number): Pen;
        /**
         * Bright Neon Pink (#F433FF)
        */
        static BrightNeonPink(width?: number): Pen;
        /**
         * Pale Violet Red (#D16587)
        */
        static PaleVioletRed(width?: number): Pen;
        /**
         * Tulip Pink (#C25A7C)
        */
        static TulipPink(width?: number): Pen;
        /**
         * Medium Violet Red (#CA226B)
        */
        static MediumVioletRed(width?: number): Pen;
        /**
         * Rogue Pink (#C12869)
        */
        static RoguePink(width?: number): Pen;
        /**
         * Burnt Pink (#C12267)
        */
        static BurntPink(width?: number): Pen;
        /**
         * Bashful Pink (#C25283)
        */
        static BashfulPink(width?: number): Pen;
        /**
         * Dark Carnation Pink (#C12283)
        */
        static DarkCarnationPink(width?: number): Pen;
        /**
         * Plum (#B93B8F)
        */
        static Plum(width?: number): Pen;
        /**
         * Viola Purple (#7E587E)
        */
        static ViolaPurple(width?: number): Pen;
        /**
         * Purple Iris (#571B7E)
        */
        static PurpleIris(width?: number): Pen;
        /**
         * Plum Purple (#583759)
        */
        static PlumPurple(width?: number): Pen;
        /**
         * Indigo (#4B0082)
        */
        static Indigo(width?: number): Pen;
        /**
         * Purple Monster (#461B7E)
        */
        static PurpleMonster(width?: number): Pen;
        /**
         * Purple Haze (#4E387E)
        */
        static PurpleHaze(width?: number): Pen;
        /**
         * Eggplant (#614051)
        */
        static Eggplant(width?: number): Pen;
        /**
         * Grape (#5E5A80)
        */
        static Grape(width?: number): Pen;
        /**
         * Purple Jam (#6A287E)
        */
        static PurpleJam(width?: number): Pen;
        /**
         * Dark Orchid (#7D1B7E)
        */
        static DarkOrchid(width?: number): Pen;
        /**
         * Purple Flower (#A74AC7)
        */
        static PurpleFlower(width?: number): Pen;
        /**
         * Medium Orchid (#B048B5)
        */
        static MediumOrchid(width?: number): Pen;
        /**
         * Purple Amethyst (#6C2DC7)
        */
        static PurpleAmethyst(width?: number): Pen;
        /**
         * Dark Violet (#842DCE)
        */
        static DarkViolet(width?: number): Pen;
        /**
         * Violet (#8D38C9)
        */
        static Violet(width?: number): Pen;
        /**
         * Purple Sage Bush (#7A5DC7)
        */
        static PurpleSageBush(width?: number): Pen;
        /**
         * Lovely Purple (#7F38EC)
        */
        static LovelyPurple(width?: number): Pen;
        /**
         * Purple (#8E35EF)
        */
        static Purple(width?: number): Pen;
        /**
         * Aztech Purple (#893BFF)
        */
        static AztechPurple(width?: number): Pen;
        /**
         * Medium Purple (#8467D7)
        */
        static MediumPurple(width?: number): Pen;
        /**
         * Jasmine Purple (#A23BEC)
        */
        static JasminePurple(width?: number): Pen;
        /**
         * Purple Daffodil (#B041FF)
        */
        static PurpleDaffodil(width?: number): Pen;
        /**
         * Tyrian Purple (#C45AEC)
        */
        static TyrianPurple(width?: number): Pen;
        /**
         * Crocus Purple (#9172EC)
        */
        static CrocusPurple(width?: number): Pen;
        /**
         * Purple Mimosa (#9E7BFF)
        */
        static PurpleMimosa(width?: number): Pen;
        /**
         * Heliotrope Purple (#D462FF)
        */
        static HeliotropePurple(width?: number): Pen;
        /**
         * Crimson (#E238EC)
        */
        static Crimson(width?: number): Pen;
        /**
         * Purple Dragon (#C38EC7)
        */
        static PurpleDragon(width?: number): Pen;
        /**
         * Lilac (#C8A2C8)
        */
        static Lilac(width?: number): Pen;
        /**
         * Blush Pink (#E6A9EC)
        */
        static BlushPink(width?: number): Pen;
        /**
         * Mauve (#E0B0FF)
        */
        static Mauve(width?: number): Pen;
        /**
         * Wisteria Purple (#C6AEC7)
        */
        static WisteriaPurple(width?: number): Pen;
        /**
         * Blossom Pink (#F9B7FF)
        */
        static BlossomPink(width?: number): Pen;
        /**
         * Thistle (#D2B9D3)
        */
        static Thistle(width?: number): Pen;
        /**
         * Periwinkle (#E9CFEC)
        */
        static Periwinkle(width?: number): Pen;
        /**
         * Lavender Pinocchio (#EBDDE2)
        */
        static LavenderPinocchio(width?: number): Pen;
        /**
         * Lavender blue (#E3E4FA)
        */
        static Lavenderblue(width?: number): Pen;
        /**
         * Pearl (#FDEEF4)
        */
        static Pearl(width?: number): Pen;
        /**
         * SeaShell (#FFF5EE)
        */
        static SeaShell(width?: number): Pen;
        /**
         * Milk White (#FEFCFF)
        */
        static MilkWhite(width?: number): Pen;
        /**
         * White (#FFFFFF)
        */
        static White(width?: number): Pen;
    }
}
