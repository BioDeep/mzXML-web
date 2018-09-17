<?php

namespace BioDeep\IO {

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
            $title  = Utils::ReadValue($meta, "title", "Custom Generated Mgf Document");
            $mz     = Utils::ReadValue($meta, "mz", "NA");
            $rt     = Utils::ReadValue($meta, "rt", "NA");
            $charge = Utils::ReadValue($meta, "charge", "NA"); 

            $mgf->AppendLine("TITLE=$title")
                ->AppendLine("RTINSECONDS=$rt")
                ->AppendLine("PEPMASS=$mz 100")
                ->AppendLine("CHARGE=$charge");

            foreach($ms2 as $mzinto) {
                $mz   = $mzinto["mz"];
                $into = $mzinto["into"];
                $mgf->AppendLine("$mz $into");
            }

            $mgf->AppendLine(self::EndIons);

            return $mgf->ToString();
        }
    }
}