<?php

namespace BioDeep {

    class MzCalculator {

        /**
         * Calculate ``m/z`` matrix
         * 
         * Calculate all of the m/z value by enumerate all of the precursor types.
         * 
         * @param integer $mode The ionization mode, by default is positive mode.
         *             \enumerate{
         *                \item  1: \code{positive}
         *                \item -1: \code{negative}
         *             }.
         * @param double $mass The molecule weight.
         *
         * @return array \code{m/z} dataframe for all precursor types.
        */
        public static function doCalculate($mass, $mode = 1) {
            # 枚举计算器之中的所有的前体离子的类型，然后计算完成之后返回数据框
            $calc = PrecursorType::LoadDefault($mode);
            $out  = [];

            foreach($calc as $name => $cal) {
                $mz    = $cal->CalMz($mass);
                $out[] = [
                    "precursor_type" => $cal->Name,
                    "charge"         => $cal->charge,
                    "M"              => $cal->M,
                    "adduct"         => $cal->adducts,
                    "m/z"            => $mz,
                    "mass"           => $cal->Mass($mz)
                ];
            }

            return $out;
        }
        
        /**
         * 自身可以发生离子化的类型
        */
        private static $autoIonization = [
            "[M]+" => 1, "[M]-" => -1
        ];

        /**
         * Get mass calculator
         *
         * @param string $chargeMode Character value of \code{+/-}.
        */
        public static function getMass($chargeMode, $charge, $precursorType) {
            if (array_key_exists($precursorType, self::$autoIonization)) {
                return function($x) {
                    return $x;
                };
            } else if (!($chargeMode == "+" || $chargeMode == "-")) {
                throw new \exception("Invalid charge mode value: '$chargeMode'");
            }

            $mode = \BioDeep\PrecursorType::LoadDefault($chargeMode);

            foreach($mode as $name => $calc) {
                if ($calc->Name == $precursorType) {
                    return function($x) use ($calc) {
                        return $calc->Mass($x);
                    };
                }
            }

            throw new \exception("Unsupported precursor_type value: '$precursorType'");
        }
    }
}