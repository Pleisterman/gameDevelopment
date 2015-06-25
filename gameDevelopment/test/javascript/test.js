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
        self.animationReady = false;
        self.font = "Arial";
        self.titleFontSize = 5;
        self.fontSize = 2.5;
        self.linePadding = 1;
        self.animationDelay = 2000;                      // ms
        self.lastAnimationDate = 0;                    // save last animation time for delay
        self.offsetTop = 5;
        self.offsetLeft = 10;
        self.introText = [          "Welcome Commander", 
                                    "" , 
                                    "We have a situation here." , 
                                    "" , 
                                    "Our fleet is defending a wormhole is sector B." , 
                                    "Some of the invaders have broken through our lines and made it to earth." , 
                                    "We have only a few man left here so we have to call you in." , 
                                    "There are several units you can take command of." , 
                                    "" , 
                                    "Make your choice wisely, we cannot afford to loose you." , 
                                    "" , 
                                    "Good Luck." ];
        self.difficultyOne = [      "Code Name: WatchTower", 
                                    "", 
                                    "Mission Objectives:", 
                                    "Defend Bridges, Waterstations, and Weather Satelites." , 
                                    "Defence ring 3" , 
                                    "" , 
                                    "Low alien activity" , 
                                    "Minor damage" , 
                                    "" ];
        self.difficultyTwo = [      "Code Name: FearlessKnight", 
                                    "", 
                                    "Mission Objectives:", 
                                    "Defend Militairy Compounds, Airfields, and Defense Satelites." , 
                                    "Defence ring 2" , 
                                    "" , 
                                    "Medium alien activity" , 
                                    "structural damage in sector c en g" , 
                                    "" ];
        self.difficultyThree = [    "Code Name: Dragonslayer", 
                                    "", 
                                    "Mission Objectives:", 
                                    "Defend Factories, Fusion Reactors, and Space Stations." , 
                                    "Defence ring 1" , 
                                    "" , 
                                    "Heavy alien activity" , 
                                    "structural damage in all sectors" , 
                                    "" ];
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            self.layout = new gameDevelopment.testLayoutModule();
            self.canvasSurface = document.getElementById( 'canvas' ).getContext( '2d' );
            $( "#canvas" ).css( "background-color", "red" );
        };
        self.show = function( ){
            self.debug( 'show' );
            self.layout.show( true );
            // set the window.resize event
            window.onresize = function( ) {
                jsProject.callEvent( 'sceneChange' );
            };
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
            
            var left = ( $( '#background' ).width() / 100 ) * self.offsetLeft;
            var top = ( $( '#background' ).height() / 100 ) * self.offsetTop;
            var linePadding = ( $( '#background' ).height() / 100 ) * self.linePadding;
            var titleFontSize = ( $( '#background' ).height() / 100 ) * self.titleFontSize;
            self.canvasSurface.font = titleFontSize + "px " + self.font;
            var fontSize = ( $( '#background' ).height() / 100 ) * self.fontSize;
            self.canvasSurface.fillStyle = 'black';
            for( var i = 0; i < self.introText.length; i++ ){
                //self.debug( 'animate' + self.introText[i] );
                if( i > 0 ){
                    self.canvasSurface.font = fontSize + "px " + self.font;
                    top += fontSize + linePadding;
                }
                else {
                    top += titleFontSize + linePadding;
                }
                self.canvasSurface.fillText( self.introText[i], left, top );

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