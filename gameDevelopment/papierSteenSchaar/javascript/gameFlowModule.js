/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the game flow for the game Rock-Paper-Scissors
 *          the module displays a start message when the game starts
 *          severeal messages are displayed and a countdown
 *          the module activates and deativates the player buttons
 *          the modue activates the computer choice
 *          the module controls beginning and ending of sets and the game
 *          the moduule evaluates the results of the choices of the sets
 *          the module controls game loose and win states
 *          
 *          
 * Last revision: 04-06-2015
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
    gameDevelopment.gameFlowModule = function( ) {


    /*
     *  module gameFlowModule 
     *      
     *  functions: 
     *      private:
     *          construct                       called internal
     *          startGame                       called by the public function
     *          showFirstStartMessages          called by the startGame function
     *          flickerFirstStartMessage        called by a timer set in the function showFirstStartMessages
     *          delayFirstStartMessage          called by a timer set in the function flickerFirstStartMessage  
     *          showStartMessages               called by a timer set in the function delayFirstStartMessage when all first start messages are shown,
     *                                          called by a timer set in the function delayDrawMessage when all draw messages are shown,
     *                                          called by a timer set in the function nextSet when set is ready
     *          flickerStartMessage             called by a timer set in the function showStartMessages
     *          delayStartMessage               called by a timer set in the function flickerStartMessage
     *          showCountdown                   called by a timer set in the function delayStartMessage when all start messages are shown
     *          countdown                       called by a timer set in the function showCountdown and a timer set in the function
     *          resetCountdown                  called by the function showCountdown    
     *          evaluateResult                  called by a timer set in the function countdown when the countdown is done
     *          showDrawMessages                called by a timer set in the function evaluateResult when there is a draw 
     *          flickerDrawMessage              called by a timer set in the function showDrawMessages
     *          delayDrawMessage                called by a timer set in the function flickerDrawMessage
     *          lost                            called by a timer set in the function evaluateResult when user looses
     *          showLostMessages                called by the function lost
     *          flickerLostMessage              called by a timer set in the function showLostMessages
     *          delayLostMessage                called by a timer set in the function flickerLostMessage
     *          win                             called by a timer set in the function evaluateResult when user wins
     *          showWinMessages                 called by the function win
     *          flickerWinMessage               called by a timer set in the function showWinMessages
     *          delayWinMessage                 called by a timer set in the function flickerWinMessage
     *          nextSet                         called by a timer set in the function delayLostMessage when all lost messages are shown
     *                                          called by a timer set in the function delayWinMessage when all win messages are shown
     *          evaluateMatch                   called by the function nextSet when all sets are played
     *          matchWin                        called by the function evaluateMatch
     *          showMatchWinMessages            called by the function matchWin
     *          flickerMatchWinMessage          called by a timer set in the function showMatchWinMessages
     *          delayMatchWinMessage            called by a timer set in the function flickerMatchWinMessage        
     *          matchLoose                      called by the function evaluateMatch
     *          showMatchLooseMessages          called by the function matchLoose
     *          flickerMatchLooseMessage        called by a timer set in the function showMatchLooseMessages
     *          delayMatchLooseMessage          called by a timer set in the function flickerMatchLooseMessage        
     *          nextMatch                       called by a timer set in the function delayMatchLooseMessage when all match loose messages are shown
     *                                          called by a timer set in the function delayMatchWinMessage when all match win messages are shown
     *          stopGame                        called by the event subscription gameStop
     *          debug
     *     public:
     *          startGame
     *          stopGame
     *          
     *  event subscription: 
     *      gameStop                            called from gameModule
     */
    
        // private
        var self = this;
        self.MODULE = 'gameFlowModule';
        self.debugOn = false;
        self.startDelay = 400;
        self.alerts = null;                                                 // store the alerts module
        self.firstStartMessages = [ {   "messageid" : "letsStart",          // store the first start messages only displayed when a match starts
                                        "showTime" : 300,
                                        "flickerTime" : 800,
                                        "nextDelayTime" : 200 },
                                    {   "messageid" : "weWillPlay",
                                        "showTime" : 300,
                                        "flickerTime" : 800,
                                        "nextDelayTime" : 200 },
                                    {   "messageid" : "goodLuck",
                                        "showTime" : 300,
                                        "flickerTime" : 800,
                                        "nextDelayTime" : 200 } ];
        self.startMessages = [ {        "messageid" : "gameNumber",         // store the start messages, displayed at set start
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 100 },
                               {        "messageid" : "makeYourChoice",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 }];
        self.drawMessages = [ {         "messageid" : "itsADraw",           // store the draw messages diplayed when there is a draw
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 },
                               {        "messageid" : "weWillStartOver",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 400 }];
        self.lostMessages = [ {         "messageid" : "youLost",            // store the first lost messages displayed when the set is lost
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 },
                               {        "messageid" : "betterLuckNextTime",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 400 }];
        self.winMessages = [ {          "messageid" : "youWin",             // store the first win messages displayed when the set is won
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 },
                               {        "messageid" : "congratulations",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 400 }];
        self.matchWinMessages = [ {     "messageid" : "youWonTheMatch",     // store the match win messages displayed if a match is won
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 },
                                  {     "messageid" : "wellPlayed",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 400 }];
        self.matchLooseMessages = [ {   "messageid" : "youLostTheMatch",    // store the match loose messages, displayed if a match is lost
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 200 },
                                    {   "messageid" : "youCanTryAgain",
                                        "showTime" : 300,
                                        "flickerTime" : 400,
                                        "nextDelayTime" : 400 }];
        self.timer = null;                                                  // store the timer
        self.currentFirstStartMessage = 0;                                  // store which message to display
        self.currentStartMessage = 0;                                       // store which message to display
        self.currentDrawMessage = 0;                                        // store which message to display    
        self.currentLostMessage = 0;                                        // store which message to display
        self.currentWinMessage = 0;                                         // store which message to display
        self.currentMatchWinMessage = 0;                                    // store which message to display
        self.currentMatchLooseMessage = 0;                                  // store which message to display
        self.countdownDelay = 400;                                          // ms onstant, store animation delay for countdown
        self.currentCountdownCount = 0;                                     // store counter for countdown
        self.countdownShakeStart = 3;                                       // store when to start shaking movement
        self.evaluateDelay = 400;                                           // ms constant, store delay between showing choices and evaluation of the choice 
        self.nextSetDelay = 500;                                            // ms constant, delay between games of a match
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create the alerts module
            self.alerts = new gameDevelopment.gameFlowAlertsModule();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'gameStop', self.stopGame );
        };
        self.startGame = function() {
            self.debug( 'startGame' );
            
            // call the gameStart event to prepare the modules
            jsProject.callEvent( "gameStart" );
            // reset first start messages
            self.currentFirstStartMessage = 0;
            self.currentStartMessage = 0;
            // show messages
            self.showFirstStartMessages();
        };
        self.showFirstStartMessages = function(){
            // match start
            
            // remove the timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove the timer
            
            // show message
            self.alerts.show( self.firstStartMessages[self.currentFirstStartMessage]["messageid"] );
            // set delay timer
            self.timer = setTimeout( function () { self.flickerFirstStartMessage(); }, self.firstStartMessages[self.currentFirstStartMessage]["showTime"] );
        };
        self.flickerFirstStartMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message
            self.alerts.flicker();
            
            // set timer
            self.timer = setTimeout( function () { self.delayFirstStartMessage(); }, self.firstStartMessages[self.currentFirstStartMessage]["flickerTime"] );
        };
        self.delayFirstStartMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentFirstStartMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentFirstStartMessage < self.firstStartMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showFirstStartMessages(); }, self.firstStartMessages[self.currentFirstStartMessage]["nextDelayTime"] );
            }
            else {
                // reset start message
                self.currentStartMessage = 0;
                // set timer for start messages
                self.timer = setTimeout( function () { self.showStartMessages(); }, self.firstStartMessages[self.currentFirstStartMessage - 1]["nextDelayTime"] );
            }
        };
        self.showStartMessages = function(){
            // bgin new set or restart set after draw
            
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.startMessages[self.currentStartMessage]["messageid"] );

            if( self.startMessages[self.currentStartMessage]["messageid"] === "makeYourChoice" ){
                // activate user controls
                jsProject.callEvent( "enablePlayerChoice" );
                // create computer choice
                jsProject.callEvent( "makeComputerChoice" );
            }
            
            // set delay timer
            self.timer = setTimeout( function () { self.flickerStartMessage(); }, self.startMessages[self.currentStartMessage]["showTime"] );
        };
        self.flickerStartMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // flicker message
            self.alerts.flicker();
            
            // set delay timer
            self.timer = setTimeout( function () { self.delayStartMessage(); }, self.startMessages[self.currentStartMessage]["flickerTime"] );
        };
        self.delayStartMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer

            // next message
            self.currentStartMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentStartMessage < self.startMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showStartMessages(); }, self.startMessages[self.currentStartMessage]["nextDelayTime"] );
            }
            else {
                // set timer for countdown
                self.timer = setTimeout( function () { self.showCountdown(); }, self.startMessages[self.currentStartMessage - 1]["nextDelayTime"] );
            }
        };
        self.showCountdown = function(){
            self.debug( "countDown" );  
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // reset counter
            self.resetCountdown();
            
            // show message
            self.alerts.showCountdown( self.currentCountdownCount );
            // call the event to start hand shake animation
            jsProject.callEvent( "handShake" );

            // play sound
            if( jsProject.getValue( "on", "sound" ) ){
                var sound = jsProject.getResource( 'countdown', 'sound' );
                if( sound ){
                    sound.play();
                }
            }
            // done play sound
            
            // set timer for countdown delay
            self.timer = setTimeout( function () { self.countdown(); }, self.countdownDelay );
        };
        self.countdown = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // update countdown
            self.currentCountdownCount--;
            if( self.currentCountdownCount > 0 ){
                
                // show countdown number
                self.alerts.showCountdown( self.currentCountdownCount );
                // play sound
                if( jsProject.getValue( "on", "sound" ) ){
                    var sound = jsProject.getResource( 'countdown', 'sound' );
                    if( sound ){
                        sound.play();
                    }
                }
                // done play sound
                
                // next countdown
                self.timer = setTimeout( function () { self.countdown(); }, self.countdownDelay );
            }
            else {
                // countdown ready
                
                // hide the countdown number
                self.alerts.hide( );
                
                // set timer to evaluate result
                self.timer = setTimeout( function () { self.evaluateResult(); }, self.evaluateDelay );
            }
        };
        self.resetCountdown = function(){
            // set countdown for selected game speed
            switch( jsProject.getValue( "speed", "game" ) ) {
                case 0 : {
                     self.currentCountdownCount = 7;
                    break;
                }
                case 1 : {
                     self.currentCountdownCount = 5;
                    break;
                }
                case 2 : {
                     self.currentCountdownCount = 3;
                    break;
                }
                default : {
                    self.debug( "unknown speed value" );
                }
            }
            // done set countdown for selected game speed
        };
        self.evaluateResult = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            self.debug( 'evaluateResult' );

            // reset messages
            self.currentDrawMessage = 0;
            self.currentLostMessage = 0;
            self.currentWinMessage = 0;
            // done reset messages
            
            // let modules show the choice
            jsProject.callEvent( "showChoice" );
            
            // get choices
            var playerHand = jsProject.getValue( "playerHand", "game" );
            var computerHand = jsProject.getValue( "computerHand", "game" );
            // done get choices

            if( computerHand === playerHand ){
                // its a draw
                self.showDrawMessages();
            }
            else {
                if( playerHand === 0 ){ // stone
                    if( computerHand === 1 ){ //paper computer win
                        self.lost();
                    }
                    else { // scissors user win
                        self.win();
                    }
                }
                if( playerHand === 1 ){ //paper
                    if( computerHand === 2 ){ // scissors  computer win
                        self.lost();
                    }
                    else { // stone user win
                        self.win();
                    }
                }
                if( playerHand === 2 ){ // scissors
                    if( computerHand === 0 ){ // stone computer win
                        self.lost();
                    }
                    else { //paper user win
                        self.win();
                    }
                }
            }
        };
        self.showDrawMessages = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.drawMessages[self.currentDrawMessage]["messageid"] );
            
            // set timer
            self.timer = setTimeout( function () { self.flickerDrawMessage(); }, self.drawMessages[self.currentDrawMessage]["showTime"] );
        };
        self.flickerDrawMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message    
            self.alerts.flicker();
            
             // set timer
            self.timer = setTimeout( function () { self.delayDrawMessage(); }, self.drawMessages[self.currentDrawMessage]["flickerTime"] );
        };
        self.delayDrawMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentDrawMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentDrawMessage < self.drawMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showDrawMessages(); }, self.drawMessages[self.currentDrawMessage]["nextDelayTime"] );
            }
            else {
                // reset start message
                self.currentStartMessage = 0;
                // reset choice
                jsProject.callEvent( "resetChoice" );
                // set timer for start messages, we restart this set
                self.timer = setTimeout( function () { self.showStartMessages(); }, self.drawMessages[self.currentDrawMessage - 1]["nextDelayTime"] );
            }
        };
        self.lost = function(){
            // set game values
            var gamesPlayed = jsProject.getValue( "setsPlayed", "scores" );
            gamesPlayed++;
            var computerScore = jsProject.getValue( "computer", "scores" );
            computerScore++;
            jsProject.setValue( "setsPlayed", "scores", gamesPlayed );
            jsProject.setValue( "computer", "scores", computerScore );
            // done set game values
            
            // show messages
            self.showLostMessages();
            // play sound
            if( jsProject.getValue( "on", "sound" ) ){
                var lostSound = jsProject.getResource( 'lostGame', 'sound' );
                if( lostSound ){
                    lostSound.play();
                }
            }
            // done play sound
        };
        self.showLostMessages = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.lostMessages[self.currentLostMessage]["messageid"] );
            // set delay timer
            self.timer = setTimeout( function () { self.flickerLostMessage(); }, self.lostMessages[self.currentLostMessage]["showTime"] );
        };
        self.flickerLostMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message
            self.alerts.flicker();
            
            // set timer
            self.timer = setTimeout( function () { self.delayLostMessage(); }, self.lostMessages[self.currentLostMessage]["flickerTime"] );
        };
        self.delayLostMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentLostMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentLostMessage < self.lostMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showLostMessages(); }, self.lostMessages[self.currentLostMessage]["nextDelayTime"] );
            }
            else {
                // set timer for next set
                self.timer = setTimeout( function () { self.nextSet(); }, self.lostMessages[self.currentLostMessage - 1]["nextDelayTime"] );
            }
        };
        self.win = function(){
            self.debug( "win" );
            // set game values
            var gamesPlayed = jsProject.getValue( "setsPlayed", "scores" );
            gamesPlayed++;
            var playerScore = jsProject.getValue( "player", "scores" );
            playerScore++;
            jsProject.setValue( "setsPlayed", "scores", gamesPlayed );
            jsProject.setValue( "player", "scores", playerScore );
            // done set game values
            
            // show messages
            self.showWinMessages();
            // play sound
            if( jsProject.getValue( "on", "sound" ) ){
                var winSound = jsProject.getResource( 'winGame', 'sound' );
                if( winSound ){
                    winSound.play();
                }
            }
            // done play sound
        };
        self.showWinMessages = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.winMessages[self.currentWinMessage]["messageid"] );
            // set delay timer
            self.timer = setTimeout( function () { self.flickerWinMessage(); }, self.winMessages[self.currentWinMessage]["showTime"] );
        };
        self.flickerWinMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message
            self.alerts.flicker();
            // set timer
            self.timer = setTimeout( function () { self.delayWinMessage(); }, self.winMessages[self.currentWinMessage]["flickerTime"] );
        };
        self.delayWinMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentWinMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentWinMessage < self.winMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showWinMessages(); }, self.winMessages[self.currentWinMessage]["nextDelayTime"] );
            }
            else {
                // set timer for next set
                self.timer = setTimeout( function () { self.nextSet(); }, self.winMessages[self.currentWinMessage - 1]["nextDelayTime"] );
            }
        };
        self.nextSet = function(){
            self.debug( "nextSet" );
            // call event to show new score
            jsProject.callEvent( "scoreChanged" );
            // hide messages
            self.alerts.hide( );
            // reset the choice of the modules
            jsProject.callEvent( "resetChoice" );
            
            // set game values
            var gamesPlayed = jsProject.getValue( "setsPlayed", "scores" );
            var bestOf = jsProject.getValue( "bestOf", "scores" );
            if( gamesPlayed < bestOf ){
                // next set
                self.currentStartMessage = 0;
                self.timer = setTimeout( function () { self.showStartMessages(); }, self.nextSetDelay );
            }
            else {
                // all sets played
                self.evaluateMatch();
            }
        };
        self.evaluateMatch = function() {
            self.debug( "evaluateMatch" );
            // get scores
            var playerWin = jsProject.getValue( "player", "scores" );
            var computerWin = jsProject.getValue( "computer", "scores" );
            // done get scores
            
            if( playerWin > computerWin ){
                self.matchWin();
            }
            else {
                self.matchLoose();
            }
        };
        self.matchWin = function() {
            //  reset win messages
            self.currentMatchWinMessage = 0;
            // show win messages
            self.showMatchWinMessages();
            // play sound
            if( jsProject.getValue( "on", "sound" ) ){
                var winSound = jsProject.getResource( 'winMatch', 'sound' );
                if( winSound ){
                    winSound.play();
                }
            }
            // done play sound
        };
        self.showMatchWinMessages = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.matchWinMessages[self.currentMatchWinMessage]["messageid"] );
            // set delay timer
            self.timer = setTimeout( function () { self.flickerMatchWinMessage(); }, self.matchWinMessages[self.currentMatchWinMessage]["showTime"] );
        };
        self.flickerMatchWinMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message
            self.alerts.flicker();
            // set timer
            self.timer = setTimeout( function () { self.delayMatchWinMessage(); }, self.matchWinMessages[self.currentMatchWinMessage]["flickerTime"] );
        };
        self.delayMatchWinMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentMatchWinMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentMatchWinMessage < self.matchWinMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showMatchWinMessages(); }, self.matchWinMessages[self.currentMatchWinMessage]["nextDelayTime"] );
            }
            else {
                // set timer for next match
                self.timer = setTimeout( function () { self.nextMatch(); }, self.matchWinMessages[self.currentMatchWinMessage - 1]["nextDelayTime"] );
            }
        };
        self.matchLoose = function() {
            //  reset loose messages
            self.currentMatchLooseMessage = 0;
            // show loose messages
            self.showMatchLooseMessages();
            // play sound
            if( jsProject.getValue( "on", "sound" ) ){
                var lostSound = jsProject.getResource( 'lostMatch', 'sound' );
                if( lostSound ){
                    lostSound.play();
                }
            }
            // done play sound
        };
        self.showMatchLooseMessages = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // show message
            self.alerts.show( self.matchLooseMessages[self.currentMatchLooseMessage]["messageid"] );
            // set delay timer
            self.timer = setTimeout( function () { self.flickerMatchLooseMessage(); }, self.matchLooseMessages[self.currentMatchLooseMessage]["showTime"] );
        };
        self.flickerMatchLooseMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // call for flicker message
            self.alerts.flicker();
            // set timer
            self.timer = setTimeout( function () { self.delayMatchLooseMessage(); }, self.matchLooseMessages[self.currentMatchLooseMessage]["flickerTime"] );
        };
        self.delayMatchLooseMessage = function(){
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // next message
            self.currentMatchLooseMessage++;
            // hide current message
            self.alerts.hide();
            // check if all messages have been displayed
            if( self.currentMatchLooseMessage < self.matchLooseMessages.length ){
                // set timer for next message
                self.timer = setTimeout( function () { self.showMatchLooseMessages(); }, self.matchLooseMessages[self.currentMatchLooseMessage]["nextDelayTime"] );
            }
            else {
                // set timer for next match
                self.timer = setTimeout( function () { self.nextMatch(); }, self.matchLooseMessages[self.currentMatchLooseMessage - 1]["nextDelayTime"] );
            }
        };
        self.nextMatch = function() {
            jsProject.callEvent( "restartGame" );
        };
        self.stopGame = function() {
            self.debug( 'stopGame' );
            // remove timer
            if( self.timer ){
                clearTimeout( self.timer );
                self.timer = null;
            }
            // done remove timer
            
            // hide messages
            self.alerts.hide( );
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
              startGame : function() {
                self.startGame();
            },
              stopGame : function() {
                self.stopGame();
            }
        };
    };
})( gameDevelopment );