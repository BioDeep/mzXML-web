<?php

include "../../dotnet/package.php";
include "../autoload.php";

$file  = "../003_Ex2_Orbitrap_CID/003_Ex2_Orbitrap_CID.mzXML";


#region "raw test"

/*

$xml = XmlParser::LoadFromURL($file);

# echo var_dump($xml["mzXML|msRun|parentFile"]);
# echo var_dump($xml["mzXML|msRun|msInstrument"]);
# echo var_dump($xml["mzXML|msRun|dataProcessing|software"]);

echo var_dump($xml["mzXML|msRun|scan"][2]);
echo var_dump($xml["mzXML|msRun|scan|precursorMz"][2]);
echo var_dump($xml["mzXML|msRun|scan|peaks"][2]);

exit;

$ms2 = $xml["mzXML|msRun|scan|peaks"][1]["data"];
$mzInt = mzXML::mzInto($ms2);

echo var_dump($mzInt);
*/

#endregion


$mzXML = new \BioDeep\mzXML($file);

echo "ms1:\n\n";
var_dump($mzXML->ms1Scans[1]);

echo "\n\n\n";

echo "ms2:\n\n";
var_dump($mzXML->ms2Scans[1]);

?>