/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the gameModule for the application pleisterman Guitar Slider
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
    gameDevelopment.gameModule = function( ) {


    /*
     *  module gameModule 
     *  purpose:
     *   this module controls gameModule for the gameDevelopment.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'gameModule';
        self.debugOn = false;
        self.playingfield = null;
        self.strategiesPanel = null;
        self.gameModesPanel = null;
        self.computerPlayer = null;
        self.player = null;
        self.scores = null;
        self.gameButtons = null;
        self.startButtons = null;
        self.gameFlow = null;

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            self.playingfield = new gameDevelopment.playingfieldModule();
            self.strategiesPanel = new gameDevelopment.strategiesModule();
            self.gameModesPanel = new gameDevelopment.gameModesModule();
            self.computerPlayer = new gameDevelopment.computerPlayerModule();
            self.player = new gameDevelopment.playerModule();
            self.scores = new gameDevelopment.scoresModule();
            self.gameButtons = new gameDevelopment.gameButtonsModule();
            self.startButtons = new gameDevelopment.startButtonsModule();
            self.gameFlow = new gameDevelopment.gameFlowModule();
        
            jsProject.subscribeToEvent( 'introReady', self.introReady );
            jsProject.subscribeToEvent( 'exit', self.hide );
            jsProject.subscribeToEvent( 'exitReady', self.exitReady );
            jsProject.subscribeToEvent( 'gameModeChange', self.restartGame );
            jsProject.subscribeToEvent( 'strategyChange', self.restartGame );
            jsProject.subscribeToEvent( 'restartGame', self.restartGame );
            jsProject.subscribeToEvent( 'startGame', self.startGame );
        };
        self.resetScores = function(){
            jsProject.setValue( "previousComputerHand", "game", null );
            jsProject.setValue( "previousPlayerHand", "game", null );
            jsProject.setValue( "player", "scores", 0 );
            jsProject.setValue( "computer", "scores", 0 );
            jsProject.setValue( "setsPlayed", "scores", 0 );
        }
        self.show = function( ){
            self.resetScores();
            // the playingfield module will show the playingfield in steps
            // and it will call the introReady event when this is done
            self.playingfield.show( true );
        };
        self.hide = function(){
            // the hide function is called by the exit event 
            // the playingfield module will hide the playingfield in steps
            // and it will call the exitReady event when this is done
            jsProject.callEvent( "gameStop" );
            self.playingfield.show( false );
        }
        self.restartGame = function( ){
            self.resetScores();
            jsProject.callEvent( "gameStop" );
            self.startButtons.show( true );
        };
        self.startGame = function( ){
            self.gameFlow.startGame();
        };
        self.introReady = function(){
            // the playingfield module will show the playingfield in steps
            // and it will call the introReady event when this is done
            self.gameModesPanel.show( true );
            self.strategiesPanel.show( true );
            self.computerPlayer.show( true );
            self.player.show( true );
            self.scores.show( true );
            self.gameButtons.show( true );
            self.startButtons.show( true );
        };
        self.exitReady = function(){
            // the playingfield module will hide the playingfield in steps
            // and it will call the exitReady event when this is done
            self.gameModesPanel.show( false );
            self.strategiesPanel.show( false );
            self.player.show( false );
            self.computerPlayer.show( false );
            self.scores.show( false );
            self.gameButtons.show( false );
            self.startButtons.show( false );
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
            show : function(){
                self.show();
            }
        };
    };
})( gameDevelopment );