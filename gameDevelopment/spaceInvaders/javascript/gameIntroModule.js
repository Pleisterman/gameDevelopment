/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the game intro for the application space invaders
 *          the intro shows an automatic play of the game 
 *          
 * Last revision: 18-05-2015
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       ready
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
    gameDevelopment.gameIntroModule = function( ) {

    /*
     *  module gameIntroModule 
     *   
     *  functions: 
     *      private:
     *          construct       called internal 
     *          start           called by public fucntion 
     *          stop            called by public fucntion
     *          update          called by timer
     *          debug
     *      public:
     *          start
     *          stop 
     */
    
        // private
        var self = this;
        self.MODULE = 'gameIntroModule';
        self.debugOn = false;
        
        self.visible = false;           // visibiltity
        self.moveCount = 0;             // store number of moves to make
        self.moveState = 0;             // store wich move direction
        self.bulletCount = 0;           // store number of bullets to fire
        self.bulletWait = 0;            // store time to wait for next shot
        self.updateInterval = null;     // timer object
        self.updateDelay = 100;         // ms
     
        self.highScoresVisible = false;
        self.highScoresLastAnimationDate = 0;
        self.showHighScoresDelay = 10000;
        self.showHighScoresLength = 10000;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
        };
        self.start = function( ){
            self.debug( 'start' );
            var date = new Date();
            self.highScoresLastAnimationDate = date;
            
            // set the timer
            if( self.updateInterval ){
                clearInterval( self.updateInterval );
                self.updateInterval = null;
            }
            self.updateInterval = setInterval( function () {  self.update(); }, self.updateDelay );
        };
        self.stop = function( ){
            self.debug( 'stop' );
            // stop the timer
            if( self.updateInterval ){
                clearInterval( self.updateInterval );
                self.updateInterval = null;
            }
            //done stop the timer
            
            jsProject.callEvent( "hideHighScores" );

        };
        self.update = function( ){
            self.showHighScores();
            // do movement
            if( self.moveCount > 0 ){
                //debug( 'setState:' + self.shipMoveStates[ self.shipMoveState ] );
                switch( self.moveState ){
                    case 0 : {
                        // move right    
                        jsProject.callEvent( "shipMoveRight" );
                        break;
                    }
                    case 1 : {
                        // move left    
                        jsProject.callEvent( "shipMoveLeft" );
                        break;
                    }
                    case 2 : {
                        // stop    
                        jsProject.callEvent( "shipMoveStop" );
                        break;
                    }
                }
                self.moveCount--;
            // done do movement
            }
            else {
                // create new movement pattern
                self.moveState = parseInt( Math.random() * 3 );
                self.moveCount = parseInt( Math.random() * 20 );
                // done create new movement pattern
            }
            
            if( self.bulletWait <= 0 ){
                if( self.bulletCount > 0 ){
                    // fire bullet shots
                    jsProject.callEvent( "shipFireBullet" );
                    jsProject.callEvent( "shipFireBulletStop" );
                    self.bulletCount--;
                }
                else{
                    // create bullet shots
                    self.bulletWait = parseInt( Math.random() * 10 );
                    self.bulletCount = parseInt( Math.random() * 30 );
                }
            }
            else {
                // wait
                self.bulletWait--;
            }
            
        };
        self.showHighScores = function( ){
            var date = new Date();
            if( self.highScoresVisible ){
                // check for delay
                if( date - self.highScoresLastAnimationDate < self.showHighScoresLength ){
                    return;
                }
                self.highScoresVisible = false;
                jsProject.callEvent( "hideHighScores" );
                
            }
            else {
                if( date - self.highScoresLastAnimationDate < self.showHighScoresDelay ){
                    return;
                }
                jsProject.callEvent( "showHighScores" );
                self.highScoresVisible = true;
            }
            // done delay
            self.highScoresLastAnimationDate = date;
            
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
            start : function( ){
                self.start();
            },
            stop : function( ){
                self.stop();
            }
        };
    };
})( gameDevelopment );