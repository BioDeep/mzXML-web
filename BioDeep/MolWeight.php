<?php

namespace BioDeep {

    Imports("System.Text.RegularExpressions.Regex");

    class MolWeight {

        private static $weights = [
                  "H" => 1.007276,
                 "Na" => 22.98976928,
                "NH4" => 18.035534,
                  "K" => 39.0983,
                "H2O" => 18.01471,
                "ACN" => 41.04746,  # Acetonitrile (CH3CN)
              "CH3OH" => 32.03773,
               "DMSO" => 78.12089,  # dimethyl sulfoxide (CH3)2SO 
            "IsoProp" => 61.065340  # Unknown
        ];
        
        public static function Eval($formula) {
            $mt = \Regex::Split($formula,   "[+-]");
            $op = \Regex::Matches($formula, "[+-]");
            $x  = 0;

            for($i = 0; $i < count($mt); $i++) {
                $token = self::Mul($mt[$i]);
                
            }
        }

        /**
         * returns ``[name => ..., M => x]``
        */
        private static function Mul($token) {
            $n   = "";
            $len = strlen($token);
            $x0  = ord("0");
            $x9  = ord("9");

            for($i = 0; $i < $len; $i++) {
                $x = ord($token[$i]);

                if ($x > $x0 && $x <= $x9) {
                    $n = $n . $x;
                } else {
                    break;
                }
            }

            if (\strlen($n) == 0) {
                return ["name" => $token, "M" => 1];
            } else {
                $token = substr($token, strlen($n));
            }
            
            return [
                "name" => $token, 
                "M"    => intval($n)
            ];
        }
    }
}