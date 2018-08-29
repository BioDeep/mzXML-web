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
            $calc = PrecursorType::LoadDefault();
            $out  = [];

            foreach($calc as $name => $cal) {
                $out[] = [
                    "precursor_type" => $cal->Name,
                    "charge"         => $cal->charge,
                    "M"              => $cal->M,
                    "adduct"         => $cal->adduct,
                    "m/z"            => $cal->CalMz($mass)
                ];
            }

            return $out;
        }
    }
}