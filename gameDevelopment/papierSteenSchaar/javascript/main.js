/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this is the main file for the game Rock-Paper-Scissors. 
 *          it set the project values for the game
 *          it loads the intro
 *          it starts the game after the startbutton of the intro module is pressed.
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
    gameDevelopment.main = function( ) {


    /*
     *  module introModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          click                   called by html start button, calls the provided callbak
     *          soundButtonClick        called by the soundbutton
     *          translate               called by the event subscription languageChange
     *          translateCallback       calback for translate function
     *          debug
     *          
     *  event subscription: 
     *      languageChange              called from languageModule
     */

        // private
        var self = this;
        self.MODULE = 'main';
        self.debugOn = false;
        self.intro = null;                                                                              // store the intro module
        self.game = null;                                                                               // store the game module
                    
        self.values = [ { "groupName" : "sound", "valueName" : "load", "value" : true },                // load sound?
                        { "groupName" : "sound", "valueName" : "on", "value" : true },                  // sound on / off
                        { "groupName" : "sound", "valueName" : "validSoundType", "value" : null },      // valid sound extension mp3, ogg    
                        { "groupName" : "scores", "valueName" : "player", "value" : 0 },                // store the score
                        { "groupName" : "scores", "valueName" : "computer", "value" : 0 },              // store the score
                        { "groupName" : "scores", "valueName" : "bestOf", "value" : 0 },                // store best off selection
                        { "groupName" : "scores", "valueName" : "setsPlayed", "value" : 0 },           // store the games playes
                        { "groupName" : "game", "valueName" : "speed", "value" : 0 },                   // store speed selection
                        { "groupName" : "game", "valueName" : "playerHand", "value" : 0 },              // store player hand selection
                        { "groupName" : "game", "valueName" : "previousPlayerHand", "value" : null },   // store player previous hand selection
                        { "groupName" : "game", "valueName" : "computerHand", "value" : 0 },            // store computer hand selection
                        { "groupName" : "game", "valueName" : "previousComputerHand", "value" : null }, // store computer previous hand selection
                        { "groupName" : "game", "valueName" : "strategy", "value" : 0 },                // store strategy selection
                        // z indexes
                        { "groupName" : "zIndex", "valueName" : "loader", "value" : 200 },              // constant 
                        { "groupName" : "zIndex", "valueName" : "playingfield", "value" : 60 },         // constant 
                        { "groupName" : "zIndex", "valueName" : "computer", "value" : 69 },             // constant 
                        { "groupName" : "zIndex", "valueName" : "playerHand", "value" : 69 },           // constant 
                        { "groupName" : "zIndex", "valueName" : "scores", "value" : 70 },               // constant     
                        { "groupName" : "zIndex", "valueName" : "playerButtons", "value" : 69 },        // constant 
                        { "groupName" : "zIndex", "valueName" : "gameControls", "value" : 70 },         // constant 
                        { "groupName" : "zIndex", "valueName" : "playControl", "value" : 71 },          // constant 
                        { "groupName" : "zIndex", "valueName" : "alerts", "value" : 72 },               // constant 
                        { "groupName" : "zIndex", "valueName" : "strategies", "value" : 100 },          // constant 
                        { "groupName" : "zIndex", "valueName" : "gameSets", "value" : 100 } ];         // constant   
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            
            // add the values for the app
            for( var i = 0; i < self.values.length; i++ ) {
                jsProject.addValue( self.values[i]["valueName"], self.values[i]["groupName"], self.values[i]["value"] );
            }
            // done add the values for the app

            // add a resize function
            window.onresize = function( ) {
                // call the scene change event
                jsProject.callEvent( 'sceneChange' );
            };
            
            // show the intro
            self.intro = new gameDevelopment.introModule( self.showGame );
        };
        self.showGame = function(){
            self.debug( 'startgame' );
            // create gameModule
            if( !self.game ){
                self.game = new gameDevelopment.gameModule();
            }
            //done  create gameModule
            
            // show the game
            self.game.show();
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