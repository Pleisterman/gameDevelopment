/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module contains the invaders for the application space invaders
 *          the invaders are placed in the top part of the of the screen.
 *          the invaders are anymates moving from left to right and top to bottom
 *          the invaders are set in rows and columns defined by the project array value: invaders
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
    gameDevelopment.invadersModule = function( ) {
        /*
         *  module invadersModule 
         *         
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          setLevelValues      called internal, by show function
         *          createinvaders      called internal, by show function   
         *          createinvader       called internal, by createInvaders function
         *          layoutChange        called from event subscription
         *          animate             called from layoutChange and event subscription
         *          updateBombs         called from animate
         *          update              called from animate
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      animate                 called from gameModule
         *      layoutChange            called from gameLayoutModule
         */
 
        // private
        var self = this;
        self.MODULE = 'invadersModule';
        self.debugOn = false;
        self.visible = false;           // visibility
        self.canvasSurface = null;      // canvas surface to draw on
        self.killLine = 88;             // percentage of background height, constant
        self.fieldMinimum = 0;          // percentage of background, definition of left side of invaders field movement, set by jsProject value level->invadersFieldMinimum   
        self.fieldMaximum = 0;          // percentage of background, definition of right side of invaders field movement, set by jsProject value level->invadersFieldMaximum    
        self.invaders = [];             // store the invader modules
        self.startAnimationDelay = 400;  // ms, constant
        self.animationDelay = 0;       // ms, can be changed by update delay 
        self.lastAnimationDate = 0;     // save last animation time
        self.updateDelay = 0;           // ms   
        self.lastUpdateDate = 0;        // save last update time for delay
        self.updateDelayMinimum = 0;    // minimum that the update delay can have
        self.updateDelayMaximum = 0;    // start of update delay, set by the jsProject value level->invadersUpdateDelay 
        self.updateDirection = 0;       // direction of movement: -1 = left, 1 = right, set by jsProject value level->invadersUpdateDirection 
        self.sideStep = 0;              // percentage of background width, set by jsProject value level->invadersSideStep     
        self.sideStepMinimum = 0;       // percentage of background width,  minimum that the update side ways can have, set by jsProject value level->invadersSideStepMinimum 
        self.sideStepMaximum = 0;       // percentage of background width,  minimum that the update side ways can have, set by jsProject value level->invadersSideStepMaximum 
        self.downStep = 0;              // percentage of background width, set by jsProject value level->invadersDownStep
        self.bombs = null;              // store the bombsModule    
        self.maximumBombs = 4;          // number of bombs that can be active at one time, set by jsProject value level->maximumBombs    
        self.bombDelay = 10;            // delay between bomb releases, set by jsProject value level->bombDelay
        self.lastBombDate = 0;          // store last bomb release time
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            self.bombs = new gameDevelopment.bombsModule();

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'invadersDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            // done subscribe to events

        };
        self.show = function( visible ){
            if( visible ){
                self.visible = false;
                self.debug( 'show' );
                self.setLevelValues();
                self.createinvaders();
                
                self.bombs.show( visible );
                // change the layout according to new dimensions
                self.visible = visible;
                self.layoutChange();
                
            }
            else {
                self.visible = visible;
                self.debug( 'hide' );
                self.bombs.show( visible );
                for( var i = 0; i < self.invaders.length; i++ ){
                    self.invaders[i].destruct();
                }            
                while( self.invaders.length ){
                    self.invaders.pop();
                }
                // clear the whole canvas
                self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            }
        };
        self.setLevelValues = function() {
            // get the level values from jsProject
            self.fieldMinimum = jsProject.getValue( "invadersFieldMinimum", "level" );
            self.fieldMaximum = jsProject.getValue( "invadersFieldMaximum", "level" );
            self.updateDelayMaximum = jsProject.getValue( "invadersUpdateDelayMaximum", "level" );
            self.updateDelayMinimum = jsProject.getValue( "invadersUpdateDelayMinimum", "level" );
            self.updateDirection = jsProject.getValue( "invadersUpdateDirection", "level" );
            self.sideStepMaximum = jsProject.getValue( "invadersSideStepMaximum", "level" );
            self.sideStepMinimum = jsProject.getValue( "invadersSideStepMinimum", "level" );
            self.downStep = jsProject.getValue( "invadersDownStep", "level" );
            self.bombDelay =  jsProject.getValue( "bombDelay", "level" );
            // done get the level values from jsProject
            
            // set start update delay
            self.updateDelay = self.updateDelayMaximum;
            // set start animation delay
            self.animationDelay = self.startAnimationDelay;
            // set start side movement
            self.sideStep = self.sideStepMinimum;
        };
        self.createinvaders = function() {
            // get invaders
            var invaders = jsProject.getValue( "invaders", "level" );
            if( !invaders.length || !invaders[0].length ){
                self.debug( "error no invaders.");
                return;
            }
            // done get invaders
            
            // get invader field values
            var top = jsProject.getValue( "invadersFieldOffsetTop", "level" );
            var firstLeft = jsProject.getValue( "invadersFieldOffsetLeft", "level" );
            var invadersFieldHeight = jsProject.getValue( "invadersFieldHeight", "level" );
            var invadersFieldWidth = jsProject.getValue( "invadersFieldWidth", "level" );
            var horizontalSpacing = jsProject.getValue( "invadersHorizontalSpacing", "level" );
            var verticalSpacing = jsProject.getValue( "invadersVerticalSpacing", "level" );
            // done get invader field values
            
            // calculate dimensions of the field
            var width = ( invadersFieldWidth - ( ( invaders[0].length - 1 ) * horizontalSpacing ) ) / invaders[0].length;
            var height = ( invadersFieldHeight - ( ( invaders.length - 1 ) * verticalSpacing ) ) / invaders.length;
            // calculate dimensions of the field
            
            
            // create the invaders array
            var invader = null;
            var left = firstLeft;
            // loop over invaders array
            for( var i = 0; i < invaders.length; i++ ){
                left = firstLeft;
                for( var j = 0; j < invaders[i].length; j++ ){
                    // create invader
                    invader = self.createinvader( invaders[i][j] );
                    if( invader ){
                        // set paosition and animate
                        invader.setPosition( top, left, height, width, verticalSpacing, horizontalSpacing );
                        invader.layoutChange();
                        invader.animate();
                    }
                    left += width + horizontalSpacing; 
                }
                top += height + verticalSpacing; 
            }
            // done loop over invaders array
        };
        self.createinvader = function( type ) {
            var invader = null;
            switch ( type ){
                case 0 : {
                    // no invader
                    break;
                }
                case 1 : {
                    // create invader type 1    
                    invader = new gameDevelopment.invaderOneModule();
                    // add to invaders array
                    self.invaders.push( invader );
                    break;
                }
                case 2 : {
                    // create invader type 2    
                    invader = new gameDevelopment.invaderTwoModule();
                    // add to invaders array
                    self.invaders.push( invader );
                    break;
                }
                default : {
                    self.debug( "error unknown invader type" );
                }
            }
            return invader;
        };
        self.layoutChange = function( ){
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;

            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            // change the layout according to new dimensions for the invaders
            for( var i = 0; i < self.invaders.length; i++ ){
                self.invaders[i].layoutChange();
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

            // update bombs
            self.updateBombs();

            // done update bombs
            
            // check for delay
            var date = new Date();
            if( !skipDelay ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }
            // done delay
            self.lastAnimationDate = date;
            
            // update
            self.update();
            
            // clear rects
            for( var i = 0; i < self.invaders.length; i++ ){
                self.invaders[i].clearRect();
            }            
            // done clear rects
            
            // animate invaders
            for( var i = 0; i < self.invaders.length; i++ ){
                self.invaders[i].animate();
            }            
            // done animate invaders
            
        };
        self.updateBombs = function(){
            // check delay
            var date = new Date();
            if( date - self.lastBombDate > self.bombDelay ){
                // done delay
                self.lastBombDate = date;
                // select random invader
                var i = Math.floor( Math.random() * self.invaders.length );
                // release a bomb
                self.invaders[i].releaseBomb();
            }
        };
        self.update = function(){
            // check for delay
            var date = new Date();
            if( date - self.lastUpdateDate < self.updateDelay ){
                return;
            }
            // done delay
            self.lastUpdateDate = date;

            
            // speedUp
            var livingInvaderCount = 0; 
            for( var i = 0; i < self.invaders.length; i++ ){
                if( self.invaders[i].isAlive() ){
                    livingInvaderCount++;
                }
            }
            if( livingInvaderCount < 1 ){
                jsProject.callEvent( "allInvadersKilled" );
                return;
            }
            self.updateDelay = self.updateDelayMaximum * ( ( livingInvaderCount ) / self.invaders.length );
            // check for minimum delay
            if( self.updateDelay < self.updateDelayMinimum ){
                self.updateDelay = self.updateDelayMinimum;
            }
            // check if animation delay > update delay
            if( self.animationDelay > self.updateDelay ){
                // speed up animation
                self.animationDelay = self.updateDelay;
            }
            // done speedUp
            self.sideStep = self.sideStepMaximum - ( ( self.sideStepMaximum  - self.sideStepMinimum ) * ( livingInvaderCount / self.invaders.length ) ); 
            
            // check if invaders hit the right or left side
            var sideHit = false;
            for( var i = 0; i < self.invaders.length && !sideHit; i++ ){
                sideHit = self.invaders[i].sideHit( self.updateDirection * self.sideStep, self.fieldMinimum, self.fieldMaximum );
            }      
            if( sideHit ){
                // get underside of the living invaders group
                var bottomMaximum = 0;
                var bottom = 0;
                for( var i = 0; i < self.invaders.length; i++ ){
                    // add down movement to ivaders
                    self.invaders[i].update( 0, self.downStep );
                    bottom = self.invaders[i].getBottom();
                    // get lowest
                    if( bottom > bottomMaximum ){
                        bottomMaximum = bottom;
                    }
                } 
                // done get underside of the living invaders group
                
                // check if invaders hit bunkers
                jsProject.setValue( "invadersBottom", "game", bottomMaximum );
                jsProject.callEvent( "checkInvaderBunkerHit" );
                // done check if invaders hit bunkers
                
                if( bottomMaximum > self.killLine ){
                    jsProject.callEvent( "invadersOnKillLine" );
                }
                // reverse direction
                self.updateDirection = -self.updateDirection;
                
            } // done check if invaders hit the right or left side
            else {
                // add side movement to ivaders
                for( var i = 0; i < self.invaders.length; i++ ){
                    self.invaders[i].update( self.updateDirection * self.sideStep, 0 );
                }            
                // done add side movement to ivaders
            }
            
            
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