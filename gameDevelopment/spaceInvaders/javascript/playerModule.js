/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module constrols player modules for the application space invaders
 *          controls key captures and calls the events,
 *          controls the ship and lives and bullets module 
 *          
 * Last revision: 24-05-2015
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
    gameDevelopment.playerModule = function( ) {

        /*
         *  module playerModule 
         *      
         *  functions: 
         *      private:
         *          construct               called internal
         *          show                    called by the public function
         *          createShip              called from the show function
         *          activateKeys            called from the construct function
         *          activateUserControls    called by the public function
         *          shipFireBullet          called from key press event set during activateUserControls function
         *          shipFireBulletStop      called from key press event set during activateUserControls function
         *          shipMoveLeft            called from key press event set during activateUserControls function
         *          shipMoveRight           called from key press event set during activateUserControls function
         *          shipMoveStop            called from key press event set during activateUserControls function
         *          debug
         *      public:
         *          show 
         *          activateUserControls
         *          
         *  event calls
         *      rightKeyPressed             called on keyDown keyCode 37 = right arrow 
         *      leftKeyPressed              called on keyDown keyCode 39 = left arrow
         *      spaceKeyPressed             called on keyDown keyCode 32 = space bar
         *      controlKeyPressed           called on keyDown keyCode 17 = control key
         *      keyUp                       called on keyUp
         */
    
        // private
        var self = this;
        self.MODULE = 'playerModule';
        self.debugOn = false;
        self.ship = null;               // store the shipModule
        self.lives = null;              // store the livesModule
        self.bullets = null;            // store the bulletsModule
        self.shipType = 0;              // integer, store the ship type
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // construct modules
            self.lives = new gameDevelopment.livesModule();
            self.bullets = new gameDevelopment.bulletsModule();
            // done construct modules
            
            self.activateKeys();
        };
        self.show = function( visible ){
            if( visible ){
                self.debug( 'show' );

                // show modules`   
                self.createShip();
                self.ship.show( visible );
                self.lives.show( visible );
                self.bullets.show( visible );
                // show modules`   
                

            }
            else {
                // hide modules`   
                self.ship.show( visible );
                self.lives.show( visible );
                self.bullets.show( visible );
                // hide modules`   
                
            }
        };
        self.createShip = function(){
            // create new ship if type changed or not created
            var shipType = jsProject.getValue( "shipType", "level" );
            if( self.shipType !== shipType ){
                self.shipType = shipType;
                // remove the old ship
                if( self.ship ){
                    self.ship.destruct();
                }
                switch( shipType ) {
                    case 1 : { 
                        // create ship type 1
                        self.ship = new gameDevelopment.shipOneModule();;
                        // done create ship type 1
                        break;
                    }
                    default: {
                        self.debug( "unknown shipType." );
                    }
                }           
            }
            // done create new ship if type changed or not created
        };
        self.activateKeys = function(){
            // set events
            // events are always on, only when a function is defined in jsProject value
            // keyPressEvents -> event the given function will be executed
            $(document).keydown(function( event ) {
                self.debug( 'press' +  event.keyCode );
                if( event.keyCode === 37 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "right", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event.keyCode === 39 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "left", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event.keyCode === 32 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "spacebar", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event.keyCode === 17 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "control", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
            });
            $(document).keyup(function( event ) {
                if( event.keyCode === 37 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "rightUp", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event.keyCode === 39 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "leftUp", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event.keyCode === 32 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "spacebarUp", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
                if( event && event.keyCode === 17 ){
                    event.preventDefault();
                    var event = jsProject.getValue( "controlUp", "keyPressEvents" );
                    if( event) {
                        event();
                    }
                    return;
                }
            });
            // done set events
        };
        self.activateUserControls = function( active ){
            if( active ){
                // set the key press events
                jsProject.setValue( "spacebar", "keyPressEvents", self.shipFireBullet );
                jsProject.setValue( "spacebarUp", "keyPressEvents", self.shipFireBulletStop );
                jsProject.setValue( "left", "keyPressEvents", self.shipMoveLeft );
                jsProject.setValue( "leftUp", "keyPressEvents", self.shipMoveStop );
                jsProject.setValue( "right", "keyPressEvents", self.shipMoveRight );
                jsProject.setValue( "rightUp", "keyPressEvents", self.shipMoveStop );
                // done set the key press events
            }
            else {
                // remove the key press events
                jsProject.setValue( "spacebar", "keyPressEvents", null );
                jsProject.setValue( "spacebarUp", "keyPressEvents", null );
                jsProject.setValue( "left", "keyPressEvents", null );
                jsProject.setValue( "leftUp", "keyPressEvents", null );
                jsProject.setValue( "right", "keyPressEvents", null );
                jsProject.setValue( "rightUp", "keyPressEvents", null );
                // done remove the key press events
            }
        };
        self.shipFireBullet = function(){
            jsProject.callEvent( "shipFireBullet" );
        };
        self.shipFireBulletStop = function(){
            jsProject.callEvent( "shipFireBulletStop" );
        };
        self.shipMoveLeft = function(){
            jsProject.callEvent( "shipMoveLeft" );
        };
        self.shipMoveRight = function(){
            jsProject.callEvent( "shipMoveRight" );
        };
        self.shipMoveStop = function(){
            jsProject.callEvent( "shipMoveStop" );
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
            activateUserControls : function( active ){
                self.activateUserControls( active );
            }
        };
    };
})( gameDevelopment );