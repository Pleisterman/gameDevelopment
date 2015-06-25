/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the score for the application space invaders
 *          the score is positioned on the left of the top of the screen 
 *          
 * Last revision: 16-05-2015
 * 
 * Status:   code:               ready
 *           comments:           ready
 *           memory:             ready
 *           development:        implement more colors, animations
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
    gameDevelopment.scoreModule = function( ) {


        /*
         *  module scoreModule 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          lifeLost            called from event subscription
         *          layoutChange        called from event subscription
         *          animate             called from event subscription
         *          pad                 called internal
         *          debug
         *      public:
         *          show 
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         *      scoreChange             called from invaders
         *      lifeLost                called from a shipModule
         */
    
        // private
        var self = this;
        self.MODULE = 'scoreModule';
        self.debugOn = false;
        self.visible = false;                   // visibiltity
        self.canvasSurface = null;              // store the surface to draw on
        self.position = {  "top" :    1.4,      // constant percentage of background height
                           "left" :  -1.5,      // constant percentage of background width
                           "height" :   0,      // constant percentage of background height
                           "width" :    0 };    // constant percentage of background width
        self.clearPadding = 20;                 // px of background
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRect = { "top" :       0,      // px, the rect that the image is drawn in
                          "left" :      0,      // px
                          "height" :    0,      // px
                          "width" :     0 };    // px
        self.animationDelay = 200;             // ms
        self.lastAnimationDate = 0;             // store last animation time
        self.font = "";                         // store the font set by the jsProject value font 
        self.fontSize = 12;                     // store the font size set by the jsProject value fontSize 
        self.paddingCount = 7;                  // max number of zero's to pad on the score 
        self.extraBulletScore = 0;
        self.lastScore = 0;
        self.extraBulletNeededScore = 1000;
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
            jsProject.subscribeToEvent( 'scoreChange', self.animate );
            jsProject.subscribeToEvent( 'lifeLost', self.lifeLost );
            // done subscribe to events
            
        };
        self.show = function( visible ){
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                self.extraBulletNeededScore = jsProject.getValue( "extraBulletScore", "level" );
                self.lastScore = jsProject.getValue( "score", "game" );
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // clear the clearRect
                self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            }
        };
        self.lifeLost = function( ){
            // reset the extrabullet score
            self.extraBulletScore = 0;
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'layoutChange' );


            // calculate the draw rect
            self.drawRect["top"] = ( $( '#background' ).height() / 100 ) * self.position["top"] + self.fontSize;
            self.drawRect["height"] = ( ( $( '#background' ).height() / 100 ) * self.position["height"] );
            
            // calculate the text width
            var score = "Score: " + self.pad( jsProject.getValue( "score", "game" ), self.paddingCount );
            var offsetLeft = ( $( '#background' ).width() / 100 ) * self.position["left"];
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            var textWidth = self.canvasSurface.measureText( score ).width;
            // set width to text width
            self.drawRect["width"] = textWidth ;
            // set left relative to text width
            self.drawRect["left"] = ( $( '#background' ).width() ) + offsetLeft;
            
            
            // animate without delay
            self.animate( true );
            
        };
        self.animate = function( skipDelay ){
            // check for delay
            var date = new Date();
            if( !skipDelay ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }
            // done delay
            self.lastAnimationDate = date;
            
            
            // calculate if score provides extra bulllet 
            if( self.lastScore !== jsProject.getValue( "score", "game" ) ){
                // get the score difference
                self.extraBulletScore += jsProject.getValue( "score", "game" ) - self.lastScore; 
                // lastscore = score 
                self.lastScore = jsProject.getValue( "score", "game" );
                if( self.extraBulletScore > self.extraBulletNeededScore ){
                    // extra bullet score reached reset extra bullet score
                    self.extraBulletScore = 0; 
                    self.debug( 'addbullet' );
                    // call the event
                    jsProject.callEvent( "addBullet" );
                }
            }
            // done calculate if score provides extra bulllet 

            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            
            // get the font size and font
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            self.canvasSurface.fillStyle = 'white';
            // add padding zeros to the score
            var score = "Score:" + self.pad( jsProject.getValue( "score", "game" ), self.paddingCount );
            var textWidth = self.canvasSurface.measureText( score ).width;
            self.canvasSurface.fillText( score, self.drawRect["left"] - textWidth, self.drawRect["top"] );

            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = ( self.drawRect["left"] - textWidth ) - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = textWidth + ( self.clearPadding * 2 );
            // done clearRect = drawRect
        
        
        };
        self.pad = function( string, padCount ) {
            // add padding to a string
            string = string.toString();
            return string.length < padCount ? self.pad( "0" + string, padCount ) : string;
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