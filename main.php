<?php 

function parse($p1, $p2 $p3) {

	$num1 = strpos($p1, $p2);

	if ($num1 === false) 
		return 0;
	
	$num2 = substr($p1, $num1);

	return strip_tags(substr($num2, 0, strpos($num2, $p3)));

}

$String = file_get_contents('https://arm923i.github.io/gamepad-scratch-extension/');

echo parse($String, '<title>',  '</title>');


?>