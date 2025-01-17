<?php
//header('Access-Control-Allow-Origin: *'); //security risk, for debugging only!!
$response = false;
$newCity = $_POST['data'];

function findCityByName($name) {
    $cities = simplexml_load_file('../data/cities.xml') or die("Error: Cannot find XML");
    foreach ($cities->children() as $city) {
        if($city->cityName == $name)
            return (string)$city->cityName;
    }
    return null;
}

if (isset($newCity)) {
    if (findCityByName($newCity['nameEn']) == null && findCityByName($newCity['nameDe']) == null) {
        $cities = simplexml_load_file('../data/cities.xml') or die("Error: Cannot find XML");

        $city = $cities->addChild('city');
        $city->addChild('cityName', $newCity['nameEn'])->addAttribute('lang', 'en');
        $city->addChild('cityName', $newCity['nameDe'])->addAttribute('lang', 'de');
        $city->addChild('countryCode', $newCity['countryCode']);

        $description = $city->addChild('description');
        $description->addChild('author', $newCity['author']);
        $description->addChild('abstract', $newCity['abstractEn'])->addAttribute('lang', 'en');
        $description->addChild('abstract', $newCity['abstractDe'])->addAttribute('lang', 'de');

        $cities->asXML('../data/cities.xml');

        $response = 200; //OK
    } else $response = "Repository already contains this city!"; //409 - Conflict
} else $response = "Bad data!"; //400 - Bad Request

echo $response;