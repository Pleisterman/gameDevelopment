/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module contains the exitButton, banner and score for the header of the application space invaders
 * 
 * Last revision: 17-05-2015
 * 
 * Status:   code:               ready   
 *           comments:           ready 
 *           memory:             ready
 *           development:        ready.
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
    gameDevelopment.gameHeaderModule = function( exitCallback  ) {


    /*
     *  module gameHeaderModule 
     *   
     *  functions: 
     *      private:
     *          construct       called internal
     *          show            called by public fucntion
     *          exit            callback for the exitButton
     *          debug
     *      public:
     *          show 
     */
    
        // private
        var self = this;
        self.MODULE = 'gameHeaderModule';
        self.debugOn = false;
        self.exitCallback = exitCallback;       // store the callback
        self.exitButton = null;                 // store the exitButtonModule
        self.banner = null;                     // store the bannerModule
        self.score = null;                      // store the scoreModule
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // create modules
            self.exitButton = new gameDevelopment.exitButtonModule( self.exit );
            self.banner = new gameDevelopment.bannerModule(  );
            self.score = new gameDevelopment.scoreModule();
            // done create modules
            
        };
        self.show = function( visible ){
            if( visible ){
                self.debug( 'show' );
            }
            // show modules
            self.exitButton.show( visible );
            self.banner.show( visible );
            self.score.show( visible );
            // done show modules
            
        };
        self.showExit = function( ){
            self.exitButton.show( true );
        };
        self.exit = function(){
            self.debug( 'exit' );
            // call provided callback
            if( self.exitCallback ){
                self.exitCallback();
            }
            else {
                self.debug( "warning exit callback not provided." );
            } 
            // done call provided callback
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
            },
            showExit : function(){
                self.showExit();
            }
        };
    };
})( gameDevelopment );