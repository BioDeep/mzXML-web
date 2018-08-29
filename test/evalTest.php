<?php

include "../../dotnet/package.php";
include "../autoload.php";

use \BioDeep\MolWeight as Script;

echo var_dump( 3 * Script::Weight("ACN") + 2 * Script::Weight("H") );

echo var_dump(Script::Eval("3ACN+2H"));


// M + IsoProp + 2Na + 23H - 3NH4


echo var_dump( Script::Weight("IsoProp") + 2 * Script::Weight("Na") + 23 * Script::Weight("H") - 3 * Script::Weight("NH4") );

echo var_dump(Script::Eval("IsoProp+2Na+23H-3NH4"));