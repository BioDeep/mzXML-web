<?php

namespace BioDeep {

    /**
     * Biodeep MS/MS math helper
    */
    class Utils {

        /**
         * Calculate ``m/z`` value
         * 
         * @param double $mass Molecule weight
         * @param double $adduct adduct mass
         * @param integer $charge precursor charge value
         * 
         * @return double Returns the m/z value of the precursor ion
        */
        public static function AdductMz($mass, $adduct, $charge) {
            return ($mass + $adduct) / abs($charge);
        }

        /**
         * Calculate mass from ``m/z``
         * 
         * Calculate the molecule mass from precursor adduct ion ``m/z``
         * 
         * @param double $precursorMZ MS/MS precursor adduct ion ``m/z``
         * @param double $charge Net charge of the ion
         * @param double $adduct Adduct mass
         * @param integer $M The number of the molecule for formula a precursor adduct ion.
         * 
         * @return double The molecule mass.
        */
        public static function ReverseMass($precursorMZ, $M, $charge, $adduct) {
            return ($precursorMZ * abs($charge) - $adduct) / $M;
        }

        /**
         * Tolerance in Mass delta mode
         * 
         * @param double $da The mass delta value. By default if two mass value which
         *           their delta value is less than \code{0.3da}, then
         *           the predicate will be true.
         * 
         * @return callable Function returns a lambda function that can be using for
         *         tolerance predication.
        */
        public static function ToleranceDeltaMass($da = 0.3) {
            return function($a, $b) use ($da) {
                return abs($a - $b) <= $da;
            };
        }

        /**
         * Tolerance in PPM mode
         * 
         * @param double $ppm The mass ppm value. By default if two mass value which
         *            their ppm delta value is less than \code{20ppm}, then
         *            the predicate will be true.
         * 
         * @return callable Function returns a lambda function that can be using for
         *         tolerance predication.
        */
        public static function TolerancePpm($ppm = 20) {
            return function($a, $b) use ($ppm) { 
                return self::PPM($a, $b) <= $ppm;
            };
        }

        /**
         * PPM value between two mass value
        */
        public static function PPM($measured, $actualValue) {
            # 2018-7-8 without abs function for entir value, this may cause bugs in metaDNA
            # for unknown query when actualValue is negative

            # |(measure - reference)| / measure * 1000000
            return abs((($measured - $actualValue) / $actualValue) * 1000000);
        }

        /**
         * Get ionlization mode
         *
         * Get ionlization mode from a given precursor type name
         *
         * @param string $type The precursor type name, it should be in format like: \code{[M+H]+}.
         * @param boolean $numeric
         *
         * @return string|integer Function returns character \code{+} or \code{-}.
        */
        public static function getPolarity($type, $numeric = false) {
            $type = trim($type);
            $type = $type[strlen($type) - 1];

            if ($numeric) {
                return ($type === "+") ? 1 : -1;
            } else {
                return $type;
            }
        }
    }
}
