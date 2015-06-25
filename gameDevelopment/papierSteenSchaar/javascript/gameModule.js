/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module constrols the diffetent game modules for the application Rock-Paper-Scissors
 *          the module controls constructing the game modules, 
 *                              loading the assets and cancel option while loading, 
 *                              showing game modules and starting the game, 
 *                              hiding game modules and stop the game,
 *                              
 * Last revision: 01-06-2015
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       ready
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
    gameDevelopment.gameModule = function( ) {


    /*
     *  module introModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          debug
     *          
     *  event subscription: 
     */
    
        // private
        var self = this;
        self.MODULE = 'gameModule';
        self.debugOn = true;
        self.gameLoader = null;             // store the gameLoader module
        self.playingfield = null;           // store the playingfield module
        self.strategiesPanel = null;        // store the strategiesPanel module
        self.gameSetsPanel = null;          // store the gameSetsPanel module
        self.computerPlayer = null;         // store the computerPlayer module
        self.player = null;                 // store the player module
        self.scores = null;                 // store the scores module
        self.gameButtons = null;            // store the gameButtons module
        self.startButtons = null;           // store the startButtons module
        self.gameFlow = null;               // store the gameFlow module

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create modules
            self.gameLoader = new gameDevelopment.gameLoaderModule();
            self.playingfield = new gameDevelopment.playingfieldModule();
            self.strategiesPanel = new gameDevelopment.strategiesModule();
            self.gameSetsPanel = new gameDevelopment.gameSetsModule();
            self.computerPlayer = new gameDevelopment.computerPlayerModule();
            self.player = new gameDevelopment.playerModule();
            self.scores = new gameDevelopment.scoresModule();
            self.gameButtons = new gameDevelopment.gameButtonsModule();
            self.startButtons = new gameDevelopment.startButtonsModule();
            self.gameFlow = new gameDevelopment.gameFlowModule();
            // done create modules
        
            // subscribe to events
            jsProject.subscribeToEvent( 'introReady', self.introReady );
            jsProject.subscribeToEvent( 'exit', self.hide );
            jsProject.subscribeToEvent( 'exitReady', self.exitReady );
            jsProject.subscribeToEvent( 'gameSetsChange', self.restartGame );
            jsProject.subscribeToEvent( 'strategyChange', self.restartGame );
            jsProject.subscribeToEvent( 'restartGame', self.restartGame );
            jsProject.subscribeToEvent( 'startGame', self.startGame );
            // done subscribe to events
            
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
            
            // subscribe to the loadCancel event before load start
            jsProject.subscribeToEvent( "loadCancel", self.loadCancel );
            // start the load 
            self.gameLoader.load( self.loaded );
            
        };
        self.loaded = function() {
            self.debug( 'loaded' );

            // unsubscribe from the loadCancel event
            jsProject.unSubscribeFromEvent( "loadCancel", self.loadCancel )
            
            // the playingfield module will show the playingfield in steps
            // and it will call the introReady event when this is done
            self.playingfield.show( true );
        };
        self.loadCancel = function() {
            self.debug( 'loadCancel' );
            
            // unsubscribe from the loadCancel event
            jsProject.unSubscribeFromEvent( "loadCancel", self.loadCancel )
            
            // exit the game
            self.hide();
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
            self.gameSetsPanel.show( true );
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
            self.gameSetsPanel.show( false );
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