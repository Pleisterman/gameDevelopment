/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Module: highScoresModule 
 *  
 * Purpose: this module controls reading and writing highscores for the application space invaders
 *          
 *          
 * Last revision: 24-06-2015
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
    gameDevelopment.highScoresModule = function( ) {


        /*
         *  functions: 
         *  
         *      private:
         *          construct               called internal
         *          readScores              called from the construct function 
         *          readScoresCallback      callback for the readScores function
         *          saveScores              called from the event subscription 
         *          saveScoresCallback      callback for the saveScores function
         *          debug
         *      public:
         *          
         *  event subscription: 
         *      saveHighScores              called from the gameResultsModule
         */
  
    
        // private
        var self = this;
        self.MODULE = 'highScoresModule';
        self.debugOn = true;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // subscribe to events
            jsProject.subscribeToEvent( 'saveHighScores', self.saveScores );
            
            // read current scores
            self.readScores();
        };
        self.readScores = function() {
            // create data object
            var data = { 'subject'  : "highScores" };
            // call the ajax event         
            gameDevelopment.post( './spaceInvaders/php/highScores/highScores.php', data, self.readScoresCallback );
        };
        self.readScoresCallback = function( result ){
            // set the jsProject value
            jsProject.setValue( "highScores", "game", result );
        };
        self.saveScores = function() {
            // create data object
            var data = { 'subject'  : "highScores",
                         'action'   : "save",
                         'scores'   : jsProject.getValue( "highScores", "game" ) };
            // call the ajax event         
            gameDevelopment.post( './spaceInvaders/php/highScores/highScores.php', data, self.saveScoresCallback );
        };
        self.saveScoresCallback = function( result ){
            self.debug( "scores saved" );
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