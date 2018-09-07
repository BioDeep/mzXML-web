namespace BioDeep {

    /**
     * 将文本字符串按照newline进行分割
    */
    export function lineTokens(text: string): string[] {
        return (!text) ? <string[]>[] : text.trim().split("\n");
    }
}