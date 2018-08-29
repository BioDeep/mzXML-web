<?php

namespace BioDeep {

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
            return $mass / abs($charge) + $adduct;
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
            return ($precursorMZ - $adduct) * abs($charge) / $M;
        }
    }
}
