/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the intro and start button for the application space invaders. 
 * 
 * Last revision: 17-05-2015
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
     *  module main 
     *   
     *  functions: 
     *      private:
     *          construct   called internal
     *          showGame    called from the introModule, constructs the game module and show the game screen
     *          debug
     */
    
        // private
        var self = this;
        self.MODULE = 'main';
        self.debugOn = false;
        self.values = null;
        self.intro = null;
        self.game = null;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create the global values for the game
            self.values = new gameDevelopment.valuesModule();
            // load and display the intro with a callback to the startgame function
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