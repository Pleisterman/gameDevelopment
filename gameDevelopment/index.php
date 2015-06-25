<?php 


require_once './php/session/sessionController.php';

error_reporting(0);
ini_set( "display_errors", 0 );

require_once './php/mobile/mobileDetect.php';

$detect = new Mobile_Detect;
$isMobile = $detect->isMobile();

$jsProjectDir = '../jsProject/';
$jsProjectFileArray = array(   'jsProject.js', 
                                'eventsModule.js', 
                                'debugModule.js', 
                                'valuesModule.js', 
                                'stringsModule.js',
                                'browserModule.js',
                                'cookieModule.js', 
                                'sceneModule.js',                                
                                'buttonModule.js', 
                                'radioButtonModule.js', 
                                'messageBoxModule.js', 
                                'resourcesModule.js',
                                'popUpMenuModule.js' );

// basic gameDevelopment javascript 
$jsBasicDir = './base/javascript/';
$jsBasicFileArray = array(  'gameDevelopment.js',
                            'toggleButtonModule.js',
                            'ajaxModule.js',
                            'layoutModule.js',
                            'contentMenuModule.js',
                            'languageModule.js' );
// is there an app selected?
$app = '';
if( isset( $_GET["app"] )  ){
    $app = $_GET["app"];
}

switch( $app ){
    case "papierSteenSchaar" : {
        $jsAppDir = './papierSteenSchaar/javascript/';
        $jsAppFileArray = array( "main.js",
                                 "introModule.js",
                                 "gameModule.js",
                                 "gameLoaderModule.js",
                                 "strategiesModule.js",
                                 "gameSetsModule.js",
                                 "computerPlayerModule.js",
                                 "playerModule.js",
                                 "scoresModule.js",
                                 "gameButtonsModule.js",
                                 "playingfieldModule.js",
                                 "exitButtonModule.js",
                                 "restartButtonModule.js",
                                 "soundButtonModule.js",
                                 "startButtonsModule.js",
                                 "gameFlowAlertsModule.js",
                                 "gameFlowModule.js" );
        break;
    }
    case "spaceInvaders" : {
        $jsAppDir = './spaceInvaders/javascript/';
        $jsAppFileArray = array( "main.js",
                                 "valuesModule.js",
                                 "gameLoaderModule.js",
                                 "introModule.js",
                                 "gameIntroModule.js",
                                 "gameLayoutModule.js",
                                 "gameModule.js",
                                 "backgroundModule.js",
                                 "starsModule.js",
                                 "worldModule.js",
                                 "marsModule.js",
                                 "moonModule.js",
                                 "levelsModule.js",
                                 "gameHeaderModule.js",
                                 "exitButtonModule.js",
                                 "bannerModule.js",
                                 "gameMessageModule.js",
                                 "scoreModule.js",
                                 "livesModule.js",
                                 "playerModule.js",
                                 "shipOneModule.js",
                                 "bunkersModule.js",
                                 "bunkerModule.js",
                                 "bulletsModule.js",
                                 "bulletOneModule.js",
                                 "invadersModule.js",
                                 "invaderOneModule.js",
                                 "invaderTwoModule.js",
                                 "bombsModule.js",
                                 "bombOneModule.js",
                                 "bombTwoModule.js",
                                 "firstLevelIntroModule.js",
                                 "difficultyModule.js",
                                 "levelIntroModule.js",
                                 "levelResultModule.js",
                                 "gameResultModule.js",
                                 "gameWonModule.js",
                                 "gameLostModule.js",
                                 "gameFlowModule.js",
                                 "highScoresModule.js" );
        break;
    }
    case "test" : {
        $jsAppDir = './test/javascript/';
        $jsAppFileArray = array( "main.js",
                                 "valuesModule.js",
                                 "testLayoutModule.js",
                                 "test.js" );
        break;
    }
    default : {
        // no app selected load the intro 
        $jsAppDir = './intro/javascript/';
        $jsAppFileArray = array( "introModule.js" );
    }
}


?>

<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> gameDevelopment </title>
        <link rel='shortcut icon' href='./images/favicon.ico' />
        <style type="text/css" >
        <!--
            @import url("./css/common.css");
        -->
        </style>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<?php 
    // add the jsProject javascript files
    for( $i = 0; $i < count( $jsProjectFileArray ); $i++ ) {
        echo '<script type="text/javascript" src="' . $jsProjectDir . $jsProjectFileArray[$i] . '"></script>';
    }
    // add the gameDevelopment javascript files
    for( $i = 0; $i < count( $jsBasicFileArray ); $i++ ) {
        echo '<script type="text/javascript" src="' . $jsBasicDir . $jsBasicFileArray[$i] . '"></script>';
    }
    // add the application javascript files
    for( $i = 0; $i < count( $jsAppFileArray ); $i++ ) {
        echo '<script type="text/javascript" src="' . $jsAppDir . $jsAppFileArray[$i] . '"></script>';
    }
?>
<script type="text/javascript">
"use strict";

    window.onload = function() {
        <?php
            // add browser info
            if( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
                echo 'gameDevelopment.browserInfo="' . $_SERVER['HTTP_USER_AGENT'] . '";' . "\n";
            }
            else { 
                echo 'gameDevelopment.browserInfo = "";' . "\n";
            }
            // add isMobile info
            if( $isMobile ) {
                echo 'gameDevelopment.isMobileBrowser = true;' . "\n";
            }
            else { 
                echo 'gameDevelopment.isMobileBrowser = false;' . "\n";
            }
            
            // add language info
            $languages = '';
            $languageArray = json_decode( file_get_contents( './base/language/languages.json' ), true );
            for( $i = 0; $i < count( $languageArray ); $i++ ){
                $languages .= '"' . array_keys($languageArray)[$i] . '"';
                if( $i < count( $languageArray ) -  1 ){
                    $languages .= ',';
                }
            }
            if( isset( $_GET['lang'] ) ){
                $defaultLanguage = $_GET['lang'];
            }
            else if( count( $languageArray ) > 0 ){
                $defaultLanguage = array_keys( $languageArray )[0];
            }
            else {
                $defaultLanguage = 'nl';
            }
            echo 'gameDevelopment.defaultLanguage = "' . $defaultLanguage . '";' . "\n";
            echo 'gameDevelopment.languages = [' . $languages . '];' . "\n";
            
            // set the current app
            echo 'gameDevelopment.appName = "' . $app . '";' . "\n";
        ?>
        gameDevelopment.start();
    };
</script>    
    </head>
    <body>
        
        
        
    </body>
</html>
