/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the gameflow for the application space invaders
 *          
 * Last revision: 24-06-2015
 * 
 * Status:   code:               ready   
 *           comments:           ready 
 *           memory:             ready
 *           development:        ready      
 * 
 * NOTICE OF LICENSE
 *
 * Copyright (C) 2015  Pleisterman
 * 
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 * 
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


( function( gameDevelopment ){
    gameDevelopment.gameFlowModule = function( ) {


    /*
     *  module gameFlowModule 
     *   
     *  functions: 
     *      private:
     *          construct                   called internal
     *          startGame
     *          setEvents
     *          stopGame
     *          selectDifficulty
     *          difficultyReady
     *          levelIntroReady
     *          hideLevelIntro
     *          levelComplete
     *          levelResultReady
     *          showGameLost
     *          showGameResults
     *          gameReady
     *          exitGame
     *          debug
     *      public:
     *          startGame
     *          exitGame
     *          levelComplete
     *          showGameLost
     *           
     */
    
        // private
        var self = this;
        self.MODULE =               'gameFlowModule';
        self.debugOn =              true;
        self.visible =              false;                  // visibiltity
        self.firstLevelIntro =      null;                   // store module   
        self.difficulty =           null;                   // store module   
        self.levelIntro =           null;                   // store module
        self.levelResult =          null;                   // store module
        self.gameResult =           null;                   // store module
        self.gameWonModule =        null;                   // store module
        self.gameLostModule =       null;                   // store module
        self.eventDelayTimer =      null;                   // timer for delay between screens show and event set
        self.eventDelay =           200;                    // delay between screen show and event set 
        self.gameLost =             false;                  // store if game is lost
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create the modules
            self.firstLevelIntro = new gameDevelopment.firstLevelIntroModule();
            self.difficulty = new gameDevelopment.difficultyModule();
            self.levelIntro = new gameDevelopment.levelIntroModule();
            self.levelResult = new gameDevelopment.levelResultModule();
            self.gameResult = new gameDevelopment.gameResultModule();
            self.gameWonModule = new gameDevelopment.gameWonModule();
            self.gameLostModule = new gameDevelopment.gameLostModule();
            // done create the modules
            
        };
        self.startGame = function( ){
            
            self.visible = true;
            self.gameLost = false;
            // show first intro with callback to difficulty
            self.firstLevelIntro.show( self.selectDifficulty );
            // set the event set delay timer
            self.eventDelayTimer = setTimeout( function () { self.setEvents( self.selectDifficulty ); }, self.eventDelay );
        };
        self.setEvents = function( event ){
            // set the jdProject value for spacebar press
            jsProject.setValue( "spacebar", "keyPressEvents", event );
            if( event ){
                // add the click event
                $( "#messages" ).click( 
                    function() { 
                        event(); 
                    } 
                );
            }
            else {
                // remove the click event
                $( "#messages" ).unbind();
            }
        };
        self.selectDifficulty = function() {
            // callback from the first intro
            self.debug( 'selectDifficulty' );
            
            // remove the events
            self.setEvents( null );
            //hide first intro
            self.firstLevelIntro.hide();
            // show diffuclty screen with callback
            self.difficulty.show( self.difficultyReady );
        };
        self.difficultyReady = function(){
            // callback from difficulty screen
            self.debug( 'difficulty ready' );
            // reset the game values
            jsProject.callEvent( "resetGameValues" );
            // set current game level to level 1
            jsProject.setValue( "level", "game", 1 );
            jsProject.callEvent( "setLevelValues" );
            // done set current game level to level 1
            
            // show the level intro with callback fro when resources are loaded
            self.levelIntro.show( self.levelIntroReady );
        };
        self.levelIntroReady = function(){
            // resources for level are loaded 
            self.debug( 'levelIntro ready' );
            // set the event set delay timer
            self.eventDelayTimer = setTimeout( function () { self.setEvents( self.hideLevelIntro ); }, self.eventDelay );
        };
        self.hideLevelIntro = function(){
            // remove the events
            self.setEvents( null );
            // hide the intro
            self.levelIntro.hide();
            // reset level results
            self.levelResult.resetResult();
            // call the event to start the level
            jsProject.callEvent( "startLevel" );
        };
        self.levelComplete = function(){
            // show the level result screen
            self.levelResult.show( );
            // set the event set delay timer
            self.eventDelayTimer = setTimeout( function () { self.setEvents( self.levelResultReady ); }, self.eventDelay );
        };
        self.levelResultReady = function(){
            // remove the events
            self.setEvents( null );
            // hide the results
            self.levelResult.hide();
            if( self.gameLost ){
                // game lost
                self.gameLostModule.show( );
                // set the event set delay timer
                self.eventDelayTimer = setTimeout( function () { self.setEvents( self.showGameResults ); }, self.eventDelay );
            }
            else {
                var level = jsProject.getValue( "level", "game" );
                var levelCount = jsProject.getValue( "levelCount", "game" );
                if( level === levelCount ){
                    // last level reached game won
                    self.gameWonModule.show( );
                    // set the event set delay timer
                    self.eventDelayTimer = setTimeout( function () { self.setEvents( self.showGameResults ); }, self.eventDelay );
                }
                else {
                    // next level
                    level++;
                    jsProject.setValue( "level", "game", level );
                    jsProject.callEvent( "setLevelValues" );
                    // show the intro
                    self.levelIntro.show( self.levelIntroReady );
                }
            }
        };
        self.showGameLost = function(){
            // remove the events
            self.setEvents( null );

            self.gameLost = true;
            // show the level results
            self.levelResult.show( );
            // set the event set delay timer
            self.eventDelayTimer = setTimeout( function () { self.setEvents( self.levelResultReady ); }, self.eventDelay );
        };
        self.showGameResults = function(){
            // remove the events
            self.setEvents( null );
            if( self.gameLost ){
                // hide the game lost screen
                self.gameLostModule.hide( );
            }
            else {
                // hode te game won screen
                self.gameWonModule.hide( );
            }
            // game results show
            self.gameResult.show( );
            // set the event set delay timer
            self.eventDelayTimer = setTimeout( function () { self.setEvents( self.gameReady ); }, self.eventDelay );
        };
        self.gameReady = function(){
            // remove the events
            self.setEvents( null );
            // game results hide
            self.gameResult.hide( );
            // call event to restart game intro
            jsProject.callEvent( "restartIntro" );
        };
        self.exitGame = function( ){
            self.visible = false;
            // remove the events
            self.setEvents( null );
            // hide the modules
            self.firstLevelIntro.hide( );
            self.difficulty.hide();
            self.levelIntro.hide();
            self.levelResult.hide();
            // done hide the modules
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
            startGame : function( ) {
                self.startGame( );
            },
            exitGame : function(){
                self.exitGame();
            },
            levelComplete : function( ){
                self.levelComplete( );
            },
            showGameLost : function( ){
                self.showGameLost( );
            }
        };
    };
})( gameDevelopment );