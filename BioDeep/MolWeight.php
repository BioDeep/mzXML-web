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
            "IsoProp" => 61.065340, # Unknown
                 "Cl" => 35.446,
                 "FA" => 46.00548,  # Unknown
                "Hac" => 60.04636,  # AceticAcid (CH3COOH)
                 "Br" => 79.901,
                "TFA" => 113.9929   # Unknown
        ];
        
        public static function Weight($symbol) {
            if (array_key_exists($symbol, self::$weights)) {
                return self::$weights[$symbol];
            } else {
                return -1;
            }
        }

        public static function Eval($formula) {
            if ($formula[0] == "+" || $formula[0] == "-") {
                $formula = "0H$formula";
            }

            $mt   = \Regex::Split($formula,   "[+-]");
            $op   = \Regex::Matches($formula, "[+-]");
            $x    = 0;
            $next = "+";

            for($i = 0; $i < count($mt); $i++) {
                $token = self::Mul($mt[$i]);
                $M     = $token["M"]; 
                $token = $token["name"];
                
                if (!array_key_exists($token, self::$weights)) {
                    $msg = "Unknown symbol in: '$formula', where symbol=$token";
                    throw new \exception($msg);
                }

                if ($next == "+") {
                    $x = $x + ($M * self::$weights[$token]);
                } else {
                    $x = $x - ($M * self::$weights[$token]);
                }

                if ($i <= count($op) - 1) {
                    $next = $op[$i];
                }
            }

            return $x;
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

                if ($x >= $x0 && $x <= $x9) {
                    $n = $n . $token[$i];
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