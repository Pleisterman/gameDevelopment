<?php
require_once( dirname( __FILE__ ) . '/../session/sessionController.php' );
require_once( dirname( __FILE__ ) .  '/../debugger/debugger.php' );
require_once( dirname( __FILE__ ) .  '/../common/getPost.php' );

$debugger = new debugger('translate');

$baseDir = dirname( __FILE__ ) .  "/../../"; 

$procesId = getPost( 'procesId' );
$subject = getPost( 'subject' );
$ids = getPost( 'ids' );
$idArray = explode( ',', $ids );
$language = getPost( 'language' );

$debugger->debug( 'message', 'subject:' . $subject );
$debugger->debug( 'message', 'ids:' . $ids );
$debugger->debug( 'message', 'language:' . $language );

$returnArray = [];
foreach ( $idArray as $value ){
    $file = $baseDir . $subject . '/language/' . $value . '.json';
    if( is_file( $file ) ){
        $json = json_decode( file_get_contents( $file ), true );    
        $returnArray[ $value ] = implode( '<br />', $json[$language] );
    }
}


$response = [ 'procesId' => $procesId,
              'error' => 'false',
              'result' => $returnArray ];

echo json_encode( $response );
