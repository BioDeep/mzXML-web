<?php

namespace BioDeep\IO {

    Imports("System.Text.RegularExpressions.Regex");

    # XML file models

    class scan {
    
        #region "property"

        public $num;
        public $scanType;
        public $centroided;
        public $msLevel;
        public $peaksCount;
        public $polarity;
        /**
         * @var string
        */
        public $retentionTime;
        public $collisionEnergy;
        public $lowMz;
        public $highMz;
        public $basePeakMz;
        public $basePeakIntensity;
        public $totIonCurrent;
        public $msInstrumentID;

        #endregion

        /**
         * Get retention time value in seconds. 
         * 
         * @return double
        */
        public function rt() {
            $time = $this->retentionTime;
            $time = \Regex::Match($time, "\\d+(\\.\\d+)?");
            return floatval($time);
        }

        public function __construct($scan) {
            foreach($scan as $name => $val) {
                $this->{$name} = $val;
            }
        }

        public function ToString() {
            return $this->num;
        }
    }

    class precursorMz {

        #region "property"

        public $precursorScanNum;
        public $precursorIntensity;
        public $precursorCharge;
        public $activationMethod;
        public $windowWideness;
        /** 
         * 这个属性就是前体母离子的m/z
         * 
         * @var double
        */
        public $data;

        #endregion

        public function __construct($precursorMz) {
            foreach($precursorMz as $name => $val) {
                $this->{$name} = $val;
            }
        }
    }

    class peaks {

        #region "property"

        public $compressionType;
        public $compressedLen;
        public $precision;
        public $byteOrder;
        public $contentType;

        /**
         * mz-into的键值对矩阵
         * 
         * @var MzInto[]
        */
        public $data;

        #endregion

        public function __construct($peaks) {
            foreach($peaks as $name => $val) {
                $this->{$name} = $val;
            }
        }
    }
}

