/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this module controls one bunker for the application space invaders
 *               the bunker is placed in the bottom part of the middle of the screen.
 *               contains a topLayer and a number of part layers
 *               bunker values are set by the levels module
 *               bunkers react to bullets, bombs and invaders
 *               
 * Last revision: 20-05-2015
 * 
 * Status:   code:               ready   
 *           comments:           ready 
 *           memory:             ready
 *           development:        better images.        
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
    gameDevelopment.bunkerModule = function( id ) {

        /*
         *  module bunkerModule 
         *   
         *  functions: 
         *      private:
         *          construct                   called internal
         *          show                        called by the public function
         *          createParts                 called internal
         *          checkInvaderBunkerHit       called from event subscription
         *          collisionDetect             called from event subscription bulletCollisionDetect or bombCollisionDetect
         *          layoutChange                called by the public function
         *          animate                     called by the public function
         *          debug
         *      public:
         *          show 
         *          layoutChange 
         *          animate     
         *          
         *  event subscription: 
         *      checkInvaderBunkerHit           called from the invadersModule          
         *      bulletCollisionDetect           called from s bullet moduke
         *      bombCollisionDetect             called from s bomb moduke
         *          
         */
    
        // private
        var self = this;
        self.MODULE = 'bunkerModule';
        self.debugOn = false;
        self.visible = false;                                   // visibility
        self.canvasSurface = null;                              // canvas surface to draw on
        self.id = id;                                           // id = position 0 left to  n - right 
        self.topImagePartWidth = 200;                           // px of original image
        self.partImagePartWidth = 245;                          // px of original image
        self.partVerticalSpacing = 5;                           // px of background
        self.topPartExtraHeight = 25;                           // percentage of bunker height
        self.position = {  "top" :     64,                      // start set by project value shipBulletStartTop controlled by shipModule percentage of background height  
                           "left" :     0,                      // start set by project value shipBulletStartLeft controlled by shipModule percentage of background width
                           "height" :  14,                      // constant percentage of background height
                           "width" :    0 };                    // constant percentage of background width
        self.clearPadding = 2;                                  // px of background
        self.clearRect = { "top" :      0,                      // px, the rect that the image was drawn in  
                           "left" :     0,                      // px
                           "height" :   0,                      // px
                           "width" :    0 };                    // px
        self.drawRect = {  "top" :      0,                      // px, the rect that the image is drawn in  
                           "left" :     0,                      // px
                           "height" :   0,                      // px
                           "width" :    0 };                    // px
        self.parts = [];                                        // store the parts of the bunker
        self.animationDelay = ( Math.random() * 2000 ) + 500;   // ms random length of basic animation
        self.lastAnimationDate = 0;                             // store last animation time
        self.topBasicAnimationParts = 2;                        // number of image parts of basic animation for top part 
        self.topHitAnimationParts = 5;                          // number of image parts for hit animation for top part
        self.partBasicAnimationParts = 1;                       // number of image parts of basic animation for left and right parts 
        self.partHitAnimationParts = 1;                         // number of image parts for hit animation for left and right parts
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'bunkersDrawLayer' ).getContext( '2d' );
            
            // subscribe to events
            jsProject.subscribeToEvent( 'checkInvaderBunkerHit', self.checkInvaderBunkerHit );
            jsProject.subscribeToEvent( 'bulletCollisionDetect', self.collisionDetect );
            jsProject.subscribeToEvent( 'bombCollisionDetect', self.collisionDetect );
            // done subscribe to events
            
        };
        self.show = function( visible ) {
            self.visible = visible;
            self.debug( 'show' );
            if( visible ){
                // create the parts 
                self.createParts();
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // remove parts
                while( self.parts.length ){
                    self.parts.pop();
                }
                // done remove parts
            }
        };
        self.checkInvaderBunkerHit = function() {
            // get the current bottom position of the invaders
            var invadersBottom = jsProject.getValue( "invadersBottom", "game" );
            // are invders below bunker top
            if( invadersBottom >= self.position["top"] ){
                // hide the bunker
                self.visible = false;
                // clear rect
                self.canvasSurface.clearRect( self.drawRect["left"], self.drawRect["top"], self.drawRect["width"], self.drawRect["height"] );
            }
        };
        self.collisionDetect = function() {
            if( !self.visible ){
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
            for( var i = self.parts.length - 1; i >= 0; i-- ) {
                if( self.parts[i]['visible'] ){
                    var left = Math.max( rect["left"], self.parts[i]["positionLeft"] );
                    var right = Math.min( rect["left"] + rect["width"], self.parts[i]["positionLeft"] + self.parts[i]["positionWidth"] );
                    var top = Math.max( rect["top"], self.parts[i]["positionTop"] );
                    var bottom = Math.min( rect["top"] + rect["height"], self.parts[i]["positionTop"] + self.parts[i]["positionHeight"] );
                    if( right >= left && bottom >= top ){
                        // there is a collision
                        // get the callback
                        var callback = jsProject.getValue( "collisionCallback", "game" );
                        if( callback ){
                            // get the hitStrength of the collision
                            self.parts[i]['hits'] += callback()
                            // more hits then strentgh
                            if( self.parts[i]['hits'] >= self.parts[i]['strength'] ){
                                // hide part
                                self.parts[i]['visible'] = false;
                            }
                        }
                        // animate without delay
                        self.animate( true );
                    }
                }
            }
            // done check expanded intersect
            
        };
        self.createParts = function() {
            self.debug( 'createParts' );
            // create the structures for the parts
            // one top part
            var topPart = { "type" : "top",
                            "positionTop" : 0,
                            "positionLeft" : 0,
                            "positionHeight" : 0,
                            "positionWidth" : 0,
                            "drawTop" : 0,
                            "drawLeft" : 0,
                            "drawHeight" : 0,
                            "drawWidth" : 0,
                            "strength" : jsProject.getValue( "bunkerTopStrength", "level" ),        // set strength
                            "hits" : 0,
                            "visible" : true,
                            "state" : 0 };
            // add it to parts
            self.parts.push( topPart );
            // get the number of part layers
            var layers = jsProject.getValue( "bunkerLayers", "level" );
            // loop over layers
            for( var i = 0; i < layers; i++ ) {
                // create left part structure
                var leftPart = { "type" : "left",
                                  "positionTop" : 0,
                                  "positionLeft" : 0,
                                  "positionHeight" : 0,
                                  "positionWidth" : 0,
                                  "drawTop" : 0,
                                  "drawLeft" : 0,
                                  "drawHeight" : 0,
                                  "drawWidth" : 0,
                                  "strength" : jsProject.getValue( "bunkerPartStrength", "level" ),     // set strength
                                  "hits" : 0,
                                  "visible" : true,
                                  "state" : 0 };
                // add to parts
                self.parts.push( leftPart );
                // create right part structure
                var rightPart = { "type" : "right",
                                  "positionTop" : 0,
                                  "positionLeft" : 0,
                                  "positionHeight" : 0,
                                  "positionWidth" : 0,
                                  "drawTop" : 0,
                                  "drawLeft" : 0,
                                  "drawHeight" : 0,
                                  "drawWidth" : 0,
                                  "strength" : jsProject.getValue( "bunkerPartStrength", "level" ),     // set strength
                                  "hits" : 0,
                                  "visible" : true,
                                  "state" : 0 };
                // add to parts
                self.parts.push( rightPart );
            }            
            // done loop over layers
        };
        self.layoutChange = function() {
            if( !self.visible ){
                return;
            }
            
            self.debug( 'layoutChange' );
            
            // calculate position of the bunker
            var offset = jsProject.getValue( "bunkerOffset", "level" );
            var spacing = jsProject.getValue( "bunkerSpacing", "level" );
            var width = jsProject.getValue( "bunkerWidth", "level" );
            self.position["left"] = ( self.id * spacing ) + ( self.id * width ) + offset;
            self.position["width"] = width;
            // done calculate position of the bunker
           
            // calculate drawRect of bunker
            self.drawRect["top"] = ( $( "#background").height() / 100 ) * self.position["top"];
            self.drawRect["left"] = ( $( "#background").width() / 100 ) * self.position["left"];
            self.drawRect["height"] = ( $( "#background").height() / 100 ) * self.position["height"];
            self.drawRect["width"] = ( $( "#background").width() / 100 ) * self.position["width"];
            // calculate drawRect of bunker
            
            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect
             
            // bunker out of view
            if( self.position["left"] + self.position["width"] > 100 ){
                self.visible = false;
                return;
            }
            // done bunker out of view

            // calculate positions of parts
            var layers = jsProject.getValue( "bunkerLayers", "level" );
            var totalHeigtht = ( 100 + self.topPartExtraHeight ) + ( 100 * layers ) + ( self.partVerticalSpacing * layers ); 
            var topPartHeight = ( ( 100 + self.topPartExtraHeight ) / totalHeigtht ) * self.position["height"];
            var partHeight = ( 100 / totalHeigtht ) * self.position["height"];
            var verticalSpacing = ( self.partVerticalSpacing / totalHeigtht ) * self.position["height"];
            
            var partSpacing = jsProject.getValue( "bunkerPartSpacing", "level" );
            var partWidth = ( ( 100 - partSpacing ) /  2 ) * ( self.position["width"] / 100 );
            var partSpacing = partSpacing * ( self.position["width"] / 100 );
                    
            var topPosition = self.position["top"];
            // loop over parts
            for( var i = 0; i < self.parts.length; i++ ) {
                // calculate position
                switch( self.parts[i]["type"] ) {
                    case "top" : {
                        //self.debug( 'toppart found topPartLeft:' + topPartLeft );    
                        self.parts[i]["positionTop"] = topPosition; 
                        self.parts[i]["positionLeft"] =  self.position["left"];        
                        self.parts[i]["positionHeight"] = topPartHeight;        
                        self.parts[i]["positionWidth"] =  self.position["width"];
                        topPosition += topPartHeight + verticalSpacing;
                        break;
                    }
                    case "left" : { 
                        self.parts[i]["positionTop"] = topPosition;        
                        self.parts[i]["positionLeft"] = self.position["left"];        
                        self.parts[i]["positionHeight"] = partHeight;        
                        self.parts[i]["positionWidth"] = partWidth;        
                        break;
                    }
                    case "right" : { 
                        self.parts[i]["positionTop"] = topPosition;        
                        self.parts[i]["positionLeft"] = self.position["left"] + partWidth + partSpacing;        
                        self.parts[i]["positionHeight"] = partHeight;        
                        self.parts[i]["positionWidth"] = partWidth;        
                        topPosition += partHeight + verticalSpacing;
                        break;
                    }
                    default: {
                        self.debug( "unknown part." );
                    }
                }       
                // done calculate position
                  
                // calculate the draw rects
                self.parts[i]["drawTop"] = ( $( "#background").height() / 100 ) * self.parts[i]["positionTop"]; 
                self.parts[i]["drawLeft"] =  ( $( "#background").width() / 100 ) * self.parts[i]["positionLeft"];       
                self.parts[i]["drawHeight"] = ( $( "#background").height() / 100 ) * self.parts[i]["positionHeight"];        
                self.parts[i]["drawWidth"] =  ( $( "#background").width() / 100 ) * self.parts[i]["positionWidth"];
                // done calculate the draw rects
            }
            // done loop over parts
            // done calculate positions of parts
            
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

            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );

            var partOffset = 0;
            // loop over parts
            for( var i = 0; i < self.parts.length; i++ ) {
                if( self.parts[i]["visible"] ) {
                    switch( self.parts[i]["type"] ) {
                        case "top" : { 
                            var image = jsProject.getResource( 'bunkerTop', 'image' );
                            // not hit basic animation 
                            if(  self.parts[i]["hits"] === 0 ){
                                if( self.parts[i]["state"] === 0 ){
                                    self.parts[i]["state"] = 1;
                                    partOffset = 1;
                                    // speed up animation
                                    self.animationDelay = 200;
                                }
                                else {
                                    // slow down animation
                                    self.animationDelay = ( Math.random() * 2000 ) + 1500;
                                    self.parts[i]["state"] = 0;
                                    partOffset = 0;
                                }
                            } // done not hit basic animation
                            else { // already hit 
                                var restStrength = self.parts[i]["strength"] - self.parts[i]["hits"];
                                // find the part according relation hitstrength / hits to number of image parts
                                
                                partOffset = ( ( self.topBasicAnimationParts + self.topHitAnimationParts ) + 1 ) - Math.ceil( ( restStrength / self.parts[i]["strength"] ) * self.topHitAnimationParts );
                                //self.debug( "partoffset = " + partOffset );
                                self.parts[i]["state"] = 0;
                                // slow down the animation;
                                self.animationDelay = 5000;
                            }

                            self.canvasSurface.drawImage( image, partOffset * self.topImagePartWidth, 0, self.topImagePartWidth, image.height, 
                                                          self.parts[i]["drawLeft"], self.parts[i]["drawTop"], 
                                                          self.parts[i]["drawWidth"], self.parts[i]["drawHeight"] );
                            break;
                        }
                        case "left" : { 
                            if(  self.parts[i]["hits"] === 0 ){
                                 partOffset = 0;
                            }   
                            else {
                                var restStrength = self.parts[i]["strength"] - self.parts[i]["hits"];
                                // find the part according relation hitstrength / hits to number of image parts
                                partOffset = ( ( self.partBasicAnimationParts + self.partHitAnimationParts ) ) - Math.ceil( ( restStrength / self.parts[i]["strength"] ) * self.partHitAnimationParts );
                            }
                            // get image
                            var image = jsProject.getResource( 'bunkerPart', 'image' );
                            // draw image
                            self.canvasSurface.drawImage( image, partOffset * self.partImagePartWidth, 0, self.partImagePartWidth, image.height, 
                                                          self.parts[i]["drawLeft"], self.parts[i]["drawTop"], 
                                                          self.parts[i]["drawWidth"], self.parts[i]["drawHeight"] );
                            break;
                        }
                        case "right" : { 
                            if(  self.parts[i]["hits"] === 0 ){
                                 partOffset = 0;
                            }   
                            else {
                                var restStrength = self.parts[i]["strength"] - self.parts[i]["hits"];
                                // find the part according relation hitstrength / hits to number of image parts
                                partOffset = ( ( self.partBasicAnimationParts + self.partHitAnimationParts ) ) - Math.ceil( ( restStrength / self.parts[i]["strength"] ) * self.partHitAnimationParts );
                            }                            
                            // get image
                            var image = jsProject.getResource( 'bunkerPart', 'image' );
                            // draw image
                            self.canvasSurface.drawImage( image, partOffset * self.partImagePartWidth, 0, self.partImagePartWidth, image.height, 
                                                          self.parts[i]["drawLeft"], self.parts[i]["drawTop"], 
                                                          self.parts[i]["drawWidth"], self.parts[i]["drawHeight"] );
                            break;
                        }
                        default: {
                            self.debug( "unknown part." );
                        }
                    } 
                    // done switch           
                } 
                // done visible
            }
            // done loop over parts
            
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
            layoutChange : function(){
                self.layoutChange();
            },
            animate : function( ){
                self.animate( );
            }
        };
    };
})( gameDevelopment );