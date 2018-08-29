<?php

namespace BioDeep {

    /**
     * https://github.com/xieguigang/MassSpectrum-toolkits/blob/6f4284a0d537d86c112877243d9e3b8d9d35563f/DATA/ms2_math-core/Ms1/PrecursorType.vb
    */
    class PrecursorType {

        var $Name;
        var $charge;
        var $M;
        var $adducts;

        /**
         * @param double $charge 电荷数，这里只需要绝对值就行了，不需要带有符号
         * @param string $type 前体离子的类型名称
        */
        public function __construct($type, $charge, $M, $adducts) {
            $this->Name    = $type;
            $this->charge  = $charge;
            $this->M       = $M;
            $this->adducts = $adducts;
        }

        /**
         * 从MS/MS之中的加和物离子的m/z结果 precursorMZ 反推回mass结果的计算过程
        */
        public function Mass($mz) {
            return Utils::ReverseMass($mz, $this->M, $this->charge, $this->adducts);
        }

        public function CalMz($mass) {
            return Utils::AdductMz($mass * $this->M, $this->adducts, $this->charge);
        }

        /**
         * 为了方便编写代码
        */
        private static function new($type, $charge, $M, $adducts) {
            $adducts = \BioDeep\MolWeight::Eval($adducts);
            return new \BioDeep\PrecursorType($type, $charge, $M, $adducts);
        }

        /**
         * 返回预设的阳离子计算组
        */
        public static function Positive() {
            return [
                "M+3H"           => self::new("[M+3H]3+",          3, 1, "3H"),           # M/3 + 1.007276   3+	0.33	1.007276	285.450906	291.099391
                "M+2H+Na"        => self::new("[M+2H+Na]3+",       3, 1, "2H+Na"),        # M/3 + 8.334590   3+	0.33	8.334590	292.778220	283.772077
                "M+H+2Na"        => self::new("[M+H+2Na]3+",       3, 1, "H+2Na"),        # M/3 + 15.7661904 3+	0.33	15.766190	300.209820	276.340476
                "M+3Na"          => self::new("[M+3Na]3+",         3, 1, "3Na"),          # M/3 + 22.989218	 3+	0.33	22.989218	307.432848	269.117449
                "M+2H"           => self::new("[M+2H]2+",          2, 1, "2H"),           # M/2 + 1.007276	 2+	0.50	1.007276	427.672721	437.152724
                "M+H+NH4"        => self::new("[M+H+NH4]2+",       2, 1, "H+NH4"),        # M/2 + 9.520550	 2+	0.50	9.520550	436.185995	428.639450
                "M+H+Na"         => self::new("[M+H+Na]2+",        2, 1, "H+Na"),         # M/2 + 11.998247	 2+	0.50	11.998247	438.663692	426.161753
                "M+H+K"          => self::new("[M+H+K]2+",         2, 1, "H+K"),          # M/2 + 19.985217	 2+	0.50	19.985217	446.650662	418.174783
                "M+ACN+2H"       => self::new("[M+ACN+2H]2+",      2, 1, "ACN+2H"),       # M/2 + 21.520550	 2+	0.50	21.520550	448.185995	416.639450
                "M+2Na"          => self::new("[M+2Na]2+",         2, 1, "2Na"),          # M/2 + 22.989218	 2+	0.50	22.989218	449.654663	415.170782
                "M+2ACN+2H"      => self::new("[M+2ACN+2H]2+",     2, 1, "2ACN+2H"),      # M/2 + 42.033823	 2+	0.50	42.033823	468.699268	396.126177
                "M+3ACN+2H"      => self::new("[M+3ACN+2H]2+",     2, 1, "3ACN+2H"),      # M/2 + 62.547097	 2+	0.50	62.547097	489.212542	375.612903
                "M+H"            => self::new("[M+H]+",            1, 1, "H"),            #  M + 1.007276	 1+	1.00	1.007276	854.338166	875.312724
                "M+NH4"          => self::new("[M+NH4]+",          1, 1, "NH4"),          #  M + 18.033823	 1+	1.00	18.033823	871.364713	858.286177
                "M+Na"           => self::new("[M+Na]+",           1, 1, "Na"),           #  M + 22.989218	 1+	1.00	22.989218	876.320108	853.330782
                "M+CH3OH+H"      => self::new("[M+CH3OH+H]+",      1, 1, "CH3OH+H"),      #  M + 33.033489	 1+	1.00	33.033489	886.364379	843.286511
                "M+K"            => self::new("[M+K]+",            1, 1, "K"),            #  M + 38.963158	 1+	1.00	38.963158	892.294048	837.356842
                "M+ACN+H"        => self::new("[M+ACN+H]+",        1, 1, "ACN+H"),        #  M + 42.033823	 1+	1.00	42.033823	895.364713	834.286177
                "M+2Na-H"        => self::new("[M+2Na-H]+",        1, 1, "2Na-H"),        #  M + 44.971160	 1+	1.00	44.971160	898.302050	831.348840
                "M+IsoProp+H"    => self::new("[M+IsoProp+H]+",    1, 1, "IsoProp+H"),    #  M + 61.06534	 1+	1.00	61.065340	914.396230	815.254660
                "M+ACN+Na"       => self::new("[M+ACN+Na]+",       1, 1, "ACN+Na"),       #  M + 64.015765	 1+	1.00	64.015765	917.346655	812.304235
                "M+2K-H"         => self::new("[M+2K-H]+",         1, 1, "2K-H"),         #  M + 76.919040	 1+	1.00	76.919040	930.249930	799.400960
                "M+DMSO+H"       => self::new("[M+DMSO+H]+",       1, 1, "DMSO+H"),       #  M + 79.02122	 1+	1.00	79.021220	932.352110	797.298780
                "M+2ACN+H"       => self::new("[M+2ACN+H]+",       1, 1, "2ACN+H"),       #  M + 83.060370	 1+	1.00	83.060370	936.391260	793.259630
                "M+IsoProp+Na+H" => self::new("[M+IsoProp+Na+H]+", 1, 1, "IsoProp+Na+H"), #  M + 84.05511	 1+	1.00	84.055110	937.386000	792.264890
                "2M+H"           => self::new("[2M+H]+",           1, 2, "H"),            # 2M + 1.007276	 1+	2.00	1.007276	1707.669056	1751.632724
                "2M+NH4"         => self::new("[2M+NH4]+",         1, 2, "NH4"),          # 2M + 18.033823	 1+	2.00	18.033823	1724.695603	1734.606177
                "2M+Na"          => self::new("[2M+Na]+",          1, 2, "Na"),           # 2M + 22.989218	 1+	2.00	22.989218	1729.650998	1729.650782
                "2M+3H2O+2H"     => self::new("[2M+3H2O+2H]2+",    2, 2, "3H2O+2H"),
                "2M+K"           => self::new("[2M+K]+",           1, 2, "K"),            # 2M + 38.963158	 1+	2.00	38.963158	1745.624938	1713.676842
                "2M+ACN+H"       => self::new("[2M+ACN+H]+",       1, 2, "ACN+H"),        # 2M + 42.033823	 1+	2.00	42.033823	1748.695603	1710.606177
                "2M+ACN+Na"      => self::new("[2M+ACN+Na]+",      1, 2, "ACN+Na")        # 2M + 64.015765	 1+	2.00	64.015765	1770.677545	1688.624235
            ];
        }

