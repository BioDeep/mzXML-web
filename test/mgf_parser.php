<?php

include "../../dotnet/package.php";
include "../autoload.php";

use BioDeep\IO\MgfIon as Reader;

foreach (Reader::PopulateIons(__DIR__ . "/GABA.mgf") as $ion) {
    echo var_dump($ion);
    echo "\n\n\n\n";
}