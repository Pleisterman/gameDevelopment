/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this module constrols the different game modules for the application space invaders
*          the module controls constructing the game modules, 
*                              loading the assets and cancel option while loading, 
*                              showing game modules and starting the game, 
*                              hiding game modules and stop the game,
*                              setting window.onresize
*                              setting window.requestAnimationFrame
*                              
* Last revision: 24-06-2015
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
         *  module gameModule 
         *      
         *  functions: 
         *      private:
         *          construct                   called internal
         *          show                        called by the public function
         *          loadCancel                  called by the event subscription              
         *          loaded                      callback for the loadResources function of the gameLoaderModule    
         *          animate                     called by the event subscription 
         *          restartIntro                called by the event subscription, and by allInvadersKilled, invadersOnKillLine and allLivesLost during gameintro
         *          allInvadersKilled           called by the event subscription
         *          invadersOnKillLine          called by the event subscription
         *          allLivesLost                called by the event subscription
         *          gameStart                   called by spacebar press event set in the loaded function 
         *          startLevel                  called by the event subscription
         *          levelStop                   called by levelLost and levelComplete function
         *          levelComplete               called by the allInvadersKilled function
         *          afterLevelCompleteDelay     timed function called from levelComplete function
         *          levelLost                   called from the invadersOnKillLine and allLivesLost function
         *          afterLevelLostDelay         timed function called from levelLost function
         *          exit                        called from the headerModule
         *          debug                       
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      loadCancel                      called from gameLoaderModule, during load
         *      allInvadersKilled               called from invadersModule
         *      invadersOnKillLine              called from invadersModule
         *      allLivesLost                    called from livesModule
         *      restartIntro                    called from gameFlowModule
         *      startLevel                      called from gameFlowModule
         *      
         *  event calls
         *      sceneChange called on window.onresize when game is displayed 
         *      animate called on window.requestAnimationFrame when game is running        
         */

        // private
        var self = this;
        self.MODULE = 'gameModule';
        self.debugOn = true;
        self.visible = false;
        
        self.bodyResetWidth = "80%"; // used to reset body css values after game is closed
        self.bodyResetHeight = ""; // used to reset body css values after game is closed
        self.bodyResetMaxWidth = "1024px"; // used to reset body css values after game is closed
        
        self.layout = null;
        self.background = null;
        self.header = null;
        self.gameIntro = null;
        self.levels = null;
        self.player = null;
        self.bunkers = null;
        self.invaders = null;
        self.gameLoader = null;
        self.gameFlow = null;
        self.highScores = null;
        self.gameRunning = false;
        
        self.levelStopDelayTimer = null;
        self.levelStopDelay = 500;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create the modules
            self.layout = new gameDevelopment.gameLayoutModule();
            self.messages = new gameDevelopment.gameMessageModule();
            self.gameLoader = new gameDevelopment.gameLoaderModule();
            self.background = new gameDevelopment.backgroundModule();
            self.levels = new gameDevelopment.levelsModule();
            self.header = new gameDevelopment.gameHeaderModule( self.exit );
            self.player = new gameDevelopment.playerModule();
            self.invaders = new gameDevelopment.invadersModule();
            self.bunkers = new gameDevelopment.bunkersModule();
            self.gameIntro = new gameDevelopment.gameIntroModule();
            self.gameFlow = new  gameDevelopment.gameFlowModule();
            self.highScores = new  gameDevelopment.highScoresModule();
            // done create the modules

            // subscribe to events
            jsProject.subscribeToEvent( 'allInvadersKilled', self.allInvadersKilled );
            jsProject.subscribeToEvent( 'invadersOnKillLine', self.invadersOnKillLine );
            jsProject.subscribeToEvent( 'allLivesLost', self.allLivesLost );
            jsProject.subscribeToEvent( 'restartIntro', self.restartIntro );
            jsProject.subscribeToEvent( 'startLevel', self.startLevel );
            // done subscribe to events
            
        };
        self.show = function( ){
            self.debug( 'show' );
            
            // set the window.resize event
            window.onresize = function( ) {
                //self.debug( 'window.onresize' );
                jsProject.callEvent( 'sceneChange' );
            };

            // subscribe to the loadCancel event before load start
            jsProject.subscribeToEvent( "loadCancel", self.loadCancel );
            // start the load 
            self.gameLoader.load( self.loaded );
                
        };
        self.loadCancel = function() {
            self.debug( 'loadCancel' );
            
            // unsubscribe from the loadCancel event
            jsProject.unSubscribeFromEvent( "loadCancel", self.loadCancel )
            
            // exit the game
            self.exit();
        };
        self.loaded = function() {
            self.debug( 'loaded' );

            // unsubscribe from the loadCancel event
            jsProject.unSubscribeFromEvent( "loadCancel", self.loadCancel )
            
            self.visible = true;

            // reset the game
            jsProject.callEvent( "resetGameValues" );
            jsProject.setValue( "lives", "game", 3 );
            jsProject.callEvent( "setLevelValues" );
            // done reset the game

            // show the modules
            self.layout.show( true );
            self.background.show( true );
            self.header.show( true );
            self.player.show( true );
            self.invaders.show( true );
            self.bunkers.show( true );
            self.messages.show( true );
            // done show the modules
            
            // start game intro
            self.gameIntro.start();
            
            self.gameRunning = false;
            
            // show start game message
            jsProject.setValue( "id", "gameStartMessages", "pressSpaceToStartGame" );    
            jsProject.callEvent( "showGameStartMessage" );
            // done show start game message
            
            // set events to start the game
            jsProject.setValue( "spacebar", "keyPressEvents", self.gameStart );
            
            // start the animation
            self.animate();
        };
        self.animate = function( ){
            if( !self.visible ){
                // stop the animation
                return;
            }
            // call the event
            jsProject.callEvent( "animate" );
            // set the timer
            window.requestAnimationFrame( self.animate );
        };
        self.restartIntro = function(){
            // hide the modules to restart
            self.player.show( false );
            self.invaders.show( false );
            self.bunkers.show( false );
            // reset the game values
            jsProject.callEvent( "resetGameValues" );
            jsProject.setValue( "lives", "game", 3 );
            jsProject.callEvent( "setLevelValues" );
            // done reset the game values
            // show the modules
            self.background.show( true );
            self.header.show( true );
            self.player.show( true );
            self.invaders.show( true );
            self.bunkers.show( true );
            self.messages.show( true );
            // done show the modules
            
            // start the game intro
            self.gameIntro.start();
            
            self.gameRunning = false;
            
            
            // set events to start the game
            jsProject.setValue( "spacebar", "keyPressEvents", self.gameStart );
            // show start game message
            jsProject.setValue( "id", "gameStartMessages", "pressSpaceToStartGame" );    
            jsProject.callEvent( "showGameStartMessage" );
            // done show start game message

        };
        self.allInvadersKilled = function(){
            if( !self.gameRunning ){
                self.restartIntro();
                return;
            }
            self.levelComplete();
        };
        self.invadersOnKillLine = function(){
            if( !self.gameRunning ){
                self.restartIntro();
                return;
            }
            jsProject.setValue( "lost", "game", true );
            self.levelLost();
        };
        self.allLivesLost = function(){
            if( !self.gameRunning ){
                self.restartIntro();
                return;
            }
            jsProject.setValue( "lost", "game", true );
            self.levelLost();
        };
        self.gameStart = function(){
            jsProject.setValue( "spacebar", "keyPressEvents", null );
            jsProject.callEvent( "hideGameMessage" );

            // hide the header
            self.header.show( false );
            // show the exit button
            self.header.showExit( );
            
            // hide the modules for restart
            self.player.show( false );
            self.invaders.show( false );
            self.bunkers.show( false );
            self.messages.show( false );
            // done hide the modules for restart
            
            // stop the intro
            self.gameIntro.stop();

            // hide the start game message
            jsProject.callEvent( "hideGameStartMessage" );

            self.gameRunning = true; 
            
            // start the game
            self.gameFlow.startGame();
            
        };
        self.startLevel = function(){
            self.debug( 'startLevel' );
            
            // show the modules
            self.header.show( true );
            self.player.show( true );
            self.invaders.show( true );
            self.bunkers.show( true );
            self.messages.show( true );
            // done show the modules
            
            // activate key press events
            self.player.activateUserControls( true );
           
        };
        self.levelStop = function(){
            self.debug( "stopLevel" );
            
            // activate key press events
            self.player.activateUserControls( false );
            
            // hide the modules
            self.header.show( false );
            self.player.show( false );
            self.invaders.show( false );
            self.bunkers.show( false );
            // done hide the modules
            
            // show the exit button
            self.header.showExit( );
        };
        self.levelComplete = function(){
            // stop the level
            self.levelStop();
            // set the timer for delay
            self.levelStopDelayTimer = setTimeout( function () { self.afterLevelCompleteDelay( ); }, self.levelStopDelay );
        };
        self.afterLevelCompleteDelay = function(){
            // hide the messages
            self.messages.show( false );
            // level complete
            self.gameFlow.levelComplete();
        };
        self.levelLost = function(){
            // stop the level
            self.levelStop();
            // set the timer for delay
            self.levelStopDelayTimer = setTimeout( function () { self.afterLevelLostDelay(); }, self.levelStopDelay );
        };
        self.afterLevelLostDelay = function(){
            // hide the messages
            self.messages.show( false );
            // game lost
            self.gameFlow.showGameLost();
        };
        self.exit = function(){
            self.debug( 'exit' );
            self.visible = false;
            
            // hide the modules
            self.gameFlow.exitGame();
            self.layout.show( false );
            self.background.show( false );
            self.header.show( false );
            self.player.show( false );
            self.invaders.show( false );
            self.bunkers.show( false );
            self.messages.show( false );
            // done hide the modules
            
            // stop the intro
            self.gameIntro.stop();

            // reset the body dimensions
            $( document.body ).css( "height", self.bodyResetHeight );
            $( document.body ).css( "width", self.bodyResetWidth  );
            $( document.body ).css( "max-width", self.bodyResetMaxWidth  );
            // done reset the body dimensions
            // delete the resize function
            window.onresize = null;
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