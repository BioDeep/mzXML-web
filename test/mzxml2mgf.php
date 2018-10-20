<?php

include "../../dotnet/package.php";
include "../autoload.php";

$file  = "./GABA.mzXML";

BioDeep\IO\Convertor::mzXML2Mgf($file, "./GABA2.txt");