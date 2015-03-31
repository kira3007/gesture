<?php
date_default_timezone_set('Asia/Shanghai');

$origin="*";
$request_method = $_SERVER['REQUEST_METHOD'];
if ($request_method === 'OPTIONS') {
    header('Access-Control-Allow-Origin:'.$origin);
    header('Access-Control-Allow-Credentials:true');
    header('Access-Control-Allow-Methods:GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers:x-requested-with,content-type');

    //header('Access-Control-Max-Age:1728000');
    header('Content-Type:text/plain charset=UTF-8');
    header('Content-Length: 0',true);

    header('status: 204');
    header('HTTP/1.0 204 No Content');
    return;
}

if ($request_method === 'POST') {

    header('Access-Control-Allow-Origin:'.$origin);
    //$rawdata = $_POST;
    //header('Access-Control-Allow-Credentials:true');
    //header('Access-Control-Allow-Methods:GET, POST, OPTIONS');

}

if ($request_method === 'GET') {

    header('Access-Control-Allow-Origin:'.$origin);
    //header('Access-Control-Allow-Credentials:true');
    //header('Access-Control-Allow-Methods:GET, POST, OPTIONS');
}


$rawdata= file_get_contents("php://input");
//echo json_encode(rawurlencode($rawdata));
$url="http://hw.baidu.com/";

$ch = curl_init();
#var_dump($_SERVER);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
#curl_setopt($ch, CURLOPT_TIMEOUT, 2000);
#echo rawurlencode($rawdata);
curl_setopt($ch, CURLOPT_POSTFIELDS,$rawdata);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
//output时忽略http响应头
curl_setopt($ch, CURLOPT_HEADER, false);
//设置http请求的头部信息 每行是数组中的一项
//当url中用ip访问时，允许用host指定具体域名


curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: audiotest.baidu.com",$_SERVER["HTTP_CONTENT_TYPE"]));

$res = curl_exec($ch);
echo $res;
