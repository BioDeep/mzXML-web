<?php

define("FRAMEWORK_DEBUG", true);

include __DIR__ . "/../../dotnet/package.php";
include __DIR__ . "/../autoload.php";

use BioDeep\IO\MgfIon as Reader;
use BioDeep\IO\MgfWriter as Writer;

foreach (Reader::PopulateIons(__DIR__ . "/GABA.mgf") as $ion) {
    $doc = Writer::CreateDocument($ion->precursor, $ion->MzInto);
    echo $doc;
    echo "\n\n\n\n";
}