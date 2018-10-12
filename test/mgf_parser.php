<?php

define("FRAMEWORK_DEBUG", true);

include __DIR__ . "/../../dotnet/package.php";
include __DIR__ . "/../autoload.php";

use BioDeep\IO\MgfIon as Reader;

foreach (Reader::PopulateIons(__DIR__ . "/GABA.mgf") as $ion) {
    echo var_dump($ion);
    echo "\n\n\n\n";
}