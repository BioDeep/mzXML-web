namespace BioDeep.IO.MzWebCache {

    const scan_delimiter: string = "-----";

    export function loadStream(text: string, name: string = "unknown"): Stream {
        let lines: string[] = Strings.lineTokens(text);
        let stream: Stream = new Stream(name);
        let buffer: string[] = [];

        for (let line of lines) {
            line = line.trim();

            if (scan_delimiter == line) {
                stream.add(blockBuffer(buffer));
                buffer = [];
            } else {
                buffer.push(line);
            }
        }

        return stream;
    }

    export function blockBuffer(buffer: string[]): StreamCacheBlock[] {
        let blocks: StreamCacheBlock[] = [];
        let i: number = 0;
        let cache: StreamCacheBlock = <any>{};

        for (let line of buffer) {
            switch (++i) {
                case 1:
                    cache.scan_id = line;
                    break;
                case 2:
                    cache.data = line;
                    break;
                case 3:
                    cache.mz_base64 = line;
                    break;
                case 4:
                    cache.into_base64 = line;
                    i = 0;
                    blocks.push(cache);
                    cache = <any>{};
                    break;
            }
        }

        if (i != 0) {
            console.warn("invalid file format!");
        }

        return blocks;
    }

    export function parseMs2Vector(cache: StreamCacheBlock) {
        let data: number[] = parseVector(cache.data);

        return {
            mz: data[0],
            rt: data[1],
            intensity: data[2],
        }
    }

    export function parseMs1Vector(cache: StreamCacheBlock) {
        let data: number[] = parseVector(cache.data);

        return {
            rt: data[0],
            BPC: data[1],
            TIC: data[2]
        };
    }

    export function parseMs1(cache: StreamCacheBlock) {
        let data: number[] = parseVector(cache.data);

        return <ScanMs1>{
            scan_id: cache.scan_id,
            rt: data[0],
            BPC: data[1],
            TIC: data[2],
            mz: Base64.bytes_decode(cache.mz_base64),
            into: Base64.bytes_decode(cache.into_base64)
        }
    }

    function parseVector(text: string): number[] {
        return $from(text.split(","))
            .Select(str => parseFloat(str))
            .ToArray()
            ;
    }

    export function parseMs2(cache: StreamCacheBlock) {
        let data: number[] = parseVector(cache.data);

        return <ScanMs2>{
            scan_id: cache.scan_id,
            parentMz: data[0],
            rt: data[1],
            intensity: data[2],
            mz: Base64.bytes_decode(cache.mz_base64),
            into: Base64.bytes_decode(cache.into_base64)
        };
    }
}