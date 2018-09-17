<?php

namespace BioDeep\IO {

    /**
     * 读取一级质谱或者二级质谱的扫描结果数据
    */
    class ScanReader {

        /**
         * @var scan
        */
        var $scan;
        /**
         * @var precursorMz
        */
        var $precursorMz;
        /**
         * @var peaks
        */
        var $peaks;

        /**
         * @param array $scan 某一个一级质谱或者二级质谱的扫描数据，这个数组之中至少应该要包括有
         *                    scan, precursorMz, 以及peaks这三个属性成员
        */
        public function __construct($scan) {
            $this->scan        = new scan(\Utils::ReadValue($scan, "scan", []));
            $this->precursorMz = new precursorMz(\Utils::ReadValue($scan, "precursorMz", []));
            $this->peaks       = new peaks(\Utils::ReadValue($scan, "peaks", []));
        }

        public function ToString() {
            return $this->scan->ToString();
        } 
    }
}