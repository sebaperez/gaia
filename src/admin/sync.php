<?php

	if (isset($_GET["gaiaToken"])) {

		$gaiaToken = $_GET["gaiaToken"];
		$accessToken = $_GET["accessToken"];
		$refreshToken = $_GET["refreshToken"];
		$userId = $_GET["userId"];
		saveData($userId, $gaiaToken, $accessToken, $refreshToken);
		Header("Location: http://" . $_SERVER["HTTP_HOST"]);
		exit();
	}

	$code = $_GET["code"];
	$userId = $_GET["state"];

	$URL = "https://www.googleapis.com/oauth2/v4/token";

	$CLIENT_ID = "702075112008-6tf7l2cd08nl11l4sf79lcupqj820f7c.apps.googleusercontent.com";
	$CLIENT_SECRET = "iB1j3JXA5fClykUud5Faupac";
	$REDIRECT_URI = "http://admin.gaiameet.com/sync.php";
	$GRANT_TYPE = "authorization_code";

	$params = array(
		"code" => $code,
		"client_id" => $CLIENT_ID,
		"client_secret" => $CLIENT_SECRET,
		"redirect_uri" => urlencode($REDIRECT_URI),
		"grant_type" => $GRANT_TYPE
	);

	$params_store = [];
	foreach ($params as $field => $value) {
		array_push($params_store, $field . "=" . $value);
	}
	$params_string = implode("&", $params_store);

	if (isset($code) && isset($userId)) {

		$url = $URL;
		$c = curl_init();
		$opt = array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_POST => count($params),
			CURLOPT_POSTFIELDS => $params_string,
			CURLOPT_HTTPHEADER => array(
				"Content-Type" => "application/x-www-form-urlencoded",
				"User-Agent" => "curl/7.43.0",
				"Host" => "www.googleapis.com",
				"Accept" => "*/*"
			)
		);

		curl_setopt_array($c, $opt);
 		$result = curl_exec($c);
		if ($result) {
			$json = json_decode($result, true);
			$access_token = $json["access_token"];
			$refresh_token = $json["refresh_token"];
			if ($access_token || $refresh_token) {
				callJs($userId, $access_token, $refresh_token);
				exit();
			}
		}
		curl_close($c);
	}
	Header("Location: http://" . $_SERVER["HTTP_HOST"]);

	function saveData($userId, $gaiaToken, $access_token, $refresh_token) {
		$c = curl_init();
		$data = [ "googleAccessToken" => $access_token ];
		if ($refreshToken) {
			$data["googleRefreshToken"] = $refresh_token;
		}
		$opt = array(
			CURLOPT_URL => "http://localhost:3000/api/Clients/" . $userId . "?access_token=" . $gaiaToken,
			CURLOPT_CUSTOMREQUEST => "PATCH",
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_HTTPHEADER => array(
				"Content-Type" => "application/json",
				"Authorization" => $gaiaToken
			),
			CURLOPT_POSTFIELDS => http_build_query($data)
		);
		curl_setopt_array($c, $opt);
		$response = curl_exec($c);
		curl_close($c);
	}

	function callJs($userId, $access_token, $refresh_token) {
		$params = "&userId=" . $userId . "&accessToken=" . $access_token . "&refreshToken=" . $refresh_token;
		echo("<script>(function() { var gaiaToken = localStorage.getItem('gaiaid'); location.href = '/sync.php?gaiaToken=' + gaiaToken + '" . $params . "'; })();</script>");
	}

?>
