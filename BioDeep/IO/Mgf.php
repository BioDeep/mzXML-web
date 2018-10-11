<?php

namespace BioDeep\IO {

    Imports("System.Linq.IEnumerator");
    Imports("System.Text.StringBuilder");

    class Mgf {

        public const BeginIons = "BEGIN IONS";
        public const EndIons   = "END IONS";

        /**
         * 生成一个mgf对象数据
         * 
         * @param array $meta 在这个字典数组之中应该至少要包括有字段：``mz``，``rt``，可选字段有``title``，``charge``。
         * @param array $ms2 二级质谱数据矩阵，格式为[mz => xxx, into => xxx]的数组
         * 
         * @return string
        */
        public static function CreateDocument($meta, $ms2) {
            $mgf = new \StringBuilder();
            $mgf->AppendLine(self::BeginIons);
            $title  = \Utils::ReadValue($meta, "title", "Custom Generated Mgf Document");
            $mz     = \Utils::ReadValue($meta, "mz", "NA");
            $rt     = \Utils::ReadValue($meta, "rt", "NA");
            $charge = \Utils::ReadValue($meta, "charge", "NA"); 

            $mgf->AppendLine("TITLE=$title")
                ->AppendLine("RTINSECONDS=$rt")
                ->AppendLine("PEPMASS=$mz 100")
                ->AppendLine("CHARGE=$charge");

            if (self::isMzIntoVectorTuple($ms2)) {
                $mz   = $ms2["mz"];
                $into = $ms2["into"];

                for($i = 0; $i < count($mz); $i++) {
                    $mzi   = $mz[$i];
                    $intoi = $into[$i];
                    $mgf->AppendLine("$mzi $intoi");
                }
            } else {
                foreach($ms2 as $mzinto) {
                    $mz   = $mzinto["mz"];
                    $into = $mzinto["into"];
                    $mgf->AppendLine("$mz $into");
                }
            }

            $mgf->AppendLine(self::EndIons);

            return $mgf->ToString();
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