        public static function Negative() {
            return [
                "M-3H"	         => self::new("[M-3H]3-",         -3, 1, "-3H"),    # M/3 -   1.007276	 3-	0.33	-1.007276	283.436354	293.113943
                "M-2H"	         => self::new("[M-2H]2-",         -2, 1, "-2H"),    # M/2 -   1.007276	 2-	0.50	-1.007276	425.658169	439.167276
                "M-H2O-H"	     => self::new("[M-H2O-H]-",       -1, 1, "-H2O-H"), # M   -  19.01839    1-	1.00	-19.01839	834.312500	895.338390
                "M-H"	         => self::new("[M-H]-",           -1, 1, "-H"),     # M   -   1.007276	 1-	1.00	-1.007276	852.323614	877.327276
                "M+Na-2H"	     => self::new("[M+Na-2H]-",       -1, 1, "Na-2H"),  # M   +  20.974666	 1-	1.00	20.974666	874.305556	855.345334
                "M+Cl"	         => self::new("[M+Cl]-",          -1, 1, "Cl"),     # M   +  34.969402	 1-	1.00	34.969402	888.300292	841.350598
                "M+K-2H"	     => self::new("[M+K-2H]-",        -1, 1, "K-2H"),   # M   +  36.948606	 1-	1.00	36.948606	890.279496	839.371394
                "M+FA-H"	     => self::new("[M+FA-H]-",        -1, 1, "FA-H"),   # M   +  44.998201	 1-	1.00	44.998201	898.329091	831.321799
                "M+Hac-H"	     => self::new("[M+Hac-H]-",       -1, 1, "Hac-H"),  # M   +  59.013851	 1-	1.00	59.013851	912.344741	817.306149
                "M+Br"	         => self::new("[M+Br]-",          -1, 1, "Br"),     # M   +  78.918885	 1-	1.00	78.918885	932.249775	797.401115
                "M+TFA-H"	     => self::new("[M+TFA-H]-",       -1, 1, "TFA-H"),  # M   + 112.985586	 1-	1.00	112.985586	966.316476	763.334414
                "2M-H"	         => self::new("[2M-H]-",          -1, 2, "-H"),     # 2M  -   1.007276	 1-	2.00	-1.007276	1705.654504	1753.647276
                "2M+FA-H"	     => self::new("[2M+FA-H]-",       -1, 2, "FA-H"),   # 2M  +  44.998201	 1-	2.00	44.998201	1751.659981	1707.641799
                "2M+Hac-H"	     => self::new("[2M+Hac-H]-",      -1, 2, "Hac-H"),  # 2M  +  59.013851	 1-	2.00	59.013851	1765.675631	1693.626149
                "3M-H"	         => self::new("[3M-H]-",          -1, 3, "-H")      # 3M  -   1.007276	 1-	3.00	1.007276	2560.999946	2627.952724
            ];
        }

        /**
         * 加载指定模式的预设的``m/z``计算模块
         * 
         * @param string|integer $mode When this parameter is string type, required 
         *      value should be one of the value of ``+/-``, 
         *      and ``1/-1`` when the parameter value type is integer.
        */
        public static function LoadDefault($mode) {
            if ($mode == 1 || $mode == "+") {
                return self::Positive();
            } else if ($mode == -1 || $mode == "-") {
                return self::Negative();
            } else {
                throw new \exception("Invalid ion mode!");
            }
        }
    }
}