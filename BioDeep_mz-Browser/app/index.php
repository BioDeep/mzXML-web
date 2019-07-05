<?php

include __DIR__ . "/../../../dotnet/package.php";
include __DIR__ . "/../../autoload.php";

# $mzXML = __DIR__ . "/../../test/GABA.mzXML";
$mzXML = __DIR__ . "/B10.mzXML";
$raw = new \BioDeep\IO\mzXML($mzXML);

foreach(\BioDeep\IO\Convertor::mzXML2MgfTextBlocks($raw) as $ion) {
    echo $ion;
    echo "\n";
}