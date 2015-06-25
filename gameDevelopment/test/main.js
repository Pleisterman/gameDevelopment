/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the main for the application pleisterman Guitar Slider
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
    gameDevelopment.main = function( ) {


    /*
     *  module main 
     *  purpose:
     *   this module controls main for the gameDevelopment.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'main';
        self.debugOn = true;
        self.intro = null;
        self.game = null;
        self.effects = [ "gameControlsExitOver", "gameControlsOver", "gameControlsClick", "playerHandSelectOver", "playerHandSelect", 
                         "popupMenu", "popupMenuOver", 'playButton', 'playButtonOver', "countdown", "winGame", "lostGame", "winMatch", "lostMatch" ];
        self.sounds = [ "intro", "exit" ];
        
        self.images = [ 'exitButton', 'exitButtonOver', 'playfieldBackground', 'handStone',
                        'handPaper', 'handScissors', 'slowButton', 'slowButtonOver', 'mediumButton', 'mediumButtonOver', 'fastButton', 'fastButtonOver', 
                        'stoneButton', 'stoneButtonOver', 'stoneButtonSelected', 'stoneButtonDisabled', 'paperButton', 'paperButtonOver', 'paperButtonSelected', 
                        'paperButtonDisabled', 'scissorsButton', 'scissorsButtonOver', 'scissorsButtonSelected', 'scissorsButtonDisabled' ];
                    
        self.values = [ { "groupName" : "sound", "valueName" : "loaded", "value" : false },
                        { "groupName" : "sound", "valueName" : "on", "value" : false },
                        { "groupName" : "effects", "valueName" : "loaded", "value" : false },
                        { "groupName" : "effects", "valueName" : "on", "value" : false },
                        { "groupName" : "scores", "valueName" : "player", "value" : 0 },
                        { "groupName" : "scores", "valueName" : "computer", "value" : 0 },
                        { "groupName" : "scores", "valueName" : "bestOf", "value" : 0 },
                        { "groupName" : "scores", "valueName" : "gamesPlayed", "value" : 0 },
                        { "groupName" : "game", "valueName" : "speed", "value" : 0 },
                        { "groupName" : "game", "valueName" : "playerHand", "value" : 0 },
                        { "groupName" : "game", "valueName" : "previousPlayerHand", "value" : null },
                        { "groupName" : "game", "valueName" : "computerHand", "value" : 0 },
                        { "groupName" : "game", "valueName" : "previousComputerHand", "value" : null },
                        { "groupName" : "game", "valueName" : "strategy", "value" : 0 },
                        // z indexes
                        { "groupName" : "zIndex", "valueName" : "playingfield", "value" : 60 },
                        { "groupName" : "zIndex", "valueName" : "computer", "value" : 69 },
                        { "groupName" : "zIndex", "valueName" : "playerHand", "value" : 69 },
                        { "groupName" : "zIndex", "valueName" : "scores", "value" : 70 },
                        { "groupName" : "zIndex", "valueName" : "playerButtons", "value" : 69 },
                        { "groupName" : "zIndex", "valueName" : "gameControls", "value" : 70 },
                        { "groupName" : "zIndex", "valueName" : "playControl", "value" : 71 },
                        { "groupName" : "zIndex", "valueName" : "alerts", "value" : 72 },
                        { "groupName" : "zIndex", "valueName" : "strategies", "value" : 100 },
                        { "groupName" : "zIndex", "valueName" : "gameModes", "value" : 100 } ];            
        self.validSoundExtension = null;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            
            // add the values for the app
            for( var i = 0; i < self.values.length; i++ ) {
                jsProject.addValue( self.values[i]["valueName"], self.values[i]["groupName"], self.values[i]["value"] );
            }
            
            self.intro = new gameDevelopment.gameIntroModule( );
            self.game = new gameDevelopment.gameModule();
            
            // add the images for preloading
            for( var i = 0; i < self.images.length; i++ ){
                jsProject.addResource( self.images[i], './papierSteenSchaar/images/' + self.images[i] + '.png', 'image' );
            }
            jsProject.loadResources( self.resourcesLoaded );
            
            // check for sound extensions if !mobile sound for mobile is off.
            if( !gameDevelopment.isMobileBrowser ){
                var soundExtensions = [ "mp3", "ogg" ];
                for( var i = 0; i < soundExtensions.length; i++ ) {
                    if( !self.validSoundExtension && jsProject.canPlaySoundType( soundExtensions[i] ) ){
                        self.validSoundExtension = soundExtensions[i];
                    }
                }
            }
        };
        self.startGame = function(){
            self.game.show();
        };
        self.loadSound = function(){
            $( "#startButton" ).html( "Loading..." );
            $( "#startButton" ).off();
            $( "#loadSoundButton" ).off();
            $( "#loadEffectsButton" ).off();
            if( self.validSoundExtension ){
                for( var i = 0; i < self.sounds.length; i++ ){
                    jsProject.addResource( self.sounds[i], './papierSteenSchaar/sounds/' + self.sounds[i] + '.' + self.validSoundExtension, 'sound' );
                }
                jsProject.loadResources( self.loadSoundReady );
            }
            else {
                self.loadSoundReady();
            }
        };
        self.loadSoundReady = function(){
            jsProject.setValue( "on", "sound", true );
            jsProject.setValue( "loaded", "sound", true );
            self.intro.soundLoaded( );
            $( "#startButton" ).html( "Start" );
            $( "#startButton" ).click( function(){ self.startGame(); } );
            if( !jsProject.getValue( "loaded", "effects" ) ){
                $( "#loadEffectsButton" ).click( function(){ self.loadEffects(); } );
            }
        };
        self.loadEffects = function(){
            $( "#startButton" ).html( "Loading..." );
            $( "#startButton" ).off();
            $( "#loadSoundButton" ).off();
            $( "#loadEffectsButton" ).off();
            if( self.validSoundExtension ){
                for( var i = 0; i < self.effects.length; i++ ){
                    jsProject.addResource( self.effects[i], './papierSteenSchaar/sounds/' + self.effects[i] + '.' + self.validSoundExtension, 'sound' );
                }
                jsProject.loadResources( self.loadEffectsReady );
            }
            else {
                self.loadEffectsReady();
            }
        };
        self.loadEffectsReady = function(){
            jsProject.setValue( "on", "effects", true );
            jsProject.setValue( "loaded", "effects", true );
            self.intro.effectsLoaded( );
            $( "#startButton" ).html( "Start" );
            $( "#startButton" ).click( function(){ self.startGame(); } );
            if( !jsProject.getValue( "loaded", "sound" ) ){
                $( "#loadSoundButton" ).click( function(){ self.loadSound(); } );
            }
        };
        self.resourcesLoaded = function(){
            self.debug( 'resourcesLoaded---------' );
            window.onresize = function( ) {
                jsProject.callEvent( 'sceneChange' );
            };
            $( "#startButton" ).html( "Start" );
            $( "#startButton" ).click( function(){ self.startGame(); } );
            if( !gameDevelopment.isMobileBrowser ){
                $( "#loadSoundButton" ).click( function(){ self.loadSound(); } );
                $( "#loadEffectsButton" ).click( function(){ self.loadEffects(); } );
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
        };
    };
})( gameDevelopment );