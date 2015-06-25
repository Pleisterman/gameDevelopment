/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the banner for the application space invaders
 *          the banner is positioned in the middle of the top of the screen
 *          it displays the text: space invaders
 *          
 * Last revision: 28-05-2015
 * 
 * Status:   code:               ready   
 *           comments:           ready 
 *           memory:             ready
 *           development:        implement animation features, scrolling text, changing colors.      
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
    gameDevelopment.bannerModule = function( ) {


    /*
     *  module bannerModule 
     *   
     *  functions: 
     *      private:
     *          construct           called internal
     *          show                called by the public function 
     *          layoutChange        called by event subscription
     *          animate             called by event subscription
     *          debug
     *      public:
     *          show 
     *  event subscription: 
     *      layoutChange called from gameLayoutModule
     */
    
        // private
        var self = this;
        self.MODULE = 'bannerModule';
        self.debugOn = false;
        self.visible = false;                   // visibiltity
        self.canvasSurface = null;              // store the surface to draw on
        self.position = {  "top" :    2.4,      // constant percentage of background height
                           "left" :     0,      // constant percentage of background width
                           "height" :   0,      // constant percentage of background height
                           "width" :   12 };    // constant percentage of background width
        self.clearPadding = 2;                  // px of background
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRect = {  "top" :      0,      // px, the rect that the image is drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.animationDelay = 20000;            // ms not active yet
        self.lastAnimationDate = 0;             // store the last animation time
        self.state = 0;                         // for later use
        self.font = "";                         // store the font set by the jsProject value font 
        self.fontSize = 12;                     // store the font size set by the jsProject value fontSize 
        self.text = "Space Invaders";           // static text
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the height
            self.position["height"] = jsProject.getValue( "headerHeight", "layout" );
            // get the font and size 
            self.font = jsProject.getValue( "font", "layout" );
            self.fontSize = jsProject.getValue( "fontSize", "layout" );
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'headerDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            // done subscribe to events
            
        };
        self.show = function( visible ){
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // clear the clearRect
                self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            }
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'layoutChange' );
            
            // calculate the draw rect
            self.drawRect["top"] = ( ( $( '#background' ).height() / 100 ) * self.position["top"] ) + self.fontSize;
            self.drawRect["height"] = self.fontSize;

            self.drawRect["height"] = self.fontSize;
            self.drawRect["top"] = ( ( $( '#background' ).height() / 100 ) * self.position["top"] ) + ( self.drawRect["height"] / 2 );
            
            // calculate the text width
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            var textWidth = self.canvasSurface.measureText( self.text ).width;
            // set width to text width
            self.drawRect["width"] = textWidth ;
            // set left relative to text width
            self.drawRect["left"] = ( $( '#background' ).width() - self.drawRect["width"] ) / 2;
            
            // animate without delay
            self.animate( true );

        };
        self.animate = function( skipDelay ){
            if( !self.visible ) {
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

            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  

            // get the font size and font
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            self.canvasSurface.fillStyle = 'yellow';
            self.canvasSurface.fillText( self.text, self.drawRect["left"], self.drawRect["top"] );

            // clearRect = drawRect
            self.clearRect["top"] = ( self.drawRect["top"] - ( self.drawRect["height"] ) ) - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect
            
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
            show : function( visible ) {
                self.show( visible );
            }
        };
    };
})( gameDevelopment );