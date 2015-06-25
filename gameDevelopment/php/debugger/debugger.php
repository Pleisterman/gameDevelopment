<?php
////////////////////////////////////////////////////////////////////////////////
//      file:     debugger.php
////////////////////////////////////////////////////////////////////////////////
class debugger
{
    private $dir = "debug/";
    private $f;
    private $errors = true;
    private $warnings = true;
    private $messages = true;
   function __construct($str)
   {
       $baseDir = dirname( __FILE__ ) .  "/../../"; 
       $this->f = fopen( $baseDir . $this->dir . $str . ".txt", "wb");
       fwrite( $this->f, "program started at" . date("H:i:s:u", time()) . "\r\n" );
   }
   function __destruct( )
   {
       fwrite( $this->f, "program ended at " . date("H:i:s:u", time()) . "\r\n" );
       fclose( $this->f );
    }
   function set_timestamp( $type )
   {
        if( $type == "error" && $this->errors )
        {
            fwrite( $this->f, "time: " . date("H:i:s", time()) . "\r\n" );
        }
        if( $type == "warning" && $this->warnings )
        {
            fwrite( $this->f, "time: " . date("H:i:s", time()) . "\r\n" );
        }
        if( $type == "message" && $this->messages )
        {
            fwrite( $this->f, "time: " . date("H:i:s", time()) . "\r\n" );
        }
   }
   function debug( $type, $message )
   {
      if( $type == "error" && $this->errors )
      {
         fwrite( $this->f, " error: " . $message  .  "\r\n" );
      }
      if( $type == "warning" && $this->warnings )
      {
         fwrite( $this->f, " warning: " . $message  .  "\r\n" );
      }
      if( $type == "message" && $this->messages )
      {
         fwrite( $this->f, " message: " . $message .  "\r\n"  );
      }
   }
   function debugfileline( $file, $line )
   {
      fwrite( $this->f, " in file: " . basename($file) . " line: ". $line .  "\r\n" );
   }
}

?>