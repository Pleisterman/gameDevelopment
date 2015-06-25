/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this module controls the drawing of the ship for the application space invaders
*          the ship is animated along the bottom of the screen 
*          the ship is controlled by the gameIntroModule in autoplay
*          the ship is controlled by the keyboard throug the project events;
*               rightKeyPressed -> move right
*               leftKeyPressed -> move left
*               keyUp -> stop
*               
* Last revision: 29-05-2015
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
    gameDevelopment.shipOneModule = function( zindex ) {


        /*
         *  module shipOneModule 
         *    
         * functions: 
         *      private:
         *          construct                   called internal
         *          show                        called by the public function
         *          layoutChange                called from event subscription
         *          left                        called from event subscription
         *          right                       called from event subscription
         *          stop                        called from event subscription
         *          animate                     called from event subscription
         *          start                       called by the animation function
         *          setStartRects               called by the show function
         *          explode                     called by the animation function
         *          setExplosionRects           called by the hit and update function
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      layoutChange                    called from gameLayoutModule
         *      animate                         called from gameModule
         *      bombCollisionDetect             called from s bomb moduke
         *      
         */
    
        // private
        var self = this;
        self.MODULE = 'shipOneModule';
        self.debugOn = false;               
        self.ship = null;                               // store the shipOneModule
        self.visible = false;                           // visibility
        self.canvasSurface = null;                      // canvas surface to draw on
        self.stopImageStates = [ 0, 1 ];                // states for stop animation
        self.leftImageStates = [ 2, 3 ];                // states for moving left animation
        self.rightImageStates = [ 4, 5 ];               // states for moving right animation
        self.moveState = "stop";                        // store the move state stop, left, right 
        self.imageState = 0;                            // store the image state,  
        self.explosionAnimationCount = 0;               // number of exploding states
        self.explosionMaximumAnimationCount = 40;      // number of explosion animations
        self.explosionCount = 10;                       // number of explosions to create
        self.explosions = [];                           // array with the explosion objects
        self.exploding = false;                         // store if the ship is exploding
        self.waiting = false;                           // wait for nwew life
        self.startingStates = [ 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 3, 1, 2, 3, 
                                0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 3, 1, 2, 3, 
                                0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 3, 1, 2, 3, 
                                0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 2, 3, 1, 2, 3, 
                                2, 3, 4, 3, 4 ];        // image states for starting
        self.startingState = 0;                         // store the state for starting, 0 -> self.startingStates.length - 1
        self.starting = true;                           // store if the ship is starting to appear
        self.moveStep = 0.3;                            // constant, persentage of background width
        self.positionMaximum = 95;                      // constant, persentage of background width
        self.positionMinimum = -3.7;                    // constant, persentage of background width
        self.imagePartWidth = 70;                       // px of original image
        self.position =  {          "top" :   79.6,     // percentage of background height, the rect dimension and size relative to background  
                                    "left" :    50,     // percentage of background width
                                    "height" :  19,     // percentage of background height
                                    "width" :  8.4 };   // percentage of background width
        self.hitRects = [ {         "top" :             1,     // percentage of of background, the first rect that can be hit  
                                    "left" :            3.5,     // percentage of background 
                                    "height" :         9,     // percentage of background
                                    "width" :         1.4,     // percentage of background
                                    "clearTop" :        0,     // percentage of background
                                    "clearleft" :       0,     // percentage of background
                                    "clearWidth" :      0,     // percentage of background
                                    "clearHeight" :     0 },   // percentage of background
                        {           "top" :            10,     // percentage of background, next rect that can be hit  
                                    "left" :            2,     // percentage of of background
                                    "height" :          4,     // percentage of of background
                                    "width" :         4.4,
                                    "clearTop" :        0,     // percentage of background
                                    "clearleft" :       0,     // percentage of background
                                    "clearWidth" :      0,     // percentage of background
                                    "clearHeight" :     0 } ];  // percentage of of background
        self.explodingImagePartWidth = 100;                     // px width of original image
        self.explosionPosition = {  "top" :  -1.45,             // percentage of background height, position relative to position and width of bomb  
                                    "left" :  -12.5,            // percentage of background width, relative to position and width of bomb  
                                    "height" :   7,             // percentage of background height  
                                    "width" :    7 };           // percentage of background width
        self.destructImagePartCount = 4;                        // number of parts of original image
        self.destructImagePartWidth = 70;                       // px width of original image
        self.destructPosition = {   "top" :  0,                 // percentage of background height, position relative to position and width of bomb  
                                    "left" :  0,                // percentage of background width, relative to position and width of bomb  
                                    "height" :   19,            // percentage of background height  
                                    "width" :    8.4 };         // percentage of background width
        self.startingImagePartWidth = 200;                      // px width of original image
        self.startingPosition = {   "top" :   3.98,             // percentage of background height, position relative to position and width of bomb  
                                    "left" :   -2.5,            // percentage of background width, relative to position and width of bomb  
                                    "height" :   10,            // percentage of background height  
                                    "width" :    10 };          // percentage of background width
        self.clearPadding = 2;                                  // constant, px of background
        self.clearRect = {          "top" :      0,             // px, the rect that the image was drawn in  
                                    "left" :     0,             // px
                                    "height" :   0,             // px
                                    "width" :    0 };           // px
        self.drawRect = {           "top" :      0,             // px, the rect that the image is drawn in  
                                    "left" :     0,             // px
                                    "height" :   0,             // px
                                    "width" :    0 };           // px
        self.bulletStartOffsetLeft = 3.15;                      // constant, percentage of background width 
        self.bulletStartOffsetTop = 4;                          // constant, percentage of background height
        self.animationDelay = 10;                       // ms
        self.lastAnimationDate = 0;                     // save last animation time for delay
        self.positionUpdateDelay = 20;                  // ms
        self.lastPositionUpdateDate = 0;                // save last position update time for delay
        self.fireBulletDelay = 120;                      // ms
        self.lastFiringBulletUpdateDate = 0;            // save last position update time for delay
        self.firingBullets = false;
        self.strength = 5;                              // number of hits before exploding
        self.hits = 0;                                  // number of hits taken
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'playerDrawLayer' ).getContext( '2d' );

            // set bullet values
            jsProject.setValue( "shipBulletStartLeft", "game", self.position["left"] + self.bulletStartOffsetLeft );
            jsProject.setValue( "shipBulletStartTop", "game", self.position["top"] + self.bulletStartOffsetTop );
            // done set bullet values

            
            // subscribe to events
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'bombCollisionDetect', self.bombCollisionDetect );
            jsProject.subscribeToEvent( 'newShip', self.newShip );
            jsProject.subscribeToEvent( 'shipMoveRight', self.right );
            jsProject.subscribeToEvent( 'shipMoveLeft', self.left );
            jsProject.subscribeToEvent( 'shipMoveStop', self.stop );
            jsProject.subscribeToEvent( 'shipFireBullet', self.fireBullet );
            jsProject.subscribeToEvent( 'shipFireBulletStop', self.fireBulletStop );
            // done subscribe to events
            
        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // clear the clearRect
                self.canvasSurface.clearRect( 0, 0, $( '#background').width(), $( '#background').height() );  
                // go to starting mode
                self.newShip();
            }
            else {
                // clear the clearRect
                self.canvasSurface.clearRect( 0, 0, $( '#background').width(), $( '#background').height() );  
            }
        };
        self.newShip = function( ) {
            if( !self.visible ){
                return;
            }
            self.starting = true;
            self.waiting = false;
            self.hits = 0;
            self.exploding = false;
            
            self.setStartingRects();
            // change the layout according to new dimensions
            self.layoutChange();
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'layoutChange' );

            if( self.exploding ){
                // calculate drawRect for explosion
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.explosionPosition["top"] );
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.explosionPosition["left"] );
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.explosionPosition["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.explosionPosition["width"];
                // done calculate drawRect for  explosion
            }
            else if( self.starting ){
                // calculate drawRect for starting
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.startingPosition["top"] );
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.startingPosition["left"] );
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.startingPosition["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.startingPosition["width"];
                // done calculate drawRect for  starting
            }
            else {
                // calculate drawRect
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * self.position["top"];
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * self.position["left"];
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.position["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.position["width"];
                // done calculate drawRect
            }

            // animate without delay
            self.animate( true );
        };
        self.animate = function( skipDelay ){
            if( !self.visible ){
                return;
            }
            
            if( self.waiting ){
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
            
            if( self.exploding ){
                // go to exploding animation
                self.explode();
                return;
            }

            if( self.starting ){
                // go to starting animation
                self.start();
                return;
            }

            // update the state
            self.updatePosition();
            self.autoFire();
            self.updateState();

            // clear clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  

            
// show hit rects
/*
            for( var i = 0; i < self.hitRects.length; i++ ){
                self.canvasSurface.clearRect( self.hitRects[i]["clearLeft"], self.hitRects[i]["clearTop"], self.hitRects[i]["clearWidth"], self.hitRects[i]["clearHeight"] );  
            }
            for( var i = 0; i < self.hitRects.length; i++ ){
                var left = ( self.position["left"] + self.hitRects[i]["left"] ) * ( $( '#background').width() / 100 );
                var top = ( self.position["top"] + self.hitRects[i]["top"] )  * ( $( '#background').height() / 100 );
                var width = ( self.hitRects[i]["width"] )  * ( $( '#background').width() / 100 );
                var height = ( self.hitRects[i]["height"] )  * ( $( '#background').height() / 100 );
                self.hitRects[i]["clearTop"] = top;
                self.hitRects[i]["clearLeft"] = left;
                self.hitRects[i]["clearWidth"] = width;
                self.hitRects[i]["clearHeight"] = height;
                self.canvasSurface.fillStyle = "whiteSmoke";
                self.canvasSurface.fillRect( left, top, width, height  );
                
            }                     
*/ 
// done show hit rects            
            
            // 
            // 
            // draw image
            // get image
            var image = jsProject.getResource( 'shipOneNew', 'image' );
            // get the part acoording to the image state
            var x = self.imageState * self.imagePartWidth;
            // calculate position
            var left = ( $( '#background' ).width() / 100 ) * self.position["left"];
            var top = self.drawRect["top"] - ( Math.random() * ( 0.01 * self.drawRect["height"] ) );
            self.drawRect["left"] = left;
            // done calculate position
            self.canvasSurface.drawImage( image, x, 0, self.imagePartWidth, image.height,
                                          self.drawRect["left"], top, self.drawRect["width"], self.drawRect["height"] );
            // done draw image
            
            
            
            // set clearRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done set clearRect
        };
        self.updatePosition = function() {
            // check for delay
            var date = new Date();
            if( date - self.lastPositionUpdateDate < self.positionUpdateDelay ){
                return;
            }

            // done delay
            self.lastPositionUpdateDate = date;
            if( self.moveState === 'right'  ){
                // change the position
                self.position["left"] -= self.moveStep;
                // check for minimum
                if( self.position["left"] < self.positionMinimum ){
                    self.position["left"] = self.positionMinimum;
                }
                // set the bullet position
                jsProject.setValue( "shipBulletStartLeft", "game", self.position["left"] + ( self.bulletStartOffsetLeft ) );

            }
            if( self.moveState === 'left'  ){
                // change the position
                self.position["left"] += self.moveStep;
                // check for maximum
                if( self.position["left"] > self.positionMaximum ){
                    self.position["left"] = self.positionMaximum;
                }
                jsProject.setValue( "shipBulletStartLeft", "game", self.position["left"] + ( self.bulletStartOffsetLeft ) );

            }
        };
        self.autoFire = function() {
            if( !self.firingBullets ){
                return;
            }
            // check for delay
            var date = new Date();
            if( date - self.lastFiringBulletUpdateDate < self.fireBulletDelay ){
                return;
            }
            // done delay
            self.lastFiringBulletUpdateDate = date;
            jsProject.callEvent( "fireBullet" );
            
        };
        self.updateState = function() {
            self.imageState++;
            // moving stop, left, right
            self.debug( "imageState: " + self.imageState + " moveState: " + self.moveState );

            switch ( self.moveState ){
                case "stop" : { // stop
                    if( self.imageState > self.stopImageStates[self.stopImageStates.length - 1] ){
                        self.imageState = self.stopImageStates[0];
                    }
                    break;
                }
                case "left" : { // left
                    if( self.imageState > self.leftImageStates[self.leftImageStates.length - 1] ){
                        self.imageState = self.leftImageStates[0];
                    }
                    break;
                }
                case "right" : { // right
                    if( self.imageState > self.rightImageStates[self.rightImageStates.length - 1] ){
                        self.imageState = self.rightImageStates[0];
                    }
                    break;
                }
                default : {
                        
                }
            }
        };
        self.bombCollisionDetect = function() {
            // no collisions while starting or exploding
            if( self.starting || self.exploding ){
                return;
            }
            // done no collisions while starting or exploding
            
            // get the rect of the colliding object
            var rect = jsProject.getValue( "collisionRect", "game" );
            
            // check basic intersect
            var hit = false;
            for( var i = 0; i < self.hitRects.length && !hit; i++ ){
                if( rect["top"] < self.position["top"] + self.hitRects[i]["top"] || 
                    rect["left"] > self.position["left"] + self.position["width"] || 
                    rect["left"] + rect["width"] < self.position["left"] + self.hitRects[i]["left"] ){
                    return; 
                }
                else {
                    hit = true;
                }
            }
            // done check basic intersect

            // check expanded intersect
            var hit = false;
            for( var i = 0; i < self.hitRects.length; i++ ){
                var left = Math.max( rect["left"], ( self.position["left"] + self.hitRects[i]["left"] ) );
                var right = Math.min( rect["left"] + rect["width"], ( self.position["left"] + self.hitRects[i]["left"] ) + self.hitRects[i]["width"] );
                var top = Math.max( rect["top"], ( self.position["top"] + self.hitRects[i]["top"] ) );
                var bottom = Math.min( rect["top"] + rect["height"], ( self.position["top"] + self.hitRects[i]["top"] ) + self.hitRects[i]["height"] );
                if( right >= left && bottom >= top && !hit ){
                    // there is a collision
                    hit = true;
                    // get the callback
                    var callback = jsProject.getValue( "collisionCallback", "game" );
                    if( callback ){
                        // get the hitStrength of the collision
                        self.hits += callback();
                        if( self.hits >= self.strength ){
                            // more hits then strentgh
                            self.exploding = true;
                            self.hits = 0;
                            // clear the clearRect
                            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
                            // start exploding
                            self.createExplosions();    
                        }
                    }
                    // animate without delay
                    self.animate( true );
                }
                // done check expanded intersect
            }            
        };
        self.left = function( ) {
            // no movement while starting or exploding
            if( self.starting || self.exploding || self.moveState === 'left' ){
                return;
            }
            // done no movement while starting or exploding
            
            self.moveState = 'left';
            // set ship state to moving left
            self.imageState = self.leftImageStates[0];
            // done set ship state to moving left
                
            self.lastPositionUpdateDate = 0;

            // animate without delay
            self.animate( true );
        };
        self.right = function( ) {
            // no movement while starting or exploding
            if( self.starting || self.exploding || self.moveState === 'right' ){
                return;
            }
            // done no movement while starting or exploding
            self.moveState = 'right';
            self.imageState = self.rightImageStates[0];

            self.lastPositionUpdateDate = 0;

            // animate without delay
            self.animate( true );
        };
        self.stop = function( ) {
            // no movement while starting or exploding
            if( self.starting || self.exploding ){
                return;
            }
            self.debug( "stop" );
            // done no movement while starting or exploding
            
            // set ship state to moving stop
            if( self.moveState !== 'stop' ){
                self.moveState = 'stop';
                self.imageState = self.stopImageStates[0];
            }
            // done set ship state to moving right

            // animate without delay
            self.animate( true );
        };
        self.fireBullet = function() {
            // no shooting while starting or exploding or already shooting
            if( self.starting || self.exploding || self.firingBullets ){
                return;
            }
            // done no shooting while starting or exploding
            var date = new Date();
            self.lastFiringBulletUpdateDate = date;
            
            self.firingBullets = true;
            // call the event
            jsProject.callEvent( "fireBullet" );
        };
        self.fireBulletStop = function(){
            self.firingBullets = false;
        };
        self.setStartingRects = function(){
            // calculate drawRect for start
            self.drawRect["top"] = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.startingPosition["top"] );
            self.drawRect["left"] = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.startingPosition["left"] );
            self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.startingPosition["height"];
            self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.startingPosition["width"];
            // done calculate drawRect for start

            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect
        };
        self.createExplosions = function(){
            // empty the explosion array
            self.explosions = [];
            // reset the counter
            self.explosionAnimationCount = 0;
            for( var i = 0; i < self.explosionCount; i++ ){
                // create an explosion object
                var explosion = {   "top" :     ( self.position["top"] + self.explosionPosition["top"] ) + ( self.explosionPosition["height"] * Math.random() ),      // px, the rect that the image was drawn in  
                                    "left" :    ( self.position["left"] + self.explosionPosition["left"] ) + ( self.explosionPosition["width"] * Math.random() ),      // px, the rect that the image was drawn in  
                                    "size" :  10 + Math.random( ) * 10 ,      // px, the rect that the image was drawn in  
                                    "part" :  Math.floor( Math.random( ) * 4 ),
                                    "clearTop" : 0,
                                    "clearLeft" : 0,
                                    "clearHeight" : 0,
                                    "clearWidth" : 0 };
                // done create an explosion object
                        
                // add it to the array
                self.explosions.push( explosion );                
            }
        };
        self.explode = function(){
            var top, left, height, width; 
            // clear the clearRect of the ship
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            // clear the clearRect of the explosions
            for( var i = 0; i < self.explosions.length; i++ ){
                self.canvasSurface.clearRect(  self.explosions[i]["clearLeft"], self.explosions[i]["clearTop"],  self.explosions[i]["clearWidth"] , self.explosions[i]["clearHeight"] );
            }           
            if( self.explosionAnimationCount > self.explosionMaximumAnimationCount ){
                // explosions ready
                // set wait for new life mode
                self.waiting = true;
                // call event
                jsProject.callEvent( "lifeLost" );
                return;
            }
            // draw ship destruct
            var image = jsProject.getResource( 'shipOneDestructNew', 'image' );
            top = ( $( '#background').height() / 100 ) * ( self.position["top"] + self.destructPosition["top"] );
            left = ( $( '#background').width() / 100 ) * ( self.position["left"] + self.destructPosition["left"] );
            width = ( $( '#background').width() / 100 ) * self.destructPosition["width"];
            height = ( $( '#background').height() / 100 ) * self.destructPosition["height"];
            var x = Math.round( ( self.explosionAnimationCount / self.explosionMaximumAnimationCount ) * ( self.destructImagePartCount - 1 ) ) * self.destructImagePartWidth;
            self.canvasSurface.drawImage( image, x, 0, self.imagePartWidth, image.height,
                                          left, top, width, height );
            // done draw ship
            
            // set clearRect
            self.clearRect["top"] = top - self.clearPadding;
            self.clearRect["left"] = left - self.clearPadding;
            self.clearRect["height"] = height + ( self.clearPadding * 2 );
            self.clearRect["width"] = width + ( self.clearPadding * 2 );
            // done set clearRect

            // draw explosions
            for( var i = 0; i < self.explosions.length; i++ ){
                
                // calculate position of explosion
                top = ( $( "#background").height() / 100 ) * self.explosions[i]["top"];
                left = ( $( "#background").width() / 100 ) * self.explosions[i]["left"];
                height = ( $( "#background").height() / 100 ) * self.explosions[i]["size"];
                width = ( $( "#background").width() / 100 ) * self.explosions[i]["size"];
                // done calculate position of explosion
                
                // draw image
                var image = jsProject.getResource( 'shipOneExploding', 'image' );
                var x = self.explosions[i]["part"] * 100;
                self.canvasSurface.drawImage( image, x, 0, 100, image.height,
                                              left, top, width, height );
                // done draw image
                                              
                // set clearRect
                self.explosions[i]["clearTop"] = top - 2;
                self.explosions[i]["clearLeft"] = left - 2;
                self.explosions[i]["clearWidth"] = width + 4;
                self.explosions[i]["clearHeight"] = height + 4;
                // done set clearRect
                
                // update imagepart to draw
                self.explosions[i]["part"]++;
                if( self.explosions[i]["part"] > 3 ){
                    self.explosions[i]["part"] = 0;
                }
                // done update imagepart to draw
                
                // variate size
                self.explosions[i]["size"]++;
                self.explosions[i]["top"]-= 0.5;
                self.explosions[i]["left"]-= 0.5;
                if( self.explosions[i]["size"] > 20 ){
                    self.explosions[i]["top"] = self.position["top"] + ( self.position["height"] * Math.random() );
                    self.explosions[i]["left"] = self.position["left"] + ( self.position["width"] * Math.random() );
                    self.explosions[i]["size"] = Math.floor( Math.random( ) * 10 );
                }
                // done variate size
            }
            // done draw explosions
            
            // update animation counter
            self.explosionAnimationCount++;
            
        };
        self.start = function(){
            // clear the clearRect of the shipOneStarting image
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            
            if( self.startingState >= self.startingStates.length ){
            // starting ready 

                // calculate drawRect
                self.drawRect["top"] = ( $( '#background').height() / 100 ) * self.position["top"];
                self.drawRect["left"] = ( $( '#background').width() / 100 ) * self.position["left"];
                self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.position["height"];
                self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.position["width"];
                // done calculate drawRect
                
                // clearRect = drawRect
                self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
                self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
                self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
                self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
                // done clearRect = drawRect
                
                
                self.starting = false;
                self.startingState = 0;
                // set moving state
                self.movingState = "stop";
                // set image state
                self.imageState = self.stopImageStates[0];
                // animate without delay
                self.animate( true );
                // stop starting 
                return;
            }
            
            // draw the shipStarting image
            self.imageState = self.startingStates[self.startingState];
            // get the current part according to the state
            var imagePartLeft = self.imageState * self.startingImagePartWidth;
            // get the image
            var image = jsProject.getResource( 'shipOneStarting', 'image' );
            self.canvasSurface.drawImage( image, imagePartLeft, 0, self.startingImagePartWidth, image.height,
                                          self.drawRect["left"], self.drawRect["top"], self.drawRect["width"], self.drawRect["height"] );
            
            // done draw the shipStarting image

            // update starting state
            self.startingState++;
        };
        self.destruct = function( ) {
            // remove the event subscriptions
            jsProject.unSubscribeFromEvent( 'animate', self.animate );
            jsProject.unSubscribeFromEvent( 'layoutChange', self.layoutChange );
            jsProject.unSubscribeFromEvent( 'rightKeyPressed', self.right );
            jsProject.unSubscribeFromEvent( 'leftKeyPressed', self.left );
            jsProject.unSubscribeFromEvent( 'keyUp', self.stop );
            jsProject.unSubscribeFromEvent( 'spaceKeyPressed', self.fireBullet );
            jsProject.unSubscribeFromEvent( 'bombCollisionDetect', self.bombCollisionDetect );
            jsProject.unSubscribeFromEvent( 'newShip', self.newShip );
            // done remove the event subscriptions
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
            move : function( direction ){
                self.move( direction );
            },
            fireBullet : function( ){
                self.fireBullet( );
            },
            launchRocket : function( ){
                self.launchRocket( );
            },
            destruct : function( ){
                self.destruct( );
            }            
        };
    };
})( gameDevelopment );