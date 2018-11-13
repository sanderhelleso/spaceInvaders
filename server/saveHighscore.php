<?php
    $file = "../public/highscores/highscores.json";
    $fh = fopen($file, 'w') or die("can't open file");
    $stringData = $_GET["data"];
    fwrite($fh, $stringData);
    fclose($fh)
?>