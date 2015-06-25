/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the lives for the application space invaders
 *          the lives draws the number of lives on the right top side of the screen
 *          every live is represented by a ship on the screen drawing from top to bottom
 *          
 * Last revision: 17-05-2015
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       game over call event, adding lives
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
    gameDevelopment.livesModule = function() {


        /*
         *  module livesModule 
         *   
         *  functions: 
         *      private:
         *          construct       called internal
         *          show            called by the public function
         *          layoutChange    called from event subscription
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      layoutChange        called from gameLayoutModule
         *      lifeLost            called from shipModule
         */
  
    
        // private
        var self = this;
        self.MODULE = 'livesModule';
        self.debugOn = false;
        self.visible = false;                   // visibility
        self.canvasSurface = null;              // canvas surface to draw on
        self.imageSpacing = 1;                  // percentage of background height 
        self.imagePartWidth = 70;               // px of the original image
        self.position = {  "top" :      0,      // percentage, set by the jsProject value headerHeight, top aligned to bottom header
                           "left" :  99.9,      // calculated image is placed on right side of the background with margin
                           "height" :  60,      // constant percentage of background height
                           "width" :    4.5 };    // constant percentage of background width
        self.clearPadding = 2;                  // px of background
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRects = [];                    // array storing the drawing rects
        self.clearPadding = 2;                  // px of background
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create the drawRects
            var maximumLives = jsProject.getValue( "maximumLives", "game" );
            for( var i = 0; i < maximumLives; i++ ){
                var drawRect = { "top" :    0,
                                 "left" :   0,
                                 "width" :  0,
                                 "height" : 0 };
                // add the rect to the array
                self.drawRects.push( drawRect );         
            }
            // done create the drawRects
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'playerDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'lifeLost', self.lifeLost );
            // done subscribe to events
            
        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // clear the whole canvas
                self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            }
        };
        self.layoutChange = function( ) {
            self.debug( 'layoutChange' );

            // calculate the drawing dimensions per life
            var maximumLives = jsProject.getValue( "maximumLives", "game" );
            var top = ( $( "#background" ).height() / 100 ) * jsProject.getValue( "headerHeight", "layout" );
            var height = ( $( "#background" ).height() / 100 ) * self.position["height"];
            var imageSpacing = ( height / 100 ) * self.imageSpacing; 
            var totalSpacing = ( maximumLives ) * imageSpacing; 
            var totalImagesHeight =  height - totalSpacing; 
            var imageHeight = parseInt( totalImagesHeight / maximumLives );
            var imageWidth = ( $( "#background" ).width() / 100 ) * self.position["width"];
            var left = ( ( $( "#background" ).width() / 100 ) * self.position["left"] ) - imageWidth;
            // done calculate the drawing dimensions per life
            
            // set new clearRect
            self.clearRect["top"] = top - self.clearPadding;
            self.clearRect["left"] = left - self.clearPadding;
            self.clearRect["width"] = imageWidth + ( 2 *  self.clearPadding );
            self.clearRect["height"] = height + ( 2 *  self.clearPadding );
            // done set new clearRect
            
            // set the drawing rects
            top += imageSpacing;
            for( var i = 0; i < maximumLives; i++ ){
                self.drawRects[i]["top"] = top;
                self.drawRects[i]["left"] = left;
                self.drawRects[i]["width"] = imageWidth;
                self.drawRects[i]["height"] = imageHeight;
                top += imageHeight + imageSpacing;        
            }
            // done set the drawing rects
            
            self.draw( );
        };
        self.draw = function( ){
            
            // clear the canvas surface
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], 
                                          self.clearRect["width"], self.clearRect["height"] );

            // get the image
            var image = jsProject.getResource( 'shipOne', 'image' );
            // get the current live count
            var lives = jsProject.getValue( "lives", "game" );
            for( var i = 0; i < self.drawRects.length; i++ ){
                if( lives > i ){
                    // draw the images
                    self.canvasSurface.drawImage( image, 0, 0, self.imagePartWidth, image.height, 
                                                  self.drawRects[i]["left"], self.drawRects[i]["top"], 
                                                  self.drawRects[i]["width"], self.drawRects[i]["height"] );
                }
            }
        };
        self.lifeLost = function( ){
            jsProject.setValue( "lives", "game", jsProject.getValue( "lives", "game" ) - 1 );
            
            var lives = jsProject.getValue( "lives", "game" );
            // game over when 0!
            if( lives > 0 ){
                jsProject.callEvent( "newShip" );
            }
            else {
                jsProject.callEvent( "allLivesLost" );
            }
            
            self.draw();
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