<?php

namespace BioDeep\IO;

Imports("System.IO.StreamWriter");

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
            $dir = dirname($mgf);

            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
        }

        using(new \StreamWriter($mgf, false), function(\StreamWriter $writer) use ($mzXML) {
            foreach(self::mzXML2MgfTextBlocks($mzXML) as $ion) {
                $writer->WriteLine($ion);
            }
        });
    }

    /** 
     * Convert all of the ions in mzXML raw file as the mgf ASCII ion text
     * 
     * @param string|\BioDeep\IO\mzXML If the value of this parameter is string, 
     *            then it should be a valid file path of the mzXML data file, 
     *            else it should be a ``\BioDeep\IO\mzXML`` data model.
    */
    public static function mzXML2MgfTextBlocks($mzXML) {
        if (is_string($mzXML) && !file_exists($mzXML)) {
            return false;
        } else if (is_string($mzXML)) {
            $raw = new \BioDeep\IO\mzXML($mzXML);
        } else {
            $raw = $mzXML;
        }

        foreach($raw->yieldAllMs2() as $ms2) {
            if ($ms2->peaks->PeaksLength() == 0) {
                # 没有碎片峰。。。
                continue;
            } else {
                $mz     = $ms2->precursorMz->data;
                $rt     = $ms2->scan->rt();
                $title  = self::scanTitle($raw->fileName, $ms2);
                $charge = $ms2->precursorMz->precursorCharge;
                $meta   = new PrecursorIon(
                    $mz, $rt, 
                    $ms2->precursorMz->precursorIntensity, 
                    $charge, $title
                );
                $ion = MgfWriter::CreateDocument($meta, $ms2->peaks->data);

                yield $ion;
            }
        }
    }

    private static function scanTitle(string $fileName, ScanReader $ms2) {
        $tokens = [
            "$fileName#{$ms2->scan->num}", 
             $ms2->precursorMz->activationMethod, 
             $ms2->scan->collisionEnergy
        ];

        return \implode(" ", $tokens);
    }
}