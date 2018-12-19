/**
 * ## mzXML file reader and javascript data visualization tools
 * 
 * - http://www.biodeep.cn
 * 
 * > https://github.com/BioDeep/mzXML-web
*/
namespace BioDeep.MSMSViewer {

    export const title: string = "BioDeep® MS/MS alignment viewer";

    export function renderChart(containerId: string, api: string, id: string, decoder: ((string) => Models.mzInto[]) = null): void {
        var url: string = sprintf(api, encodeURIComponent(id));
        var chart: HTMLElement = $ts(containerId);
        var size: Canvas.Size = SvgUtils.getSize(chart, [960, 600]);

        $.getJSON(url, function (result: {
            code: number,
            info: string | Data.JSONrespon
        }) {
            if (result.code == 0) {
                var data: Data.mzData = Data.JSONParser(<Data.JSONrespon>(result.info), decoder);
                var d3 = new d3Renderer(data, size);

                d3.rendering(containerId);
            } else {
                // 显示错误消息
                throw <string>result.info + " " + url;
            }
        });
    }

    /**
     * 注释输出的svg id和数据源的api链接，然后返回渲染动作的函数指针
     * 
     * @param svgDisplay 需要显示SVG图表的html的节点的id编号属性值
     * @param api 这个参数为url字符串模板，指示如何从服务器获取绘图数据，使用%s占位符标记资源编号
     *            api所返回来的数据应该是满足``JSONrespon``对象的格式要求的
     * 
     * @returns ``(res_id: string) => void``
    */
    export function register(svgDisplay: string, api: string, decoder: ((string) => Models.mzInto[]) = null): (res_id: string) => void {
        return (res_id: string) => {
            BioDeep.MSMSViewer.renderChart(svgDisplay, api, res_id, decoder);
        }
    }

    /**
     * 将所给定的质谱图数据显示在给定的div之中
     * 
     * @param divId 如果实际运行中使用节点的id编号属性字符串出现空值错误的话，
     *     可以将这个参数由id字符串变为实际的节点对象值
     * @param data 图表绘图数据，请注意，需要这个数据是一个镜像数据
    */
    export function previews(divId: string | HTMLElement, data: Data.mzData, size: number[] = null): void {
        new d3Renderer(data, size).rendering(divId);
    }
}

