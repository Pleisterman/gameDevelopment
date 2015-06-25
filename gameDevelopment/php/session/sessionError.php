
<!DOCTYPE html> 
<html lang="nl"> 
<head>
    <title>Fout Melding</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <meta name="author" content="Pleisterman">
    <meta name="description" content="login Pleisterman Tools">
    <meta name="google" content="notranslate">
    <style type="text/css" >
    <!--
        @import url("./css/common.css");
        @import url("./css/error.css");
    -->
    </style>
</head>

<?php

// open the document body
echo '<body class="body">';

// header image
echo '<div class="header" style="background-image:url(' . './images/mainHeaderBackground.png' . ');background-repeat:no-repeat; ">';
echo '</div>';    


// logo
echo '<button class="logo" type="button" onclick="window.location=\'/gameDevelopment/games0\'" class="logo"  style="border-radius:5px;background-image:url(' . './images/logo.png' . ');background-repeat:no-repeat;background-color:transparent; ">';
echo '</button>';    

echo '<div class="panelBorder panelShadow invertedPanelColor panel panelLeft">';
    $content = '';
    // title
    $content .= '<div ';
        $content .= ' class="panelTitle"';
        $content .= 'style="background-image:url(' . './images/panelBullet.png' . ');"';
        $content .= ' >';
        $content .= "Het programma kan geen sessie maken.<br />";
    $content .= '</div>';
    $content .= '<div ';
        $content .= ' class="panelText"';
    $content .= ' >';            
        $content .= "Er is iets mis gegaan." . "<br />";
        $content .= "Het programma kan geen sessie maken en werkt daarom niet goed." . "<br />";
        $content .= "Helaas kunt u dit programma pas gebruiken als dit opgelost is." . "<br />";
    $content .= '</div>';
    echo $content;
echo '</div>';
?>

<div class="footer"><div class="footerContent"><p>   </p><p>Software- Ontwikkeling | Advies | Opleiding</p><p><a style="color:#7f88c9" href="mailto:info@pleisterman.nl">info@pleisterman.nl</a> - <nobr>024 - 848 1337 of 06 4282 1270</nobr></p></div></div>

</body>
</html>
