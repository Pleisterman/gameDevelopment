/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this module controls levels for the application space invaders
*          the start function will set the values for the level in the global project values
*          according to the level values of the global project value game level
*          
*          
* Last revision: 23-06-2015
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
    gameDevelopment.levelsModule = function( ) {

    /*
     *  module levelsModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          start                   called by the public function
     *          chooseRandomLevel       called by the public function
     *          setValues               called internal
     *          debug
     *      public:
     *          start
     *          chooseRandomLevel 
     */
   
        // private
        var self = this;
        self.MODULE = 'levelsModule';
        self.debugOn = false;
        // values for the levels
                        // level 0
        self.levels = [ { "levelType" : "normal" ,                                  // level 0 only used for intro
                          "bunkerOffset" : 3.5,                                     // percentage of background, left offset for the first bunker
                          "bunkerSpacing" : 4,                                      // percentage of background,spacing between bunkers
                          "bunkerWidth" : 10,                                       // percentage of background,width of each bunker
                          "bunkerTopStrength" : 6,                                  // hit strength of the top part of the bunkers
                          "bunkerPartStrength" : 4,                                 // hit strength of the parts of the bunkers
                          "bunkerPartSpacing" : 34.1,                               // percentage of background,spacing between the parts of the bunker
                          "bunkerLayers" : 3,                                       // number of part layers
                          // invaderRows place holder for starting ranks 
                                   //colum 1  2  3  4  5  6  7  8  9  10 11 12    
                          "invaders" : [ [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0 ],    // invaders array     
                                         [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] ], 
                          "invadersFieldOffsetTop" : 7,                             // percentage of background, offset of the invader field at start
                          "invadersFieldMinimum" : 1,                               // percentage of background, maximum left that the invader field can go
                          "invadersFieldMaximum" : 99,                              // percentage of background, maximum right that the invader field can go
                          "invadersFieldOffsetLeft" : 51,                           // percentage of background, initial offset for the invader field
                          "invadersFieldWidth" : 48,                                // percentage of background, width of the invader field
                          "invadersFieldHeight" : 44,                               // percentage of background, height of the invader field
                          "invadersHorizontalSpacing" : 0.6,                        // percentage of background, spacing between each invader
                          "invadersVerticalSpacing" : 0.3,                          // percentage of background, spacing between each invader
                          "invadersUpdateDelayMinimum" : 10,                        // fastest the invaders can move combined with sideStepMaximum and minimum
                          "invadersUpdateDelayMaximum" : 700,                       // start speed of the invaders combined with sideStepMaximum and minimum
                          "invadersUpdateDirection" : -1,                           // direction at start -1 = left, +1 = right 
                          "invadersSideStepMinimum" : 0.9,                          // percentage of background, fastest move speed  combined with update delay
                          "invadersSideStepMaximum" : 2.1,                          // percentage of background, slowest moe speed combined with update delay
                          "invadersDownStep" : 2.5,                                 // percentage of background, downstep size 
                          "maximumBombs" : 9,                                       // maximum bombs that can be alive at one time
                          "bombDelay" : 40,                                         // delay between bomb releases
                          "shipType" : 1,                                           // type of ship used
                          "maximumBullets" : 12,                                    // maximum upgrade for bullets
                          "extraBulletScore" : 1500,                                // score needed to get an upgrade
                          "minimumBullets" : 7 },                                   // initial number of bullets at ship creation
                                                                                    // done level 0
                                                                                     
                                                                                    // level 1
                        { "levelType" : "normal" ,                                  // type of the level, not used
                          "introTextId" : "levelOneIntro",                          // id of the text to display when the levelis started
                          "levelCompleteTextId" : "levelOneComplete",               // id of the text to display when the lavel is complete
                          "levelLostTextId" : "levelOneLost",                       // id of the text to display when the level is lost
                          "freeResources" : [],                                     // resources taht can be freed when the level is started
                          "addResources" : [],                                      // resources that need loading before starting the level
                          "bunkerOffset" : 3.5,                                     // percentage of background, left offset for the first bunker
                          "bunkerSpacing" : 4,                                      // percentage of background,spacing between bunkers
                          "bunkerWidth" : 10,                                       // percentage of background,width of each bunker
                          "bunkerTopStrength" : 6,                                  // hit strength of the top part of the bunkers
                          "bunkerPartStrength" : 4,                                 // hit strength of the parts of the bunkers
                          "bunkerPartSpacing" : 34.1,                               // percentage of background,spacing between the parts of the bunker
                          "bunkerLayers" : 3,                                       // number of part layers            
                          // invaderRows place holder for starting ranks 
                                   //colum 1  2  3  4  5  6  7  8  9  10 11 12    
                          "invaders" : [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],    // invaders array
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] ], 
                          "invadersFieldOffsetTop" : 7,                             // percentage of background, offset of the invader field at start
                          "invadersFieldMinimum" : 1,                               // percentage of background, maximum left that the invader field can go
                          "invadersFieldMaximum" : 99,                              // percentage of background, maximum right that the invader field can go
                          "invadersFieldOffsetLeft" : 51,                           // percentage of background, initial offset for the invader field
                          "invadersFieldWidth" : 48,                                // percentage of background, width of the invader field
                          "invadersFieldHeight" : 44,                               // percentage of background, height of the invader field
                          "invadersHorizontalSpacing" : 0.6,                        // percentage of background, spacing between each invader
                          "invadersVerticalSpacing" : 0.3,                          // percentage of background, spacing between each invader
                          "invadersUpdateDelayMinimum" : 10,                        // fastest the invaders can move combined with sideStepMaximum and minimum
                          "invadersUpdateDelayMaximum" : 700,                       // start speed of the invaders combined with sideStepMaximum and minimum
                          "invadersUpdateDirection" : -1,                           // direction at start -1 = left, +1 = right 
                          "invadersSideStepMinimum" : 0.9,                          // percentage of background, fastest move speed  combined with update delay
                          "invadersSideStepMaximum" : 2.1,                          // percentage of background, slowest moe speed combined with update delay
                          "invadersDownStep" : 2.1,                                 // percentage of background, downstep size 
                                                                                    // difficulty specific values
                          "difficulty" : [ { "bombDelay" : 100,                     // delay between bomb releases
                                             "maximumBombs" : 4 },                  // maximum bombs that can be alive at one time
                                           { "bombDelay" : 40,                      // delay between bomb releases
                                             "maximumBombs" : 8 },                  // maximum bombs that can be alive at one time
                                           { "bombDelay" : 30,                      // delay between bomb releases
                                             "maximumBombs" : 12 } ],               // maximum bombs that can be alive at one time              
                          "shipType" : 1,                                           // type of ship used
                          "maximumBullets" : 4,                                     // maximum upgrade for bullets
                          "extraBulletScore" : 3000,                                // score needed to get an upgrade
                          "minimumBullets" : 3 },                                   // initial number of bullets at ship creation
                                                                                    // done level 1
                                                                                    
                                                                                    // level 2
                        { "levelType" : "normal" ,                                  // type of the level, not used
                          "introTextId" : "levelTwoIntro",                          // id of the text to display when the levelis started
                          "levelCompleteTextId" : "levelTwoComplete",               // id of the text to display when the lavel is complete
                          "levelLostTextId" : "levelTwoLost",                       // id of the text to display when the level is lost
                          "freeResources" : [],                                     // resources taht can be freed when the level is started
                          "addResources" : [],                                      // resources that need loading before starting the level
                          "bunkerOffset" : 3.5,                                     // percentage of background, left offset for the first bunker
                          "bunkerSpacing" : 4,                                      // percentage of background,spacing between bunkers
                          "bunkerWidth" : 10,                                       // percentage of background,width of each bunker
                          "bunkerTopStrength" : 6,                                  // hit strength of the top part of the bunkers
                          "bunkerPartStrength" : 4,                                 // hit strength of the parts of the bunkers
                          "bunkerPartSpacing" : 34.1,                               // percentage of background,spacing between the parts of the bunker
                          "bunkerLayers" : 3,                                       // number of part layers        
                          // invaderRows place holder for starting ranks 
                                   //colum 1  2  3  4  5  6  7  8  9  10 11 12    
                          "invaders" : [ [ 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0 ],    // invaders array
                                         [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                                         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] ], 
                          "invadersFieldOffsetTop" : 7,                             // percentage of background, offset of the invader field at start
                          "invadersFieldMinimum" : 1,                               // percentage of background, maximum left that the invader field can go
                          "invadersFieldMaximum" : 99,                              // percentage of background, maximum right that the invader field can go
                          "invadersFieldOffsetLeft" : 51,                           // percentage of background, initial offset for the invader field
                          "invadersFieldWidth" : 48,                                // percentage of background, width of the invader field
                          "invadersFieldHeight" : 44,                               // percentage of background, height of the invader field
                          "invadersHorizontalSpacing" : 0.6,                        // percentage of background, spacing between each invader
                          "invadersVerticalSpacing" : 0.3,                          // percentage of background, spacing between each invader
                          "invadersUpdateDelayMinimum" : 10,                        // fastest the invaders can move combined with sideStepMaximum and minimum    
                          "invadersUpdateDelayMaximum" : 700,                       // start speed of the invaders combined with sideStepMaximum and minimum
                          "invadersUpdateDirection" : -1,                           // direction at start -1 = left, +1 = right 
                          "invadersSideStepMinimum" : 0.9,                          // percentage of background, fastest move speed  combined with update delay
                          "invadersSideStepMaximum" : 2.1,                          // percentage of background, slowest moe speed combined with update delay
                          "invadersDownStep" : 2.1,                                 // percentage of background, downstep size
                                                                                    // difficulty specific values
                          "difficulty" : [ { "bombDelay" : 100,                     // delay between bomb releases
                                             "maximumBombs" : 4 },                  // maximum bombs that can be alive at one time
                                           { "bombDelay" : 40,                      // delay between bomb releases     
                                             "maximumBombs" : 8 },                  // maximum bombs that can be alive at one time
                                           { "bombDelay" : 30,                      // delay between bomb releases
                                             "maximumBombs" : 12 } ],               // maximum bombs that can be alive at one time              
                          "shipType" : 1,                                           // type of ship used
                          "maximumBullets" : 5,                                     // maximum upgrade for bullets
                          "extraBulletScore" : 3000,                                // score needed to get an upgrade
                          "minimumBullets" : 4 } ];                                 // initial number of bullets at ship creation
                                                                                    // done level 2
                            
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // subscribe to events
            jsProject.subscribeToEvent( 'setLevelValues', self.setValues );
            // done subscribe to events

        };
        self.setValues = function(){
            self.debug( 'setValues' );
            // get the current level
            var level = jsProject.getValue( "level", "game" );
            // write the level values to the global project values
            Object.keys( self.levels[level] ).forEach( function( key ){
                self.debug( 'setValue: ' + key + ' value: ' + self.levels[level][key] );
                if( key === "difficulty" ){
                    var difficultyLevel = jsProject.getValue( "difficulty", "game" );
                    Object.keys( self.levels[level][key][difficultyLevel] ).forEach( function( difficultyKey ){
                        jsProject.setValue( difficultyKey, 'level', self.levels[level][key][difficultyLevel][difficultyKey] );
                    });
                }
                else {
                    jsProject.setValue( key, 'level', self.levels[level][key] );
                }
            });
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