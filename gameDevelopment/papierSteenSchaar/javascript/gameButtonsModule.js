/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the game buttons for the game Rock-Paper-Scissors
 *          the module contains the exit, restart and sound button
 *          the module controls the position of these buttons
 *          
 * Last revision: 02-06-2015
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
    gameDevelopment.gameButtonsModule = function( ) {


    /*
     *  module gameButtonsModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          exit                    callback for the exit button
     *          show                    called from the public function    
     *          sceneChange             called from event subsription playingFieldChanged
     *          show                    called from the public function
     *          debug
     *     public:
     *          show     
     *          
     *  event subscription: 
     *      playingFieldChanged         called from playingfieldModule
     */
    
        // private
        var self = this;
        self.MODULE = 'gameButtonsModule';
        self.debugOn = false;
        self.visible = false;                   // visibility
        self.exitButton = null;                 // store the exit button module
        self.restartButton = null;              // store the restart button module
        self.soundButton = null;                // store the sound button module
        self.buttonOffsetLeft = 30;             // px constant, store position
        self.buttonOffsetTop = 210;             // px constant, store position
        self.buttonSpacing = 5;                 // px constant, store position
        self.buttonWidth = 54;                  // px constant, store dimension
        self.buttonHeight = 54;                 // px constant, store dimension

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // create modules
            self.exitButton = new gameDevelopment.exitButtonModule( self.exit );
            self.restartButton = new gameDevelopment.restartButtonModule();
            self.soundButton = new gameDevelopment.soundButtonModule( );
            // done create modules

            // subscribe to events
            jsProject.subscribeToEvent( 'playingFieldChanged', self.sceneChange );
        };
        self.exit = function( ){
            // call event
            jsProject.callEvent( "exit" );
        };
        self.show = function( visible ){
            self.visible = visible;
            // show the modules
            self.exitButton.show( visible );
            self.restartButton.show( visible );
            self.soundButton.show( visible );
            // done show the modules
            
            if( self.visible ){
                // call sceneChange to set the positions
                self.sceneChange();
            }
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );

            // calculate positions
            var top = parseInt( $( '#playingfield' ).position().top ) + self.buttonOffsetTop;
            var left = parseInt( $( '#playingfield' ).position().left ) + self.buttonOffsetLeft;
            // done calculate positions
            
            // set positions
            $('#exitButton').css( 'top', top + "px" );
            $('#exitButton').css( 'left', left + "px" );
            top += self.buttonHeight + self.buttonSpacing;
            $('#restartButton').css( 'top', top + "px" );
            $('#restartButton').css( 'left', left + "px" );
            top += self.buttonHeight + self.buttonSpacing;
            $('#soundButton').css( 'top', top + "px" );
            $('#soundButton').css( 'left', left + "px" );
            // done set positions
            
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