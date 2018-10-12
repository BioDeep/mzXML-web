<?php

namespace BioDeep\IO {

    Imports("Microsoft.VisualBasic.FileIO.FileSystem");

    class MgfReader {
        
        /**
         * @param string $file File path or file content.
        */
        public static function PopulateIons($file) {
            $buffer = NULL;

            foreach(\FileSystem::IteratesAllLines($file) as $line) {
                if ($line == MgfParser::BeginIons) {
                    $buffer = [$line];
                } else if ($line = MgfParser::EndIons) {
                    # Push the last line
                    array_push($buffer, $line);
                    # This is a new ion
                    # Parse this new ion data.
                    yield self::ParseIon($buffer);
                } else {
                    array_push($buffer, $line);
                }
            }
        }

        /**
         * @param string|string[] $buffer Data text content or text lines.
        */
        public static function ParseIon($buffer) {
            if (is_string($buffer)) {
                $buffer = \StringHelpers::LineTokens($buffer);
            }

            $mzInto = [];
            $header = [];
            $i      = 0;
            $line   = "";
            $name   = "";
            $value  = "";
            
            # i = 1 for skip the first line: BEGIN IONS
            for($i = 1; $i < count($buffer); $i++) {
                $line = $buffer[$i];

                if (\Strings::InStr($line, "=") > 0) {
                    $tuple              = \StringHelpers::GetTagValue($line, "=");
                    list($name, $value) = \Utils::Tuple($tuple);
                    
                    if ($name == "PEPMASS") {
                        $header[$name] = explode(" ", $value)[0];
                    } else {
                        $header[$name] = $value;
                    }
                }
            }

            # skip the last line: END IONS
            for ($i = 1; $i < count($buffer) - 1; $i++) {
                $line = explode(" ", $buffer[$i]);
                $data = new MzInto($line[0], $line[1]);

                array_push($mzInto, $data);
            }

            return [
                "headers" => $header, 
                "MzInto"  => $mzInto
            ];
        }
    }
}