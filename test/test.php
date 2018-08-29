<?php

include "./mzXMLParser.php";

$file  = "./003_Ex2_Orbitrap_CID/003_Ex2_Orbitrap_CID.mzXML";


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


$mzXML = new mzXML($file);


var_dump($mzXML->ms1Scans[1]);
var_dump($mzXML->ms2Scans[1]);

?>