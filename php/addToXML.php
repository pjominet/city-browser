<?php
//header('Access-Control-Allow-Origin: *'); //security risk, for debugging only!!
$result = false;
$newCity = $_POST['data'];

if (isset($newCity)) {
    $cities = simplexml_load_file('../data/cities.xml');

    $city = $cities->addChild('city');
    $city->addChild('cityName', $newCity['nameEn'])->addAttribute('lang', 'en');
    $city->addChild('cityName', $newCity['nameDe'])->addAttribute('lang', 'de');

    $description = $city->addChild('description');
    $description->addChild('author', $newCity['author']);
    $description->addChild('abstract', $newCity['abstractEn'])->addAttribute('lang', 'en');
    $description->addChild('abstract', $newCity['abstractDe'])->addAttribute('lang', 'de');

    $cities->asXML('../data/cities.xml');

    $result = true;
} else $result = false;

echo $result;