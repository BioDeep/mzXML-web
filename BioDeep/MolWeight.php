<?php

namespace BioDeep {

    imports("System.Text.RegularExpressions.Regex");

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
            "IsoProp" => 60.058064, # Unknown
                 "Cl" => 35.446,
                 "FA" => 46.00548,  # Unknown
                "Hac" => 60.04636,  # AceticAcid (CH3COOH)
                 "Br" => 79.901,
                "TFA" => 113.9929   # Unknown
        ];
        
        /**
         * get mass by symbol
         * 
         * @param string $symbol the element atom symbol name
         * 
         * @return double the exact mass of the target element atom, negative value means symbol not found.
        */
        public static function Weight($symbol) {
            if (array_key_exists($symbol, self::$weights)) {
                return self::$weights[$symbol];
            } else {
                return -1;
            }
        }

        /**
         * @param string $formula the given formula string
         * 
         * @return double the exact mass that evaluate from the given adduct formula
        */
        public static function Eval($formula) {
            if ($formula[0] == "+" || $formula[0] == "-") {
                $formula = "0H$formula";
            }

            $mt   = \Regex::Split($formula,   "[+-]");
            $op   = \Regex::Matches($formula, "[+-]");
            $x    = 0.0;
            $next = "+";

            for($i = 0; $i < count($mt); $i++) {
                $token = self::Mul($mt[$i]);
                $M     = $token["M"]; 
                $token = $token["name"];
                
                if (!array_key_exists($token, self::$weights)) {                   
                    throw new \exception("Unknown symbol in: '{$formula}', where symbol={$token}.");
                }

                if ($next == "+") {
                    $x = $x + ($M * self::$weights[$token]);
                } else {
                    $x = $x - ($M * self::$weights[$token]);
                }

                if (!empty($op) && ($op !== false) && ($i <= count($op) - 1)) {
                    $next = $op[$i];
                }
            }

            return $x;
        }

        /**
         * @return array ``[name => ..., M => x]``
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