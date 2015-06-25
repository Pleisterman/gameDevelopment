/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module adds the global values for the game to the project for the application space invaders
 *          resets the game values
 *           
 * Last revision: 13-05-2015
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
    gameDevelopment.valuesModule = function( ) {

    /*
     *  module valuesModule 
     *   
     *  functions: 
     *      private:
     *          construct           called internal
     *          addValues           called internal 
     *          resetGameValues     called from the public function
     *          debug
     *     public
     *      resetGameValues     
     */
    
        // private
        var self = this;
        self.MODULE = 'valuesModule';
        self.debugOn = false;
        self.values = [ { "groupName" : "game", "valueName" : "userName", "value" : "" },                   // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "playerRank", "value" : 0 },                  // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "difficulty", "value" : 0 },                  // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "score", "value" : 0 },                       // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "bullets", "value" : 0 },                     // set by the bullets module
                        { "groupName" : "game", "valueName" : "level", "value" : 0 },                       // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "levelCount", "value" : 2 },                  // constant
                        { "groupName" : "game", "valueName" : "lives", "value" : 3 },                       // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "lost", "value" : false },                    // reset in resetGameValues
                        { "groupName" : "game", "valueName" : "maximumLives", "value" : 6 },                // constant
                        { "groupName" : "game", "valueName" : "collisionRect", "value" : null },            // set by bulletModule
                        { "groupName" : "game", "valueName" : "collisionCallback", "value" : null },        // set by bulletModule
                        { "groupName" : "game", "valueName" : "shipBulletStartLeft", "value" : 50 },        // set by shipModule
                        { "groupName" : "game", "valueName" : "shipBulletStartTop", "value" : 90 },         // set by shipModule
                        { "groupName" : "game", "valueName" : "bulletType", "value" : 1 },                  // set by shipModule
                        { "groupName" : "game", "valueName" : "bombType", "value" : 1 },                    // set by invaderModule
                        { "groupName" : "game", "valueName" : "bombStartLeft", "value" : 50 },              // set by invaderModule
                        { "groupName" : "game", "valueName" : "bombStartTop", "value" : 90 },               // set by invaderModule
                        { "groupName" : "game", "valueName" : "invadersBottom", "value" : 0 },              // set by bunkerModule
                        { "groupName" : "game", "valueName" : "highScores", "value" : null },               // set by highScoresModule
                        // level settings set by the levelsModule
                        { "groupName" : "level", "valueName" : "freeResources", "value" : [] },             // set by levelsModule
                        { "groupName" : "level", "valueName" : "addResources", "value" : [] },              // set by levelsModule
                        { "groupName" : "level", "valueName" : "introTextId", "value" : "" },               // set by levelsModule
                        { "groupName" : "level", "valueName" : "levelCompleteTextId", "value" : "" },       // set by levelsModule
                        { "groupName" : "level", "valueName" : "levelLostTextId", "value" : "" },           // set by levelsModule
                        { "groupName" : "level", "valueName" : "shipType", "value" : 1 },                   // set by levelsModule
                        { "groupName" : "level", "valueName" : "maximumBombs", "value" : 30 },              // set by levelsModule
                        { "groupName" : "level", "valueName" : "bombDelay", "value" : 200 },                // set by levelsModule
                        { "groupName" : "level", "valueName" : "minimumBullets", "value" : 0 },             // set by levelsModule
                        { "groupName" : "level", "valueName" : "maximumBullets", "value" : 0 },             // set by levelsModule
                        { "groupName" : "level", "valueName" : "extraBulletScore", "value" : 0 },           // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerOffset", "value" : 0 },               // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerSpacing", "value" : 5 },              // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerWidth", "value" : 10 },               // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerTopStrength", "value" : 5 },          // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerPartStrength", "value" : 3 },         // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerPartSpacing", "value" : 10 },         // set by levelsModule
                        { "groupName" : "level", "valueName" : "bunkerLayers", "value" : 5 },               // set by levelsModule
                        { "groupName" : "level", "valueName" : "invaders", "value" : [] },                  // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersBottom", "value" : 0 },             // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldOffsetTop", "value" : 0 },     // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldOffsetLeft", "value" : 0 },    // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldMinimum", "value" : 0 },       // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldMaximum", "value" : 0 },       // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldWidth", "value" : 0 },         // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersFieldHeight", "value" : 0 },        // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersHorizontalSpacing", "value" : 0 },  // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersVerticalSpacing", "value" : 0 },    // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersUpdateDirection", "value" : 0 },    // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersUpdateDelayMinimum", "value" : 0 }, // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersUpdateDelayMaximum", "value" : 0 }, // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersSideStepMinimum", "value" : 0 },    // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersSideStepMaximum", "value" : 0 },    // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersDownStep", "value" : 0 },           // set by levelsModule
                        { "groupName" : "level", "valueName" : "invadersSideStepSpeedUp", "value" : 0 },    // set by levelsModule
                        // messages
                        { "groupName" : "gameMessages", "valueName" : "id", "value" : "" },               // relay messages with messageModule 
                        { "groupName" : "gameMessages", "valueName" : "fontSize", "value" : 12 },           // font size for meassages
                        { "groupName" : "gameStartMessages", "valueName" : "id", "value" : "" },          // relay messages with messageModule 
                        { "groupName" : "gameStartMessages", "valueName" : "fontSize", "value" : 2.8 },      // font size for meassages
                        // keyPressEvents
                        { "groupName" : "keyPressEvents", "valueName" : "left", "value" : null },           // store the event for left key pressed
                        { "groupName" : "keyPressEvents", "valueName" : "leftUp", "value" : null },         // store the event for left key up
                        { "groupName" : "keyPressEvents", "valueName" : "right", "value" : null },          // store the event for right key pressed
                        { "groupName" : "keyPressEvents", "valueName" : "rightUp", "value" : null },        // store the event for right key up
                        { "groupName" : "keyPressEvents", "valueName" : "spacebar", "value" : null },       // store the event for spacebar pressed
                        { "groupName" : "keyPressEvents", "valueName" : "spacebarUp", "value" : null },     // store the event for spacebar up
                        { "groupName" : "keyPressEvents", "valueName" : "control", "value" : null },        // store the event for control key pressed
                        { "groupName" : "keyPressEvents", "valueName" : "controlUp", "value" : null },      // store the event for control key up
                        // layout for recalling body sizes
                        { "groupName" : "layout", "valueName" : "windowOnResize", "value" : null },         // set by layoutModule, reset on gameExit
                        { "groupName" : "layout", "valueName" : "bodyResetHeight", "value" : 0 },           // set by layoutModule, reset on gameExit
                        { "groupName" : "layout", "valueName" : "bodyResetWidth", "value" : 0 },            // set by layoutModule, reset on gameExit
                        { "groupName" : "layout", "valueName" : "bodyResetMaxWidth", "value" : 0 },         // set by layoutModule, reset on gameExit
                        { "groupName" : "layout", "valueName" : "headerHeight", "value" : 6 },              // constant percentage of backgroundheight
                        { "groupName" : "layout", "valueName" : "fontSize", "value" : 14 },                 // constant px
                        { "groupName" : "layout", "valueName" : "font", "value" : "Garamond" },            // constant string
                        // sound
                        { "groupName" : "sound", "valueName" : "on", "value" : true },                      // set by the intro module sound button and game sound toggle
                        { "groupName" : "sound", "valueName" : "load", "value" : true },                    // set by the intro module sound button
                        { "groupName" : "sound", "valueName" : "validSoundType", "value" : null },          // set before losding assets
                        // images
                        // z-index
                        { "groupName" : "zIndex", "valueName" : "game", "value" : 100 },                    // constant
                        { "groupName" : "zIndex", "valueName" : "loader", "value" : 101 },                  // constant
                        { "groupName" : "zIndex", "valueName" : "messages", "value" : 12 },                 // constant
                        { "groupName" : "zIndex", "valueName" : "header", "value" : 11 },                   // constant
                        { "groupName" : "zIndex", "valueName" : "invaders", "value" : 10 },                 // constant
                        { "groupName" : "zIndex", "valueName" : "bombs", "value" : 9 },                     // constant
                        { "groupName" : "zIndex", "valueName" : "bunkers", "value" : 7 },                   // constant
                        { "groupName" : "zIndex", "valueName" : "player", "value" : 8 },                    // constant
                        { "groupName" : "zIndex", "valueName" : "bullets", "value" : 6 },                   // constant
                        { "groupName" : "zIndex", "valueName" : "world", "value" : 5 },                     // constant
                        { "groupName" : "zIndex", "valueName" : "moon", "value" : 4 },                      // constant
                        { "groupName" : "zIndex", "valueName" : "mars", "value" : 3 },                      // constant
                        { "groupName" : "zIndex", "valueName" : "stars", "value" : 2 },                     // constant
                        { "groupName" : "zIndex", "valueName" : "background", "value" : 1 } ];              // constant        
        self.gameStartValues = [ { "name" : "playerRank", "value" : 0 },                                    // constant
                                 { "name" : "score", "value" : 0 },                                         // constant
                                 { "name" : "level", "value" : 0 },                                         // constant
                                 { "name" : "lives", "value" : 1 },                                         // constant
                                 { "name" : "lost", "value" : false },                                      // constant
                                 { "name" : "bullets", "value" : 0 },                                       // constant
                                 { "name" : "difficulty", "value" : 0 } ];                                  // constant
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            // add values
            self.addValues();
            
            jsProject.subscribeToEvent( 'resetGameValues', self.resetGameValues );
            
        };
        self.addValues = function() {
            self.debug( 'addValues' );
            // add the values for the app to the project
            for( var i = 0; i < self.values.length; i++ ) {
                jsProject.addValue( self.values[i]["valueName"], self.values[i]["groupName"], self.values[i]["value"] );
            }
        };
        self.resetGameValues = function() {
            // reset the game values
            for( var i = 0; i < self.gameStartValues.length; i++ ) {
                jsProject.setValue( self.gameStartValues[i]["name"], "game", self.gameStartValues[i]["value"] );
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