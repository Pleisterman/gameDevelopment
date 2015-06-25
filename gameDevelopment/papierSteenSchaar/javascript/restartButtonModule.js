/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls a restart button for the game Rock-Paper-Scissors
 *          the restart button is displayed on the left in the middle of the button column
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
    gameDevelopment.restartButtonModule = function( ) {


    /*
     *  module restartButtonModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          show                    called by the public function
     *          enable                  called by the public function, and event subscription gameStart
     *          disable                 called by the public function, and event subscription gamestop
     *          mouseOver               called by html button
     *          mouseOut                called by html button
     *          playOverSound           called by mouseOver function
     *          click                   called by html button
     *          playClickSound          called by click function
     *     public:
     *          show   
     *          enable  
     *          
     *  event subscription: 
     *      gameStop                    called from gameModule
     *      gameStart                   called from gameFlowModule
     *          
     */
    
        // private
        var self = this;
        self.MODULE = 'restartButtonModule';
        self.debugOn = false;
        self.visible = false;                       // visibility
        self.width = 54;                            // constant, store position
        self.height = 54;                           // constant, store position
        self.enabled = true;                        // store enabled
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();

            // subscribe to events
            jsProject.subscribeToEvent( 'gameStop', self.disable );
            jsProject.subscribeToEvent( 'gameStart', self.enable );
            // done subscribe to events
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            
            var html = '';
            // add css
            html += '<style>' + "\n";
            html += ' .restartButton { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/restartButton.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .restartButtonOver { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/restartButtonOver.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .restartButtonDisabled { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/restartButtonDisabled.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += '</style>' + "\n";
            // done add css
                
            
            // add button
            html += '<div id="restartButton" class="restartButtonDisabled" ';
                html += ' style="position:absolute;height:50px;width:50px;z-index:' + jsProject.getValue( "gameControls", "zIndex" ) + ';background-color:transparent; ';
                 html += ' cursor:hand;cursor:pointer;background-repeat:no-repeat;background-position:center center;';
                html += ' "';
            html += '>';
            html += '</div>';
            // done add button

            // add to scene
            $('#jsProjectScene').append( html );
            // hide button
            $('#restartButton').hide();
        };
        self.enable = function( ) {
            self.enabled = true;
            // set the class
            $("#restartButton" ).attr( "class", "restartButton" );
            // add the button events
            $("#restartButton" ).mouseenter( function(){ self.mouseOver(); } );
            $("#restartButton" ).mouseleave( function(){ self.mouseOut(); } );
            $("#restartButton" ).click( function(){ self.click(); } );
            // done add the button events
        };
        self.disable = function(  ) {
            self.enabled = false;
            // set the class
            $("#restartButton" ).attr( "class", "restartButtonDisabled" );
            // remove the button events 
            $("#restartButton" ).off();
        };
        self.mouseOver = function( ) {
            if( !self.enabled ) {
                return;
            }
            // set the class
            $("#restartButton" ).attr( "class", "restartButtonOver" );
            // play sound
            self.playOverSound();
        };
        self.mouseOut = function( ) {
            if( !self.enabled ) {
                return;
            }
            // set class
            $("#restartButton" ).attr( "class", "restartButton" );
        };
        self.playOverSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound
            var sound = jsProject.getResource( 'gameControlsOver', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound
            
        };
        self.click = function(){
            if( !self.enabled ) {
                return;
            }
            self.enabled = false;
            //set the class
            $("#restartButton" ).attr( "class", "restartButtonDisabled" );
            // play sound
            self.playClickSound();
            // call event
            jsProject.callEvent( "restartGame" );
        };
        self.playClickSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound
            var sound = jsProject.getResource( 'gameControlsClick', 'sound' );
            if( sound ){
                sound.play();
            }
        };
        self.show = function( visible ){
            if( visible ){
                self.visible = true;
                $('#restartButton').show();
            }
            else {
                self.visible = false;
                $('#restartButton').hide();
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
            show : function( visible ) {
                self.show( visible );
            },
            enable : function( enable ){
                if( enable ){
                    self.enable();
                }
                else {
                    self.disable();
                }
            }
        };
    };
})( gameDevelopment );