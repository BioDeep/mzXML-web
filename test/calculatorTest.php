<?php

include "../../dotnet/package.php";
include "../autoload.php";

$mass  = 853.33089;
$table = \BioDeep\MzCalculator::doCalculate($mass);

echo var_dump($table);
