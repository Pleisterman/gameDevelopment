/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module contains the bombs for the application space invaders
 *          the bombs are created through the jsProject event releaseBomb
 *          this module controls the layout, animation and update for the bombs
 *            
 * Last revision: 18-05-2015
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
    gameDevelopment.bombsModule = function( ) {
        /*
         *  module bombsModule 
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
         *      releaseBomb             called from invadersModule
         *          
         */
    
        // private
        var self = this;
        self.MODULE = 'bombsModule';
        self.debugOn = false;
        self.visible = false;               // visibility
        self.canvasSurface = null;          // canvas surface to draw on
        self.maximumBombs = 20;             // set by jsProjet value maximumBombs
        self.bombs = [];                    // bomb array
        self.animationDelay = 40;           // ms >= updateDelay
        self.lastAnimationDate = 0;         // save last animation time for delay
        self.updateDelay = 40;              // ms <= animationDelay
        self.lastUpdateDate = 0;            // save last update time for delay    
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'bombsDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'releaseBomb', self.releaseBomb );
            // done subscribe to events
            
        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );

                // get maximumBombs
                self.maximumBombs = jsProject.getValue( "maximumBombs", "level" );
                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // remove existing bombs
                while( self.bombs.length ){
                    self.bombs.pop();
                }
                //done remove existing bombs
                
                // clear the whole canvas
                self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  

                // remove the event callback of the bombs
                jsProject.setValue( "bombCollisionDetect", "game", null );
            }
        };
        self.releaseBomb = function( ) {
            // check maximum bombs
            if( self.bombs.length < self.maximumBombs ){
                // create new bomb
                var bombType = jsProject.getValue( "bombType", "game" );
                switch( bombType ) {
                    case 1 : { 
                        // create bomb one
                        var bomb = new gameDevelopment.bombOneModule();
                        bomb.layoutChange();
                        bomb.animate();
                        // add bomb to array
                        self.bombs.push( bomb );
                        // done create bomb one
                        break;
                    }
                    case 2 : { 
                        // create bomb two
                        self.debug( 'create bomb 2' );
                        var bomb = new gameDevelopment.bombTwoModule();
                        bomb.layoutChange();
                        bomb.animate();
                        // add bomb to array
                        self.bombs.push( bomb );
                        // done create bomb two
                        break;
                    }
                    default: {
                        self.debug( "unknown bombType." );
                    }
                }           
                // done create new bomb
            }
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;
            
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
            
            // change the layout according to new dimensions for the bombs
            for( var i = 0; i < self.bombs.length; i++ ){
                self.bombs[i].layoutChange();
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
            for( var i = 0; i < self.bombs.length; i++ ){
                self.bombs[i].clearRect();
            }            
            // done clearRect bombs
             
            // animate bombs
            for( var i = 0; i < self.bombs.length; i++ ){
                self.bombs[i].animate();
            }            
            // done animate bombs
            
        };
        self.update = function(){
            // check for delay
            var date = new Date();
            if( date - self.lastUpdateDate < self.updateDelay ){
                return;
            }
            // done delay
            self.lastUpdateDate = date;

            // save bombs alive
            var bombsLeft = [];
            for( var i = 0; i < self.bombs.length; i++ ){
                self.bombs[i].update();
                // check bomb still alive
                if( self.bombs[i].isAlive() ){
                    bombsLeft.push( self.bombs[i] );
                }
            }
            // keep the alive buttons
            self.bombs = bombsLeft;
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