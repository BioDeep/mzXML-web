namespace BioDeep {

    export const x0: number = "0".charCodeAt(0);
    export const x9: number = "9".charCodeAt(0);

    export function isNumber(text: string): boolean {
        var code = text.charCodeAt(0);
        return code >= x0 && code <= x9;
    }

    /**
     * 将文本字符串按照newline进行分割
    */
    export function lineTokens(text: string): string[] {
        return (!text) ? <string[]>[] : text.trim().split("\n");
    }
}