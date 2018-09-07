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

    export function stackTrace() {
        var err = new Error().stack.split("\n");
        var trace = From(err).Skip(1)
            .Select(s => s.trim())
            .Select(line => {
                var file = line.match(/\(.+\)/)[0];
                var caller = line.replace(file, "").trim().substr(3);

                file = file.substr(1, file.length - 2);

                var pos = file.match(/([:]\d+){2}$/m)[0];

                file = file.substr(0, file.length - pos.length);

                var aliases = caller.match(/\[.+\]/);
                var alias = (!aliases || aliases.length == 0) ? null : aliases[0];

                if (alias) {
                    caller = caller.substr(0, caller.length - alias.length).trim();
                    alias = alias.substr(3, alias.length - 4).trim();
                } else {
                    var t = caller.split(".");
                    alias = t[t.length - 1];
                }

                return { file: file, member: alias, location: pos.split(":"), caller: caller };
            });

        return trace.ToArray();
    }
}