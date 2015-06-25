/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this module contains the bunkers for the application space invaders
 *               the bunkers are placed in the bottom part of the middle of the screen.
 *               a fixed nuimber of bunkers is created
 *               the number off bunkers shown is dependent on the project values:
 *               bunkerOffset, bunkerSpacing, bunkerWidth, 
 *               
 * Last revision: 19-05-2015
 * 
 * Status:   code:               ready   
 *           comments:           ready 
 *           memory:             ready
 *           development:        ready      
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
    gameDevelopment.bunkersModule = function( ) {

        /*
         *  module bunkersModule 
         *      
         *  functions: 
         *      private:
         *          construct       called internal
         *          show            called by the public function
         *          layoutChange    called from event subscription
         *          animate         called from event subscription
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      animate             called from gameModule
         *      layoutChange        called from gameLayoutModule
         *          
         */
 
        // private
        var self = this;
        self.MODULE = 'bunkersModule';
        self.debugOn = false;
        self.visible = false;               // visibility
        self.canvasSurface = null;          // canvas surface to draw on
        self.bunkerCount = 10;              // constant
        self.bunkers = [];                  // bunker array
        self.animationDelay = 200;          // ms    
        self.lastAnimationDate = 0;         // save last animation time for delay
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // get canvas surface to draw on
            self.canvasSurface = document.getElementById( 'bunkersDrawLayer' ).getContext( '2d' );

            // create bunker array
            for( var i = 0; i < self.bunkerCount; i++ ){
                var bunker = new gameDevelopment.bunkerModule( i );
                self.bunkers.push( bunker );
            }
            //done create bunker array
            
            // subscribe to events
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            // done subscribe to events
            
        };
        self.show = function( visible ){
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // change the layout according to new dimensions
                self.layoutChange();
                // show the bunkers
                for( var i = 0; i < self.bunkerCount; i++ ){
                    self.bunkers[i].show( visible );
                }
            }
            else {
                for( var i = 0; i < self.bunkerCount; i++ ){
                    self.bunkers[i].show( visible );
                }
                // clear the whole canvas
                self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            }
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            
            // change the layout according to new dimensions for the bunkers
            for( var i = 0; i < self.bunkers.length; i++ ){
                self.bunkers[i].layoutChange();
            }            
            // restart the animation
            self.visible = true;

            // animate without delay
            self.animate( true );
            
        };
        self.animate = function( skipDelay ){
            if( !self.visible ){
                return;
            }
            // check for delay
            var date = new Date();
            if( !skipDelay ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }
            // done delay
            self.lastAnimationDate = date;

            // animate the bunkers
            for( var i = 0; i < self.bunkers.length; i++ ){
                self.bunkers[i].animate();
            }            
            // done animate the bunkers
            
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