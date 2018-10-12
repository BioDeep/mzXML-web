﻿namespace BioDeep.Utils {

    /**
     * 因为D3里面的text不支持html标签，所以需要使用这个函数将名称
     * 之中的html标记去除
     * 
    */
    export function stripHTML(html: string): string {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    /**
     * Returns path data for a rectangle with rounded right corners.
     * The top-left corner is (x,y).
    */
    export function rightRoundedRect(
        x: number, y: number,
        width: number, height: number,
        radius: number): string {

        return "M" + x + "," + y
            + "h" + (width - radius)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
            + "v" + (height - 2 * radius)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
            + "h" + (radius - width)
            + "z";
    }
}