/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the background for the application space invaders
 *          contains the stars, world, mars and moon module 
 *          
 * Last revision: 17-05-2015
 * 
 * Status:   code:           ready   
 *           comments:       ready 
 *           memory:         ready     
 *           development:    ready 
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
    gameDevelopment.backgroundModule = function( ) {


     /*
     *  module backgroundModule 
     *   
     *  functions: 
     *      private:
     *          construct       called internal
     *          show            called by the public function 
     *          debug
     *      public:
     *          show 
     */
   
        // private
        var self = this;
        self.MODULE = 'backgroundModule';
        self.debugOn = false;
        self.stars = null;                  // store the starsModule
        self.world = null;                  // store the worldModule
        self.mars = null;                   // store the marsModule
        self.moon = null;                   // store the moonModule

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            //create modules
            self.stars = new gameDevelopment.starsModule();
            self.world = new gameDevelopment.worldModule();
            self.mars = new gameDevelopment.marsModule();
            self.moon = new gameDevelopment.moonModule();
            //done create modules
        };
        self.show = function( visible ) {
            //show modules
            self.stars.show( visible );
            self.world.show( visible );
            self.mars.show( visible );
            self.moon.show( visible );
            //done show the modules
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
            show : function( visible ){
                self.show( visible );
            }
        };
    };
})( gameDevelopment );