<?php

namespace BioDeep\IO;

Imports("");

/**
 * 质谱数据格式转换模块
*/
class Convertor {

    /**
     * 这个函数只转换ms2 scans
     * 
     * @param string $mzXML 输入的原始数据文件路径
     * @param string $mgf 输出的mgf格式文件的文件保存路径，如果文件夹不存在会自动创建
     * 
     * @return boolean 转换是否成功？
    */
    public static function mzXML2Mgf($mzXML, $mgf) {
        if (!file_exists($mzXML)) {
            return false;
        } else {
            $raw = new \BioDeep\IO\mzXML($mzXML);
            $dir = dirname($mgf);

            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
        }       

        $fp = fopen('data.txt', 'w');
fwrite($fp, '1');
fwrite($fp, '23');
fclose($fp);

        foreach($raw->yieldAllMs2() as $ms2) {

        }
    }
}