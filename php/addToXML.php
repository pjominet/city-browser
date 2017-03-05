<?php
$result = false;
$data = $_POST['jsonData'];
$book = json_decode($data, true);

if (isset($book)) {
    $jsonContent = file_get_contents('../data/search.json');
    $tmpArrayFromFile = json_decode($jsonContent, true);
    end($tmpArrayFromFile);
    $newDataArray = array_merge($tmpArrayFromFile, array((key($tmpArrayFromFile)+1) => $book));
    $newJsonData = json_encode($newDataArray, JSON_PRETTY_PRINT);
    //print_r($newJsonData);
    file_put_contents('../data/search.json', $newJsonData);
    $result = true;
} else $result = false;

echo $result;