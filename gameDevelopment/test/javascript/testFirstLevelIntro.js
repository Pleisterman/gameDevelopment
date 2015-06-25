/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the test for the application pleisterman Guitar Slider
* Last revision: 26-08-2014
* 
* NOTICE OF LICENSE
*
* All of the material on this site is protected by copyright 
* only code that is explicitly made available for copying may be 
* copied without permission. 
* 
* Where code is made available to be copied all of the conditions 
* within the existing or modified code as well as the conditions on the page 
* where you found it must be observed when you use the code on your site.
* 
*/

( function( gameDevelopment ){
    gameDevelopment.test = function( ) {


    /*
     *  module test 
     *  purpose:
     *   this module controls test for the gameDevelopment.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'test';
        self.debugOn = true;
        self.layout = null;
        self.canvasSurface = null;
        self.characters = [ ];
        
        self.texts = [ {    "text" :            "Space Invaders",
                            "startPosition" : { "top" :     10,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :        12,
                            "fontColor" :       "#ff0000",
                            "endPosition" :   { "top" :     20 ,
                                                "left" :     35,
                                                "width" :    0 } },
                       {    "text" :            "created by Toshihiro Nishikado",
                            "startPosition" : { "top" :     70 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     6,
                            "fontColor" :       "orange",
                            "endPosition" :   { "top" :     40 ,
                                                "left" :    10,
                                                "width" :    0 } }, 
                       {    "text" :            "recreated by",
                            "startPosition" : { "top" :     76 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     6,
                            "fontColor" :       "whitesmoke",
                            "endPosition" :   { "top" :     50 ,
                                                "left" :    18,
                                                "width" :    0 } }, 
                       {    "text" :            "Pleisterman",              // text: pleisterman
                            "startPosition" : { "top" :     80 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     9,
                            "fontColor" :       "#cabde7",
                            "endPosition" :   { "top" :     62 ,
                                                "left" :    24,
                                                "width" :    0 } },         // done text: pleisterman
                       {    "text" :            "Software Development",
                            "startPosition" : { "top" :     90 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     7,
                            "fontColor" :       "#ffffff",
                            "endPosition" :   { "top" :     73 ,
                                                "left" :    34,
                                                "width" :    0 } }, 
                       {    "text" :            "In",
                            "startPosition" : { "top" :     90 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     5,
                            "fontColor" :       "#ffffff",
                            "endPosition" :   { "top" :     83 ,
                                                "left" :    46,
                                                "width" :    0 } }, 
                       {    "text" :            "Javascript",
                            "startPosition" : { "top" :     90 ,
                                                "left" :    90,
                                                "width" :  -10 },
                            "fontSize" :                     8,
                            "fontColor" :       "#ff0000",
                            "endPosition" :   { "top" :     88 ,
                                                "left" :    54,
                                                "width" :    0 } } ];
        
        self.textCounter = 0;
        self.animationReady = false;
        self.font = "Arial";
        self.animationDelay = 10;                      // ms
        self.lastAnimationDate = 0;                    // save last animation time for delay
        self.animationCounter = 0;
        self.animationLength = 30;
        self.charactersCreated = false;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            self.layout = new gameDevelopment.testLayoutModule();
            self.canvasSurface = document.getElementById( 'canvas' ).getContext( '2d' );
        };
        self.show = function( ){
            self.debug( 'show' );
            self.layout.show( true );
            // set the window.resize event
            window.onresize = function( ) {
                jsProject.callEvent( 'sceneChange' );
                self.layoutChange();
            };
            self.animationCounter = 0;
            self.createCharacters();
            self.animateFrame();
        };
        self.animateFrame = function( ){
            self.animate();
            // set the timer
            window.requestAnimationFrame( self.animateFrame );
        };
        self.animate = function( skipDelay ){
            
            // check for delay
            var date = new Date();
            if( !skipDelay ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }

            // done delay
            self.lastAnimationDate = date;
            
            self.canvasSurface.clearRect( 0, 0, $( '#canvas' ).width(), $( '#canvas' ).height() );
            
            var left = 0, top = 0, width = 0, height = 0;
            //self.debug( 'animate' );
            
            for( var i = 0; i < self.textCounter; i++ ){
                height = self.texts[i]["fontSize"] * ( $( '#canvas' ).height() / 100 );
                self.canvasSurface.fillStyle = self.texts[i]["fontColor"];
                self.canvasSurface.font = height + "px " + self.font;
                left = self.texts[i]["endPosition"]["left"] * ( $( '#canvas' ).width() / 100 );
                top = self.texts[i]["endPosition"]["top"] * ( $( '#canvas' ).height() / 100 );
                self.canvasSurface.fillText( self.texts[i]["text"], left, top );
            }
            
            if( self.animationReady ){
                height = self.texts[self.textCounter]["fontSize"] * ( $( '#canvas' ).height() / 100 );
                self.canvasSurface.font = height + "px " + self.font;
                self.canvasSurface.fillStyle = self.texts[i]["fontColor"];
                left = self.texts[self.textCounter]["endPosition"]["left"] * ( $( '#canvas' ).width() / 100 );
                top = self.texts[self.textCounter]["endPosition"]["top"] * ( $( '#canvas' ).height() / 100 );
                self.canvasSurface.fillText( self.texts[self.textCounter]["text"], left, top );
            }
            else {
                if( self.animationCounter < self.animationLength ){
                    self.animationCounter++;
                    self.animateCharacters();
                }
                else {
                    self.animationCounter = 0;
                    if( self.textCounter < self.texts.length - 1 ){
                        self.textCounter++;
                        self.createCharacters();
                    }
                    else {
                        self.animationReady = true;
                    }
                }
            }
         
            
        };
        self.createCharacters = function() {
            self.debug( 'createCharacters' );
            self.characters = [];
            var text = self.texts[self.textCounter]; 
            var startLeft = text["startPosition"]["left"];
            var endLeft = text["endPosition"]["left"];
            for( var i = 0; i < text["text"].length; i++ ){
                //self.debug( 'add char: ' + text["text"][i]  + " left:" + startLeft);
                var character = { "character" :         text["text"][i],
                                  "startPosition" : {   "top" :    text["startPosition"]["top"],
                                                        "left" :   startLeft },
                                  "endPosition" : {     "top" :    text["endPosition"]["top"],
                                                        "left" :   endLeft },
                                  "position" : {        "top" :    text["startPosition"]["top"],
                                                        "left" :   startLeft } };
                self.characters.push( character );                            
                startLeft += text["startPosition"]["width"];
                endLeft += text["endPosition"]["width"];
            }
        };        
        self.animateCharacters = function() {
            var changeX = 0, changeY = 0;
            var text = self.texts[self.textCounter]; 
            self.debug( 'animateCharacters' + text["text"] + " font:" + text["fontSize"] );
            var characterWidth = 0;
            var fontSize = ( $( '#canvas' ).height() / 100 ) * text["fontSize"];
            var left = 0, top = 0;
            for( var i = 0; i < self.characters.length; i++ ){
                changeX = ( self.characters[i]["endPosition"]["left"] - self.characters[i]["startPosition"]["left"] ) / self.animationLength;
                changeY = ( self.characters[i]["endPosition"]["top"] - self.characters[i]["startPosition"]["top"]  ) / self.animationLength;
                self.characters[i]["position"]["left"] += changeX;
                self.characters[i]["position"]["top"] += changeY;
        
                left = ( self.characters[i]["position"]["left"] * ( $( '#canvas' ).width() / 100 ) ) + characterWidth;
                top = self.characters[i]["position"]["top"] * ( $( '#canvas' ).height() / 100 );
                
                self.canvasSurface.font = fontSize + "px " + self.font;
                characterWidth += self.canvasSurface.measureText( self.characters[i]["character"] ).width;
                self.canvasSurface.fillStyle = text["fontColor"];
                self.canvasSurface.fillText( self.characters[i]["character"], left, top );
            }        
        };
        // debug 
        self.debug = function( string ) {
            if( self.debugOn ) {
                jsProject.debug( self.MODULE + ' ' + string );
            }
        };

        // initialize the class 
        self.construct();
        
        // public
        return {
            show : function() {
                self.show();
            }
        };
    };
})( gameDevelopment );