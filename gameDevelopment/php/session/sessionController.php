<?php
// session controller class
// include will construct a class that will save session info
// On first entrie an index file is created.
// every following request will b e logged in a history.txt
// session info is saved following the directorie structure:
// /date/session_id/index.json and /date/session_id/history.txt 

// try creating the session
if( !session_start() ) {
    // error 
    require_once( dirname( __FILE__ ) . '/sessionError.php' );
    exit;
}

require_once( dirname( __FILE__ ) . '/../debugger/debugger.php' );
require_once( dirname( __FILE__ ) . '/../common/getPost.php' );

class sessionController
{
    private $sessionsDir = '';
    private $debugOn = true;
    private $debugger = null;
    
    public function __construct( ) {
        // set the base dir for saving sessioon info
        $this->sessionsDir = dirname( __FILE__ ) . '/../../session/';
        // create debugger if needed
        if( $this->debugOn ){
            $this->debugger = new debugger( 'sessionController' );
        }
        $this->debug( 'construct.' );
        // log the info
        $this->update();
    }
    private function update(){
        // is the session indexed?
        if( !isset( $_SESSION['indexed'] ) || $_SESSION['indexed'] != date('Ymd' ) ){
            srand( ( double ) microtime() * 1000000 );
            $this->indexSession(); 
        }
        else {
            // already indexed go and update history
            $this->debug( 'updateData.' );
            $this->updateData(); 
        }
    }
    private function getIndexFileName(){
        // get dir function structure /date/
        $this->debug( 'getDir.' );
        $date = date("Ymd");
        return $this->sessionsDir . $date . "_index.txt";
    } 
    private function getSessionFileName(){
        // get dir function structure /date/
        $this->debug( 'getDir.' );
        return $this->sessionsDir . date("Ymd") . "_"  . session_id() . "txt";
    } 
    private function indexSession(){
        $this->debug( 'indexSession.' );
        $indexFileName = $this->getIndexFileName();
        $sessionId = session_id();
        $indexFile = fopen( $indexFileName, "a+" );
        if( $indexFile ) {
        
            fwrite( $indexFile, $this->createSessionData() );
            fclose( $indexFile );
        }
        $_SESSION['indexed'] = date('Ymd' );
    }
    private function updateData(){
        $this->debug( 'updateData.' );
        $sessionFileName = $this->getSessionFileName();
        $file = fopen( $sessionFileName, "a+" );
        $subject = getPost( 'subject', false );

        if( $file ) {
            $data = date( "H:i:s", time() ) . " => ";
            if( isset( $_SERVER['REQUEST_URI'] ) ) {
                 $data .= 'REQUEST_URI="' . $_SERVER['REQUEST_URI'] . '"';
            }
            if( $subject ){
                $data .=  " subject:" . $subject;
            }
            $data .=  "\n";
            fwrite( $file, $data );
            fclose( $file );
        }
    }
    private function createSessionData() {
        $this->debug( 'createSessionData.' );
        
        $sessionData = 'start:' . date( "H:i:s", time() );

        if( isset( $_SERVER ) ) {
           
            // client
            if( isset( $_SERVER['argv'] ) ) {
                $sessionData .= ' requestPath' . $_SERVER['argv'];
            }
            
            if( isset( $_SERVER['REMOTE_ADDR'] ) ) {
                $sessionData .= ' REMOTE_ADDR: ' . $_SERVER['REMOTE_ADDR'] . " ";
            }
            
            
            if( isset( $_SERVER['REQUEST_URI'] ) ) {
                $sessionData .= ' REQUEST_URI: ' . $_SERVER['REQUEST_URI'] . " ";
            }
            
            if( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
                $sessionData .= ' HTTP_USER_AGENT: ' . $_SERVER['HTTP_USER_AGENT'] . " ";
            }

            // server
            if( isset( $_SERVER['SERVER_SOFTWARE'] ) ) {
                $sessionData .= ' SERVER_SOFTWARE: ' . $_SERVER['SERVER_SOFTWARE'] . " ";
            }
            
        }
        $sessionData .= 'session:' . session_id() . " ";
        $sessionData .=  "\n";
        return $sessionData;
    }
    private function debug( $message ) {
        if( $this->debugger ) {
            $this->debugger->debug( "message", $message );
        }
    }
}

$sessionController = new sessionController( );
