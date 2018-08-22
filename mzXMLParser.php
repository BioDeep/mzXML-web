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
     * @var array
    */
    var $ms1Scans;
    var $ms2Scans;

    public function __construct($path) {
        $this->loadScans(XmlParser::LoadFromURL($path));
    }

    /**
     * 在这里加载ms1扫描数据和ms2扫描数据
     * 
     * scan和peaks之间都是一一对应的关系
    */
    private function loadScans($Xml) {
        
        for ($i = 0; )
        echo var_dump($xml["mzXML|msRun|scan"][2]);
        echo var_dump($xml["mzXML|msRun|scan|precursorMz"][2]);
        echo var_dump($xml["mzXML|msRun|scan|peaks"][2]);
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