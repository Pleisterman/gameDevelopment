<?php

$baseDir = dirname( __FILE__ ) .  "/../../../"; 


require_once( $baseDir . '/php/session/sessionController.php' );
require_once( $baseDir . '/php/debugger/debugger.php' );
require_once( $baseDir . '/php/common/getPost.php' );

$debugger = new debugger('highScores');


$procesId = getPost( 'procesId' );
$subject = getPost( 'subject' );
$action = getPost( 'action', "" );
$scores = getPost( 'scores', null );


$debugger->debug( 'message', 'subject:' . $subject );

$file = $baseDir . 'spaceInvaders/highScores/highScores.json';

if( $scores ){
    file_put_contents( $file, json_encode( $scores, JSON_PRETTY_PRINT  ) );    
    $debugger->debug( 'message', 'action:' . $action );
    $debugger->debug( 'message', 'scores:' . $scores );
}

$returnArray = [];
$highScores = json_decode( file_get_contents( $file ), true );    


$response = [ 'procesId' => $procesId,
              'error' => 'false',
              'result' => $highScores ];

echo json_encode( $response );
