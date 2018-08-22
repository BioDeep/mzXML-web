<?php

include "../dotnet/package.php";

Imports("php.Xml");

/**
 * php原生的mzXML文件解析器
 * 
 * 用于提供进行数据可视化所需要的数据源
*/
class mzXML {

    /**
     * 一级碎片数据
     * 
     * @var array
    */
    var $ms1Scans;
    /**
     * 二级碎片数据
     * 
     * @var array
    */
    var $ms2Scans;

    public function __construct($path) {
        $this->ms1Scans = [];
        $this->ms2Scans = [];
        $this->loadScans(XmlParser::LoadFromURL($path));
    }

    /**
     * 在这里加载ms1扫描数据和ms2扫描数据
     * 
     * scan和peaks之间都是一一对应的关系
    */
    private function loadScans($mzXml) {
        # 下面的二者是一一对应的关系
        $scans = $mzXml["mzXML|msRun|scan"];
        $peaks = $mzXml["mzXML|msRun|scan|peaks"];
        $len   = count($scans);

        # 只出现在ms2二级碎片数据之中
        $precursor = $mzXml["mzXML|msRun|scan|precursorMz"];
        # 所以给他一个单独的索引号变量
        $j = 0;

        for ($i = 0; $i < $len; $i++) {
            $scan             = $scans[$i];
            $peakData         = $peaks[$i];
            $peakData["data"] = self::mzInto($peakData["data"]);
            $precursorMz      = null;

            if ($scan["msLevel"] == "2") {
                # 这是一个二级碎片数据
                $precursorMz = $precursor[$j++];
            }

            $scan = [
                "scan"        => $scan, 
                "precursorMz" => $precursorMz, 
                "peaks"       => $peakData
            ];

            if ($scan["msLevel"] == "1") {
                $this->ms1Scans[] = $scan;
            } else if ($scan["msLevel"] == "2") {
                $this->ms2Scans[] = $scan;
            } else {
                # ignores msN data.
            }
        }
    }

    /**
     * 从base64存储的数据之中解析出质谱的二级碎片数据
    */
    public static function mzInto($base64) {
        $zip    = base64_decode($base64);
        $bytes  = zlib_decode($zip); 
        $floats = self::networkByteOrderNumbers($bytes);
        $mzInt  = [];
        $i      = 0;
        $j      = 1;
            
        while ($i < count($floats)) {
            $index = "#" . $j;
            $mz    = $floats["#" . $i];
        
            if (empty($mz) || $mz === false) {
                break;
            }
        
            $into = $floats["#" . ($i + 1)];
            $mz   = [
                "mz"   => $mz, 
                "into" => $into
            ];
            $mzInt[$index] = $mz;
            $i = $i + 2;
            $j++;
        }

        return $mzInt;
    }

    private static function networkByteOrderNumbers($bytes) {
        $numbers = chunk_split($bytes, 8);
        $numbers = explode("\n", $numbers);
        $values  = [];
        
        for ($i =0; $i < count($numbers); $i++) {
            $index          = "#" . $i;
            $values[$index] = @unpack("E",$numbers[$i]);
            $values[$index] = $values[$index][1];
        }

        return $values;
    }
}

?>