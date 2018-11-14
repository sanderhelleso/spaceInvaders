<?php
    if (isset($_POST["data"])) {
        $file = "../public/highscores/highscores.json";
        $fh = fopen($file, 'w') or die("can't open file");
        $stringData = $_POST["data"];
        fwrite($fh, $stringData);
        fclose($fh);
    }
?>