<?php

namespace BioDeep\IO {

    Imports("System.Object");

    /**
     * 二级碎片信息的一级母离子
    */
    class PrecursorIon extends MzInto {

        public $rt;
        public $title;
        public $charge;

        public function __construct($mz, $rt, $into, $charge = 1, $title = "<Unknown>") {
            parent::__construct($mz, $into);

            $this->rt     = doubleval($rt);
            $this->charge = $charge;
            $this->title  = $title;
        }

        public function ToString() {
            return $this->title;
        }
    }

    class MzInto extends \System\TObject {

        /**
         * @var double
        */
        public $mz;
        /**
         * @var double
        */
        public $into;

        public function __construct($mz, $into) {
            $this->mz   = doubleval($mz);
            $this->into = doubleval($into);
        }

        public function ToString() {
            return "[{$this->mz}, {$this->into}]";
        }

        /**
         * 将``[mz, into]``数组编码为base64字符串数据
         * 
         * @param MzInto[]
         * 
         * @return string
        */
        public static function MatrixEncode($matrix) {
            $text = MgfWriter::MzIntoMatrix($matrix);
            $text = \base64_encode($text);

            return $text;
        }
    }
}