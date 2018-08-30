<?php

namespace BioDeep\IO {

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