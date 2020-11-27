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
        let url: string = sprintf(api, encodeURIComponent(id));
        let chart: HTMLElement = $ts(containerId);
        let size: Canvas.Size = SvgUtils.getSize(chart, [960, 600]);

        $ts.get(url, function (result: {
            code: number,
            info: string | Data.JSONrespon
        }) {
            if (result.code == 0) {
                let data: Data.mzData = Data.JSONParser(<Data.JSONrespon>(result.info), decoder);
                let d3 = new d3Renderer(data, size);

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
    export function previews(
        divId: string | HTMLElement,
        data: Data.mzData | BioDeep.IO.mgf,
        size: number[] = [900, 600],
        title: string = BioDeep.MSMSViewer.title,
        margin: Canvas.Margin = renderingWork.defaultMargin(),
        csvLink: string = "matrix-csv"): void {

        if (data instanceof BioDeep.IO.mgf) {
            return new d3Renderer(parseIon(data), size, margin, csvLink, title).rendering(divId);
        } else {
            return new d3Renderer(data, size, margin, csvLink, title).rendering(divId);
        }
    }

    export function parseIon(ion: BioDeep.IO.mgf): Data.mzData {
        let mzRange = $ts.doubleRange(ion.Select(m => m.mz));
        let mirror: Models.mzInto[] = [];
        let uid: string = ion.xcms_uid;

        console.log(uid);

        for (let m of ion.ToArray()) {
            mirror.push(m);
            mirror.push(<Models.mzInto>{
                mz: m.mz,
                into: -m.into,
                id: m.id + "mirror"
            });
        }

        return new Data.mzData(mzRange, mirror).info(uid, ion.title, uid);
    }
}

