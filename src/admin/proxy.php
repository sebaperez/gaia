<?php

	$url = $_GET["url"];
	urldecode($url);
	if (isset($url)) {
		$c = curl_init();
		curl_setopt_array($c, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_PORT => 3001
		));
		$r = curl_exec($c);
		if ($r) {
			echo($r);
		}
		curl_close($c);
	}

?>
