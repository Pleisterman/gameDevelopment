/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the mars for the application space invaders
 *          mars is animated along the bottom middle of the screen 
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
 *  Copyright (C) 2015  Pleisterman
 * 
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 * 
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

( function( gameDevelopment ){
    gameDevelopment.marsModule = function() {


        /*
         *  module marsModule 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          layoutChange        called by the event subscription
         *          animate             called by the event subscription
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         *      animate                 called from gameModule
         */
    
        // private
        var self = this;
        self.MODULE = 'marsModule';
        self.debugOn = false;
        self.visible = false;                   // visibility
        self.canvasSurface = null;              // canvas surface to draw on
        self.position = {  "top" :     43,      // constant percentage of background height
                           "left" :  30.0,      // calculated image is placed in middle of the background
                           "height" :   9,      // constant percentage of background height
                           "width" :   65 };    // constant percentage of background width
        self.curveHeight = 9.2;                 // percentage of background height that the mars will rise up in the middle
        self.curveOffset = -15;                 // percentage of background height that the mars will rise up in the middle
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRect = { "top" :       0,      // px, the rect that the image is drawn in  
                          "left" :      0,      // px
                          "height" :    0,      // px
                          "width" :     0 };    // px
        self.globalAlpha = 0.7;                 // alpha with wicj the image is drawn
        self.animationStep = -0.02;             // space that the image will move per animation step 
        self.animationDelay = 500;             // ms
        self.lastAnimationDate = 0;             // save last animation time for delay
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'marsDrawLayer' ).getContext( '2d' );
            
            // subscribe to events
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            // done subscribe to events

        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ) {
                self.debug( 'show' );
                
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // clear the whole canvas
                self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );
            }
        };
        self.layoutChange = function( ) {
            if( !self.visible ) {
                return;
            }
            self.debug( 'layoutChange' );
            
            // calculate the draw rect
            self.drawRect["top"] = ( ( $( '#background' ).height() ) / 100 ) * self.position["top"];
            self.drawRect["left"] = ( ( $( '#background' ).width() ) / 100 ) * self.position["left"];
            self.drawRect["height"] = ( $( '#background' ).height() / 100 ) * self.position["height"];
            self.drawRect["width"] =  self.drawRect["height"];
            // done calculate the draw rect
            
            // animate without delay
            self.animate( true );
        };
        self.animate = function( skipDelay ){
            if( !self.visible ) {
                return;
            }
            // check for delay
            var date = new Date();
            if( !skipDelay  ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }
            // done delay
            self.lastAnimationDate = date;

            // clear the canvas surface
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );

            // add movement
            self.position["left"] += self.animationStep;
            // reset to first position
            if( self.position["left"] < -20 ){
                self.position["left"] = 120;
            }
            self.drawRect["left"] = ( ( $( '#background' ).width() ) / 100 ) * self.position["left"];
            // done add the movement
            
            // calcultate the curve    
            var curveHeight = ( $( '#background' ).height() / 100 ) * self.curveHeight;
            curveHeight = ( $( '#background' ).height() / 100 ) * self.curveHeight;
            // add the curve
            var top = self.drawRect["top"];
            top += Math.abs( Math.sin( ( ( 50 + self.curveOffset ) - self.position["left"] ) / 70 ) ) * curveHeight;
            
            // get the image
            var image = jsProject.getResource( 'mars', 'image' );
            // draw the image
            self.canvasSurface.drawImage( image, 0, 0, image.width, image.height, 
                                          self.drawRect["left"], top, 
                                          self.drawRect["width"], self.drawRect["height"] );
            
            // set new clearRect
            self.clearRect["top"] = top;
            self.clearRect["left"] = self.drawRect["left"];
            self.clearRect["height"] = self.drawRect["height"];
            self.clearRect["width"] = self.drawRect["width"];
            // done set new clearRect
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