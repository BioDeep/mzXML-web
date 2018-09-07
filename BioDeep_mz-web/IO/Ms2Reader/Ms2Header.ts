/// <reference path="../../../../build/linq.d.ts" />
/// <reference path="../../Models/Abstract.ts" />

/**
 * The ``*.ms2`` file format reader
*/
namespace BioDeep.IO.Ms2Reader {

    export class Ms2Header {

        /**
         * The date and time when the file was created
        */
        public get CreationDate(): string {
            return this.meta.GetValue();
        };
        /**
         * The name of the software used to create the MS2 file
        */
        public get Extractor(): string {
            return this.meta.GetValue();
        };
        /**
         * The version number of the Extractor software
        */
        public get ExtractorVersion(): string {
            return this.meta.GetValue("Extractor version");
        };
        public get SourceFile(): string {
            return this.meta.GetValue("Source file");
        };
        /**
         * Remarks. Multiple comment lines are allowed
        */
        public get Comments(): string {
            return this.meta.GetValue();
        };

        /**
         * The options used in running the extractor software
        */
        public get ExtractorOptions(): string {
            return this.meta.GetValue();
        };

        private static readonly fieldMaps = {
            "ExtractorVersion": "Extractor version",
            "SourceFile": "Source file"
        };

        private readonly meta: TsLinq.MetaReader;

        public constructor(data: string[]) {
            var tags = From(data)
                .Select(s => s.substr(2))
                .Select(s => {
                    if (s.indexOf("\t") > -1) {
                        return Strings.GetTagValue(s, "\t");
                    } else {
                        return Strings.GetTagValue(s, " ");
                    }
                });

            this.meta = TypeInfo.CreateMetaReader(tags);
        }
    }
}