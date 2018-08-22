<?php

include "./mzXMLParser.php";

$file  = "../lxy-CID30.mzXML";
# $mzXML = new mzXML($file);

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

?>