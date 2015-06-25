/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing one invader for the application space invaders
 * 
 * 
 * Last revision: 21-05-2015
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
    gameDevelopment.invaderTwoModule = function( ) {

        /*
         *  module invaderTwoModule 
         *   
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          setPosition         called by the public function
         *          layoutChange        called by the public function
         *          animate             called by the public function
         *          sideHit             called by the public function, check if the invader hits side of movement rect
         *          update              called by the public function, update the movement  
         *          getBottom           called by the public function, check for bottom position  
         *          destruct                 called by the public function, unsubscribe from events
         *          debug
         *      public:
         *          setPosition         called by the invadersModule
         *          layoutChange        called by the invadersModule
         *          animate             called by the invadersModule
         *          sideHit             called by the invadersModule
         *          getBottom           called by the invadersModule
         *          destruct                 called by the invadersModule
         *          
         *  event subscription: 
         *      bulletCollisionDetect   called from a bullet module
         *  
         *  event calls: 
         *      scoreChange 
         *           
         */
 
        // private
        var self = this;
        self.MODULE = 'invaderTwoModule';
        self.debugOn = false;
        self.canvasSurface = null;
        self.position = { "top" :       0,      // percentage of background height  
                          "left" :      0,      // percentage of background width
                          "height" :    0,      // percentage of background height
                          "width" :     0 };    // percentage of background width
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRect = { "top" :       0,      // px, the rect that the image is drawn in  
                          "left" :      0,      // px
                          "height" :    0,      // px
                          "width" :     0 };    // px
        self.imagePartWidth = 125;              // px of original image
        self.blockWidth = 2;                    // number of invaderblock this invader occupies in horizontal direction
        self.blockHeight = 2;                   // number of invaderblock this invader occupies in vertical direction    
        self.alive = true;                      // store if invader is alive
        self.strength = 12;                     // store the strength of invader
        self.hits = 0;                          // store the number of hits taken by invader
        self.bombType = 2;                      // store bomb type for bomb release function
        self.hitScore = 30;                     // store the score for when a bullet hits invader
        self.difficultyHitScore = 10;           // store the extra score per diificulty level
        self.killScore = 200;                   // store the score for when invader destructs
        self.difficultyKillScore = 40;          // store the extra score per diificulty level
        
        // functions
        self.construct = function() {
            //self.debug( 'construct' );

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'invadersDrawLayer' ).getContext( '2d' );


            self.hitScore += jsProject.getValue( "difficulty", "game" ) * self.difficultyHitScore;
            self.killscore += jsProject.getValue( "difficulty", "game" ) * self.difficultyKillScore;

            // subscribe to events
            jsProject.subscribeToEvent( 'bulletCollisionDetect', self.bulletCollisionDetect );
        };
        self.bulletCollisionDetect = function() {
            if( !self.alive ){
                return;
            }
            
            // get the rect of the colliding object
            var rect = jsProject.getValue( "collisionRect", "game" );
            
            // check basic intersect
            if( rect["top"] < self.position["top"] || 
                rect["left"] > self.position["left"] + self.position["width"] || 
                rect["left"] +  rect["width"] < self.position["left"] ){
                return; 
            }
            // done check basic intersect

            // check expanded intersect
            var left = Math.max( rect["left"], self.position["left"] );
            var right = Math.min( rect["left"] + rect["width"], self.position["left"] + self.position["width"] );
            var top = Math.max( rect["top"], self.position["top"] );
            var bottom = Math.min( rect["top"] + rect["height"], self.position["top"] + self.position["height"] );
            if( right >= left && bottom >= top ){
                // there is a collision
                // get the callback
                var callback = jsProject.getValue( "collisionCallback", "game" );
                if( callback ){
                    // get the hitStrength of the collision
                    self.hits += callback();
                    jsProject.setValue( "collisionCallback", "game", null );
                    // more hits then strentgh
                    if( self.hits > self.strength ){
                        // hide invader
                        self.alive = false;
                        self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );
                        // add kill to score
                        jsProject.setValue( "score", "game", jsProject.getValue( "score", "game" ) + self.killScore );
                        jsProject.callEvent( "scoreChange" );
                        // done add kill to score
                    }
                    else {
                        // add hit to score
                        jsProject.setValue( "score", "game", jsProject.getValue( "score", "game" ) + self.hitScore );
                        jsProject.callEvent( "scoreChange" );
                        // done add hit to score
                    }
                }
                // animate without delay
                self.animate( true );
            }
            // done check expanded intersect
            
        };
        self.setPosition = function( top, left, height, width, verticalSpacing, horizontalSpacing ) {
            // set position of the invader
            self.position["top"] = top;
            self.position["left"] = left;
            // done set position of the invader
            // calculate dimensions of invader
            self.position["height"] = ( ( self.blockHeight - 1 ) * verticalSpacing ) + ( self.blockHeight * height );
            self.position["width"] = ( ( self.blockWidth - 1 ) * horizontalSpacing ) + ( self.blockWidth * width );;
            // done calculate dimensions of invader
        };
        self.update = function( changeHorizontal, changeVertical ){
            if( !self.alive ){
                return;
            }

            // change the position
            self.position["top"] += changeVertical;
            self.position["left"] += changeHorizontal;
            // set the new drawRect
            self.drawRect["top"] = ( $( '#background' ).height() / 100 ) * self.position["top"];
            self.drawRect["left"] = ( $( '#background' ).width() / 100 ) * self.position["left"];
            
        };
        self.layoutChange = function(){
            if( !self.alive ){
                return;
            }
            //self.debug( 'layoutChange' );
            
            // reset clearRect
            self.clearRect["top"] = 0;
            self.clearRect["left"] = 0;
            self.clearRect["height"] = 0;
            self.clearRect["width"] = 0;
            // done reset clearRect
            
            // calculate drawRect
            self.drawRect["top"] = ( $( '#background').height() / 100 ) * self.position["top"];
            self.drawRect["left"] = ( $( '#background').width() / 100 ) * self.position["left"];
            self.drawRect["height"] = ( $( '#background').height() / 100 ) * self.position["height"];
            self.drawRect["width"] = ( $( '#background').width() / 100 ) * self.position["width"];
            // done calculate drawRect
        };
        self.clearRect = function( ){
            //self.debug( 'clearRect' );
            if( !self.alive ){
                return;
            }    
            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            
        };
        self.animate = function( ){
            if( !self.alive ){
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
            var image = jsProject.getResource( 'invaderOne', 'image' );
            self.canvasSurface.drawImage( image, imagePartLeft, 0, self.imagePartWidth, image.height,
                                          self.drawRect["left"], self.drawRect["top"], self.drawRect["width"], self.drawRect["height"] );
            // done draw image
            
            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"];
            self.clearRect["left"] = self.drawRect["left"];
            self.clearRect["height"] = self.drawRect["height"];
            self.clearRect["width"] = self.drawRect["width"];
            // done clearRect = drawRect
            
        };
        self.sideHit = function( change, minimum, maximum ){
            if( !self.alive ){
                return false;
            }
            
            // check left side
            if( change < 0 ){
                //self.debug( "change=" + change );
                if( self.position["left"] + change < minimum ){
                    self.debug( 'hitleft change:' + change + ' minimum:' + minimum );
                    return true;
                }
            } // done check left side
            else { // check right side
                if( self.position["left"] + self.position["width"] + change > maximum ){
                    self.debug( 'hitright change:' + change + 'maximum:' + maximum );
                    return true;
                }
            } // done check right side
            
            // no side hit
            return false;
        };
        self.getBottom = function( ){
            // return top + height
            return self.position["top"] + self.position["height"];
        };
        self.releaseBomb = function( ){
            if( !self.alive ){
                return;
            }

            // set the values for the bomb
            jsProject.setValue( "bombType", "game", self.bombType );
            jsProject.setValue( "bombStartTop", "game", self.position["top"] + self.position['height']);
            jsProject.setValue( "bombStartLeft", "game", ( self.position["left"] ) );
            // call the event
            jsProject.callEvent( "releaseBomb" );
        };
        self.destruct = function(){
            //unsubscribe from events
            jsProject.unSubscribeFromEvent( 'bulletCollisionDetect', self.bulletCollisionDetect );
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
            setPosition : function( top, left, height, width, verticalSpacing, horizontalSpacing ) {
                self.setPosition( top, left, height, width, verticalSpacing, horizontalSpacing );
            },
            update : function( changeHorizontal, changeVertical ) {
                self.update( changeHorizontal, changeVertical );
            },
            clearRect : function(){
                self.clearRect();
            },
            animate : function() {
                self.animate();
            },
            layoutChange : function() {
                self.layoutChange();
            },
            getBottom : function() {
                return self.getBottom( );
            },
            sideHit : function( change, minimum, maximum ) {
                return self.sideHit( change, minimum, maximum );
            },
            releaseBomb : function() {
                return self.releaseBomb();
            },
            isAlive : function() {
                return self.alive;
            },
            destruct : function(  ){
                self.destruct();
            }
        };
    };
})( gameDevelopment );