/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module an exit button for the game Rock-Paper-Scissors
 *          the exit button is displayed on top of the left coumn of buttons on the screen
 *          positions are controlled by the gameButtonsModule
 *          
 * Last revision: 03-06-2015
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
    gameDevelopment.exitButtonModule = function( clickCallback ) {


    /*
     *  module exitButtonModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          mouseOver               called by button html
     *          playOverSound           called by function mouseOver
     *          click                   called by button html
     *          show                    called by public function
     *          debug
     *     public:
     *          show     
     */
    
        // private
        var self = this;
        self.MODULE = 'exitButtonModule';
        self.debugOn = false;
        self.clickCallback = clickCallback;             // store the callback
        self.visible = false;                           // visibility
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            
            var html = '';
            // add css
            html += '<style>' + "\n";
                html += ' .exitButton { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/exitButton.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .exitButton:hover { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/exitButtonOver.png);' + "\n";
                html += '  }' + "\n" + "\n";
            html += '</style>' + "\n";
            // done add css
                
            
            // add button
            html += '<div id="exitButton" class="exitButton" ';
                html += ' style="position:absolute;height:50px;width:50px;z-index:' + jsProject.getValue( "gameControls", "zIndex" ) + ';background-color:transparent; ';
                 html += ' cursor:hand;cursor:pointer;background-repeat:no-repeat;background-position:center center;';
                html += ' "';
            html += '>';
            html += '</div>';
            // done add button
            
            // add to scene
            $('#jsProjectScene').append( html );
            // hide button
            $('#exitButton').hide();
            
            // set button events
            $("#exitButton" ).mouseenter( function(){ self.mouseOver(); } );
            $("#exitButton" ).click( function(){ self.click(); } );
            // done set button events
            
        };
        self.mouseOver = function( ) {
            // play sound
            self.playOverSound();
        };
        self.playOverSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound 
            var sound = jsProject.getResource( 'gameControlsExitOver', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound 
        };
        self.click = function(){
            // play exit sound
            if( jsProject.getValue( "on", "sound" ) ){
                var exitSound = jsProject.getResource( 'exit', 'sound' );
                if( exitSound ){
                    exitSound.play();
                }
            }
            // done play exit sound
            
            // call the provided callback
            self.clickCallback();
        };
        self.show = function( visible ){
            if( visible ){
                self.visible = true;
                $('#exitButton').show();
            }
            else {
                self.visible = false;
                $('#exitButton').hide();
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
            }
        };
    };
})( gameDevelopment );