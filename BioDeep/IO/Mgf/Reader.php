<?php

namespace BioDeep\IO {

    Imports("System.Object");
    Imports("Microsoft.VisualBasic.FileIO.FileSystem");

    /**
     * The mgf ion object model
    */
    class MgfIon extends \System\TObject {
        
        /**
         * @var PrecursorIon
        */
        public $precursor;
        /**
         * @var MzInto[] 
        */
        public $MzInto;

        public function __construct(PrecursorIon $precursor, $mzInto) {
            $this->precursor = $precursor;
            $this->MzInto    = $mzInto;
        }

        public function ToString() {
            return $this->precursor->ToString();
        }

        /**
         * @param string $file File path or file content.
         * 
         * @return \BioDeep\IO\MgfIon[]
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
         * 
         * @return \BioDeep\IO\MgfIon
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
                        $values              = explode(" ", $value);
                        $header[$name]       = $values[0];
                        $header["INTENSITY"] = $values[1];
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

            return new \BioDeep\IO\MgfIon(
                $precursor = self::mgfHeader($header),
                $MzInto    = $mzInto
            );
        }

        /**
         * @return PrecursorIon
        */
        private static function mgfHeader($data) {
            return new \BioDeep\IO\PrecursorIon(
                $mz     = $data["PEPMASS"],
                $rt     = $data["RTINSECONDS"],
                $into   = $data["INTENSITY"],
                $charge = $data["CHARGE"],
                $title  = $data["TITLE"]
            );
        }
    }
}