<?php

namespace BioDeep\IO {

    class Scan {
    
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
    }
}

