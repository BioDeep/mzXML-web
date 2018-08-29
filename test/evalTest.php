<?php

include "../../dotnet/package.php";
include "../autoload.php";

use \BioDeep\MolWeight as Script;

echo var_dump( 3 * Script::Weight("ACN") + 2 * Script::Weight("H") );

echo Script::Eval("3ACN+2H");