<?php
// little proxy made for used with monkey lpfacebook
// do a get request to the url

if (count($_POST) == 0) 
{
    $variablee = file_get_contents($_GET["u"]);
    echo $variablee;
}
else
{
    $url = $_GET["u"];
    $data = $_POST;

    // use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ),
    );
    
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    var_dump($result);
}

