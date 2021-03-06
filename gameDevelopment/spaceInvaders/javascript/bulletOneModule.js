/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module contains the basic bullet for the application space invaders
 *          the basic bullet is placed on the top part of the ship on the screen
 *          the basic bullet is animated from the bottom to the top of the screen
 *          the basic bullet calls the jsProject event collisionDetect to check for hits 
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
    gameDevelopment.bulletOneModule = function() {

        /*
         *  module bulletOneModule 
         *      
         *  functions: 
         *      private:
         *          construct               called internal
         *          update                  called by the public function 
         *          layoutChange            called by the public function    
         *          animate                 called by the public function
         *          explode                 called by the animation function
         *          setExplosionRects       called by the hit and update function
         *          hit                     callback for the bulletCollisionDetect event
         *          debug
         *      public:
         *          update
         *          layoutChange
         *          animate
         *          isAlive
         *          
         *  event calls: 
         *      bulletCollisionDetect       consumed by bunkerModule and invaderModule
         */
 
        // private
        var self = this;
        self.MODULE = 'bulletOneModule';
        self.debugOn = false;
        self.canvasSurface = null;                      // store the surface to draw on
        self.position = {  "top" :      0,              // start set by project value shipBulletStartTop controlled by shipModule percentage of background height  
                           "left" :     0,              // start set by project value shipBulletStartLeft controlled by shipModule percentage of background width
                           "height" : 2.5,              // constant percentage of background height
                           "width" :    2 };            // constant percentage of background width
        self.clearPadding = 2;                          // px of background
        self.clearRect = { "top" :      0,              // px, the rect that the image was drawn in  
                           "left" :     0,              // px
                           "height" :   0,              // px
                           "width" :    0 };            // px
        self.drawRect = {  "top" :      0,              // px, the rect that the image is drawn in  
                           "left" :     0,              // px
                           "height" :   0,              // px
                           "width" :    0 };            // px
        self.explosionPosition = { "top" :  -5.45,      // percentage of background height, position relative to position and width of bomb  
                                   "left" :  -3.5,      // percentage of background width, relative to position and width of bomb  
                                   "height" :   10,     // percentage of background height  
                                   "width" :    10 };   // percentage of background width
        self.exploding = false;                         // bool, store if the bomb is exploding
        self.explodingStateCount = 4;                   // number of exploding states
        self.explodingImagePartWidth = 100;             // px width of original image
        self.state = 0;                                 // 0,1 determines witch imagePart is drawn, 0 - explodingStateCount for exploding states  
        self.imagePartWidth = 40;                       // px of original image
        self.step = -0.5;                               // percentage of background height, up movement of the bullet
        self.alive = true;                              // store if bomb is alive ( on screen and no collision )
        self.hitStrength = 1;                           // strength of the hit will be consumed by a colliding bunker or invader
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the start position for the bullet
            self.position["top"] = jsProject.getValue( "shipBulletStartTop", "game" );
            self.position["left"] = jsProject.getValue( "shipBulletStartLeft", "game" );
            // done get the start position for the bullet
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'bulletsDrawLayer' ).getContext( '2d' );
            
        };
        self.update = function() {
            // already hit something
            if( self.exploding ){
                return;
            }
            // done already hit something

            //self.debug( 'update' );
            
            // change the position
            self.position["top"] += self.step;
            // check out of screen
            if( self.position["top"] + self.position["height"] < -1 ){
                self.alive = false;
                return;
            }
            // done check out of screen
            
            // set the new drawRect
            self.drawRect["top"] = ( $( '#background').height() / 100 ) * self.position["top"];

            // collision detection
            // set the rect
            jsProject.setValue( "collisionRect", "game", self.position );
            // set the callback
            jsProject.setValue( "collisionCallback", "game", self.hit );
            // call the event
            jsProject.callEvent( "bulletCollisionDetect" );
            // done collision detection

        };
        self.layoutChange = function() {
            self.debug( 'layoutChange' );
            
            // reset clearRect
            self.clearRect["top"] = 0;
            self.clearRect["left"] = 0;
            self.clearRect["height"] = 0;
            self.clearRect["width"] = 0;
            // done reset clearRect
            
            if( self.exploding ){
                // calculate drawRect for explosion
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.explosionPosition["top"] );
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.explosionPosition["left"] );
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.explosionPosition["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.explosionPosition["width"];
                // done calculate drawRect for  explosion
            }
            else {
                // calculate drawRect for bomb
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * self.position["top"];
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * self.position["left"];
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.position["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.position["width"];
                // done calculate drawRect for bomb
            }
            
        };
        self.clearRect = function() {
            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
        };
        self.animate = function() {
            //self.debug( 'animate' );
            
            if( self.exploding ){
                // go to exploding animation
                self.explode();
                return;
            }

            // change the state
            if( self.state === 0 ){
                self.state = 1;
            }
            else {
                self.state = 0;
            }
            // done change the state
            
            // draw image
            // get the current part according to the state
            var imagePartLeft = self.state * self.imagePartWidth;
            // get the image
            var image = jsProject.getResource( 'bulletBasic', 'image' );
            self.canvasSurface.drawImage( image, imagePartLeft, 0, self.imagePartWidth, image.height,
                                          self.drawRect["left"], self.drawRect["top"], self.drawRect["width"], self.drawRect["height"] );
            // done draw image
            
            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect

        };
        self.hit = function(){
            // already hit something
            if( self.exploding ){
                return 0;
            }
            // done already hit something
             
            // callback of the collision detection
            self.debug( 'hit' );

            // go to exploding mode
            self.state = 0;
            self.exploding = true;

            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            
            // set the drawRect for the explosion
            self.setExplosionRects();
            
            // return strength of the hit
            return self.hitStrength;
        };
        self.setExplosionRects = function(){
            // calculate drawRect for explosion
            self.drawRect["top"] = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.explosionPosition["top"] );
            self.drawRect["left"] = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.explosionPosition["left"] );
            self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.explosionPosition["height"];
            self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.explosionPosition["width"];
            // done calculate drawRect for explosion

            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect
        };
        self.explode = function(){
            if( self.state > self.explodingStateCount ){
                self.alive = false;
                return;
            }
            // get the current part according to the state
            var imagePartLeft = self.state * self.explodingImagePartWidth;
            // hit explosion
            var image = jsProject.getResource( 'bulletExplosionOne', 'image' );
            self.canvasSurface.drawImage( image, imagePartLeft, 0, self.explodingImagePartWidth, image.height,
                                          self.drawRect["left"], self.drawRect["top"], self.drawRect["width"], self.drawRect["height"] );

            self.state++;
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
            update : function(){
                self.update();
            },
            layoutChange : function(){
                self.layoutChange();
            },
            clearRect : function(){
                self.clearRect();
            },
            animate : function(){
                self.animate();
            },
            isAlive : function(){
                return self.alive;
            }
            
        };
    };
})( gameDevelopment );