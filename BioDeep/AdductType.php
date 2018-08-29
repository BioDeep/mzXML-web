<?php

namespace BioDeep {

    class AdductTypes {
        
        ## 通过计算出最小的质量差来获取前体离子的类型信息

        ## @param charge 离子的电荷数量
        ## @param mass 分子质量
        ## @param precursorMZ MS/MS之中的MS1匹配上的前体离子质核比
        ##
        ## 计算的公式为：
        ##
        ## (mass/charge + precursor_ion_mass) = precursorMZ
        ##
        ## 算法的原理是使用数据库之中的质量分别遍历当前计算器内的前体离子的质量的和除以电荷数量
        ## 得到的结果与MS1的质核比结果进行比较
        ## 得到的最小的差值所对应的前体离子即为我们所需要查找的离子化模式
        ##
        ## test
        ##
        ## mass = 853.33089
        ##
        ## pos "[M+3Na]3+" charge = 3,  307.432848	find.PrecursorType(853.33089, 307.432848,  charge = 3)
        ## pos "[2M+K]+"   charge = 1,  1745.624938	find.PrecursorType(853.33089, 1745.624938, charge = 1)
        ## pos "[M+H]+"    charge = 1,  854.338166	find.PrecursorType(853.33089, 854.338166,  charge = 1)
        ##
        ## neg "[M-3H]3-"  charge = -3, 283.436354	find.PrecursorType(853.33089, 283.436354,  charge = -3, chargeMode = "-")
        ## neg "[3M-H]-"   charge = -1, 2560.999946	find.PrecursorType(853.33089, 2560.999946, charge = -1, chargeMode = "-")
        ## neg "[M-H]-"    charge = -1, 852.323614  find.PrecursorType(853.33089, 852.323614,  charge = -1, chargeMode = "-")
        ##
        public static function measurePrecursorType($mass, $precursorMZ, $charge, $chargeMode = "+", $minErrorPpm = 100) {
            if ($charge == 0) {
                throw new \exception("I can't calculate the ionization mode for no charge(charge = 0)!");
            }

            if (empty($mass) || empty($precursorMZ) || $mass === false || $precursorMZ === false) {		
                return "NA";
            }

            if (Utils::PPM($precursorMZ, $mass / abs($charge)) <= $minErrorPpm) {
                # 本身的分子质量和前体的mz一样，说明为[M]类型
                $charge = abs($charge);

                if ($charge == 1) {
                    # +/- 一个电荷，可以省略掉1
                    return "[M]$chargeMode";
                } else {
                    # 电荷量不省略
                    return "[M]{$charge}{$chargeMode}";
                }
            }

           
            $min     = 999999;
            $minType = NULL;

            ## 得到某一个离子模式下的计算程序
            $mode    = MzCalculator::$Calculator[$chargeMode];

            if ($chargeMode == "-") {
                ## 对于负离子模式而言，虽然电荷量是负数的，但是使用xcms解析出来的却是一个电荷数的绝对值
                ## 所以需要判断一次，乘以-1
                if ($charge > 0) {
                    $charge = -1 * $charge;
                }
            }

            ## 然后遍历这个模式下的所有离子前体计算
            foreach ($mode as $name => $calc) {
                ## 跳过电荷数不匹配的离子模式计算表达式
                if ($charge != $calc->charge) {
                    continue;
                }

                ## 这里实际上是根据数据库之中的分子质量，通过前体离子的质量计算出mz结果
                ## 然后计算mz计算结果和precursorMZ的ppm信息
                $massR = $calc->Mass($precursorMZ);
                $deltaPpm = \BioDeep\Utils::PPM($massR, $mass);

                ## 根据质量计算出前体质量，然后计算出差值
                if ($deltaPpm < $min) {
                    $min    = $deltaPpm;
                    $minType = $calc->Name;
                }
            }
        
            if ($min <= $minErrorPpm) {
            return $minType;
            } else {

            return "NA";
            }
        }

        /**
         * 每一个模式都计算一遍，然后返回最小的ppm差值结果
        */
        private static function measureImpl() {

        }
    }
}