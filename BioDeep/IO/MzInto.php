<?php

namespace BioDeep\IO {

    class MzInto {

        /**
         * @var double
        */
        public $mz;
        /**
         * @var double
        */
        public $into;

        public function __construct($mz, $into) {
            $this->mz   = $mz;
            $this->into = $into;
        }

        public function ToString() {
            return "[{$this->mz}, {$this->into}]";
        }

        public function __toString() {
            return $this->ToString();
        }
    }
}