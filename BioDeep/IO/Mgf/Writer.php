<?php

namespace BioDeep\IO {

    Imports("System.Linq.IEnumerator");
    Imports("System.Text.StringBuilder");

    class MgfWriter {

        public static $BeginIons = "BEGIN IONS";
        public static $EndIons   = "END IONS";

        /**
         * 生成一个mgf对象数据
         * 
         * @param array|PrecursorIon $meta 在这个字典数组之中应该至少要包括有字段：``mz``，``rt``，
         *                                 可选字段有``title``，``charge``。
         * @param array|MzInto[] $ms2 二级质谱数据矩阵，格式为``[mz => xxx, into => xxx]``的数组
         * 
         * @return string
        */
        public static function CreateDocument($meta, $ms2) {
            $mgf = new \StringBuilder();
            $mgf->AppendLine(self::$BeginIons);
            $title  = \Utils::ReadValue($meta, "title", "Custom Generated Mgf Document");
            $mz     = \Utils::ReadValue($meta, "mz", "NA");
            $rt     = \Utils::ReadValue($meta, "rt", "NA");
            $charge = \Utils::ReadValue($meta, "charge", "NA");
            $into   = \Utils::ReadValue($meta, "into", 100);

            $mgf->AppendLine("TITLE=$title")
                ->AppendLine("RTINSECONDS=$rt")
                ->AppendLine("PEPMASS=$mz $into")
                ->AppendLine("CHARGE=$charge");
            $mgf->AppendLine(rtrim(self::SpectraMs2($ms2), "\r\n"));
            // 在这里不使用AppendLine，否则会多出来一个换行符的
            $mgf->Append(self::$EndIons);

            return $mgf->ToString();
        }

        private static function SpectraMs2($ms2) {
            if (self::isMzIntoVectorTuple($ms2)) {
                return self::VectorTupleMatrix($ms2);
            } else {
                return self::FragmentArrayMatrix($ms2);
            }
        }

        private static function FragmentArrayMatrix($ms2) {
            if (is_array($ms2[0])) {
                $spectra = new \StringBuilder();

                foreach($ms2 as $mzinto) {
                    $mz   = $mzinto["mz"];
                    $into = $mzinto["into"];
                    $spectra->AppendLine("$mz $into");
                }

                return $spectra->ToString();
            } else {
                return self::MzIntoMatrix($ms2);
            }
        }

        /**
         * @param MzInto[] $ms2
        */
        public static function MzIntoMatrix($ms2, $deli = " ") {
            $spectra = new \StringBuilder();

            foreach($ms2 as $mzinto) {
                $mz   = $mzinto->mz;
                $into = $mzinto->into;
                $spectra->AppendLine($mz . $deli . $into);
            }
            return $spectra->ToString();
        }

        private static function VectorTupleMatrix($ms2) {
            $spectra = new \StringBuilder();

            $mz   = $ms2["mz"];
            $into = $ms2["into"];

            for($i = 0; $i < count($mz); $i++) {
                $mzi   = $mz[$i];
                $intoi = $into[$i];
                $spectra->AppendLine("$mzi $intoi");
            }

            return $spectra->ToString();
        }

        /**
         * 判断二级质谱数据是否是mz与into数组向量成员构成的，即其格式是否为：
         * 
         * ``[mz => [x, x, x, x], into => [x, x, x, x]]``
        */
        public static function isMzIntoVectorTuple($ms2) {
            $names = new \IEnumerator(array_keys($ms2));

            if ($names->count() !== 2) {
                return false;
            }
            
            if ($names->SequenceEquals(["mz", "into"])) {
                return true;
            } else if ($names->SequenceEquals(["into", "mz"])) {
                return true;
            } else {
                return false;
            }
        }
    }
}