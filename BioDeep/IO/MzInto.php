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
            $text = MgfWriter::MzIntoMatrix($matrix, "\t");
            $text = \base64_encode($text);

            return $text;
        }

        /**
         * @param string $base64Stream
         * @param boolean $normalize 是否对into进行归一化处理？默认进行归一化，
         *                           即将into伸缩到``[0-100]``的区间内。
         * @return MzInto[]
        */
        public static function MatrixDecode($base64Stream, $normalize = TRUE) {
            $matrix = base64_decode($base64Stream);
            $matrix = \StringHelpers::LineTokens($matrix);
            $mzInto = [];
            $max    = -99999;
            
            foreach($matrix as $line) {
                $t = \Strings::Split($line, "\t");
                $x = floatval($t[1]);

                if ($x > $max) {
                    $max = $x;
                }

                array_push($mzInto, new MzInto(
                    $mz   = $t[0], 
                    $into = $t[1]
                ));
            }

            if ($normalize) {
                $norm = [];

                foreach($mzInto as $fragment) {
                    $fragment->into = $fragment->into / $max * 100;
                    array_push($norm, $fragment);
                }

                return $norm;
            } else {
                return $mzInto;
            }
        }
    }
}