<?php

namespace BioDeep {

    class MolWeight {

        private static $weights = [
            "H"       => 1.007276,
            "Na"      => 22.98976928,
            "NH4"     => 18.035534,
            "K"       => 39.0983,
            "H2O"     => 18.01471,
            "ACN"     => 41.04746, # Acetonitrile (CH3CN)
            "CH3OH"   => 32.03773,
            "DMSO"    => 78.12089, # dimethyl sulfoxide (CH3)2SO 
            "IsoProp" => 61.065340 # Unknown
        ];
        
        public static function Eval($formula) {

        }
    }
}