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
 * Last revision: 05-05-2015
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
     *  purpose:
     *   this module adds the global values for the game to the project for the application space invaders
     *   resets the game values
     *   
     *  functions: 
     *      private:
     *          construct
     *          addValues 
     *          resetGameValues     called from the public function
     *          debug
     *     public
     *      resetGameValues     
     */
    
        // private
        var self = this;
        self.MODULE = 'valuesModule';
        self.debugOn = true;
        self.values = [ // z-index
                        { "groupName" : "zIndex", "valueName" : "test", "value" : 200 },
                        { "groupName" : "zIndex", "valueName" : "canvas", "value" : 2 },
                        { "groupName" : "zIndex", "valueName" : "background", "value" : 1 } ];     // constant        
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            // add values
            self.addValues();
        };
        self.addValues = function() {
            self.debug( 'addValues' );
            // add the values for the app to the project
            for( var i = 0; i < self.values.length; i++ ) {
                jsProject.addValue( self.values[i]["valueName"], self.values[i]["groupName"], self.values[i]["value"] );
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
            resetGameValues : function(){
                self.resetGameValues();
            }
        };
    };
})( gameDevelopment );