<?php

namespace BioDeep\IO {

    class scan {
    
        #region "property"

        public $num;
        public $scanType;
        public $centroided;
        public $msLevel;
        public $peaksCount;
        public $polarity;
        public $retentionTime;
        public $collisionEnergy;
        public $lowMz;
        public $highMz;
        public $basePeakMz;
        public $basePeakIntensity;
        public $totIonCurrent;
        public $msInstrumentID;

        #endregion

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
        public $data;

        #endregion

        public function __construct($peaks) {
            foreach($peaks as $name => $val) {
                $this->{$name} = $val;
            }
        }
    }
}

