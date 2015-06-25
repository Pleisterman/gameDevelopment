/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module contains the bullets for the application space invaders
 *          the bullets are created through the jsProject event fireBullet
 *          this module controls the layout, animation and update for the bullets
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
    gameDevelopment.bulletsModule = function( ) {
        /*
         *  module bulletsModule 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          fire                called from event subscription
         *          layoutChange        called from event subscription
         *          animate             called from layoutChange and event subscription
         *          update              called from animate
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      animate                 called from gameModule
         *      layoutChange            called from gameLayoutModule
         *      fireBullet              called from playerModule / gameIntroModule
         *          
         */
    
        // private
        var self = this;
        self.MODULE = 'bulletsModule';
        self.debugOn = true;
        self.visible = false;           // visibility
        self.canvasSurface = null;      // canvas surface to draw on
        self.maximumBullets = 4;        // set by jsProject value level->maximumBullets
        self.minimumBullets = 4;        // set by jsProject value level->minimumbullets
        self.bulletCount = 4;           // counted bullets, set to minimum after lifeLost
        self.bullets = [];              // bullet array
        self.animationDelay = 10;       // ms >= updateDelay
        self.lastAnimationDate = 0;     // save last animation time for delay
        self.updateDelay = 10;          // ms <= animationDelay
        self.lastUpdateDate = 0;        // save last update time for delay    
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'bulletsDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'fireBullet', self.fire );
            jsProject.subscribeToEvent( 'addBullet', self.addBullet );
            jsProject.subscribeToEvent( 'lifeLost', self.lifeLost );
            // done subscribe to events
            
        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                
                self.bulletCount = jsProject.getValue( "bullets", "game" );
                // set level values
                self.minimumBullets = jsProject.getValue( "minimumBullets", "level" );
                if( self.bulletCount < self.minimumBullets ){
                    self.bulletCount = self.minimumBullets;
                    jsProject.setValue( "bullets", "game", self.bulletCount );
                }
                self.maximumBullets = jsProject.getValue( "maximumBullets", "level" );
                // done set level values
                
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // remove existing bullets
                while( self.bullets.length ){
                    self.bullets.pop();
                }
                //done remove existing bullets
                
                // clear the whole canvas
                self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
                
                // remove the event callback of the bullets
                jsProject.setValue( "bulletCollisionDetect", "game", null );
            }
        };
        self.fire = function( ) {
            if( !self.visible ){
                return;
            }
            // check maximum bullets
            if( self.bullets.length < self.bulletCount ){
                // create new bullet
                var bulletType = jsProject.getValue( "bulletType", "game" );
                switch( bulletType ) {
                    case 1 : { 
                        // create basic bullet
                        var bullet = new gameDevelopment.bulletOneModule();
                        self.bullets.push( bullet );
                        self.bullets[self.bullets.length - 1].layoutChange();
                        self.bullets[self.bullets.length - 1].animate();
                        // done create basic bullet
                        break;
                    }
                    default: {
                        self.debug( "unknown bulletType." );
                    }
                }           
                // done create new bullet
            }
        };
        self.addBullet = function( ) {
            if( self.bulletCount < self.maximumBullets ){
                self.bulletCount++;
                jsProject.setValue( "bullets", "game", self.bulletCount );
                jsProject.callEvent( "bulletAdded" );
            }
        };
        self.lifeLost = function( ){
            self.bulletCount = self.minimumBullets;
            jsProject.setValue( "bullets", "game", self.bulletCount );
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;
            
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            
            // change the layout according to new dimensions for the bullets
            for( var i = 0; i < self.bullets.length; i++ ){
                self.bullets[i].layoutChange();
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

            // update
            self.update();

            // clearRect bombs
            for( var i = 0; i < self.bullets.length; i++ ){
                self.bullets[i].clearRect();
            }            
            // done clearRect bombs

            // animate bullets
            for( var i = 0; i < self.bullets.length; i++ ){
                self.bullets[i].animate();
            }            
            // done animate bullets
            
        };
        self.update = function(){
            // check for delay
            var date = new Date();
            if( date - self.lastUpdateDate < self.updateDelay ){
                return;
            }
            // done delay
            self.lastUpdateDate = date;

            // save bullets alive
            var bulletsLeft = [];
            for( var i = 0; i < self.bullets.length; i++ ){
                self.bullets[i].update();
                // check bullet still alive
                if( self.bullets[i].isAlive() ){
                    bulletsLeft.push( self.bullets[i] );
                }
            }
            // keep the alive bullets
            self.bullets = bulletsLeft;
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