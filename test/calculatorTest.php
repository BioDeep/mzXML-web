<?php

include "../../dotnet/package.php";
include "../autoload.php";

$mass  = 853.33089;
$table = \BioDeep\MzCalculator::doCalculate($mass);

Imports("Microsoft.VisualBasic.Data.csv.Table");

use Microsoft\VisualBasic\Data\csv\TableView as TableRender;

$table = TableRender::ToHTMLTable($table);

echo $table;