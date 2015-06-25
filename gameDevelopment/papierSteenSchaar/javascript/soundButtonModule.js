/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls a toggle button for the sound on / off for the game Rock-Paper-Scissors
 *          positions are controlled by the gameButtonsModule
 *          
 * Last revision: 01-06-2015
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
    gameDevelopment.soundButtonModule = function( ) {


    /*
     *  module soundButtonModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          mouseOver               called by html button
     *          mouseOut                called by html button    
     *          playOverSound           called by mouseOver function
     *          click                   called by html button 
     *          playClickSound          called by click function
     *          show                    called by the public function
     *          debug
     *     public:
     *          show     
     *          
     */
    
        // private
        var self = this;
        self.MODULE = 'soundButtonModule';
        self.debugOn = false;
        self.visible = false;                   // visibility
        self.soundLoaded = false;               // store if sound is loaded
        self.soundOn = true;                    // store if sound is on
        
        
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
            html += ' .soundButtonOn { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/soundButtonOn.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .soundButtonOnOver { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/soundButtonOnOver.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .soundButtonOff { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/soundButtonOff.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .soundButtonOffOver { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/soundButtonOffOver.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += ' .soundButtonDisabled { ' + "\n";
            html += '    background-image:url(./papierSteenSchaar/images/soundButtonDisabled.png);' + "\n";
            html += '  }' + "\n" + "\n";
            html += '</style>' + "\n";
            // done add css
                
            
            // add button
            html += '<div id="soundButton" ';
                html += ' style="position:absolute;height:50px;width:50px;z-index:' + jsProject.getValue( "gameControls", "zIndex" ) + ';background-color:transparent; ';
                 html += ' cursor:hand;cursor:pointer;background-repeat:no-repeat;background-position:center center;';
                html += ' "';
            html += '>';
            html += '</div>';
            // done add button
            
            // add to scene
            $('#jsProjectScene').append( html );
            // hide button
            $('#soundButton').hide();
            
            // set button events
            $("#soundButton" ).mouseenter( function(){ self.mouseOver(); } );
            $("#soundButton" ).mouseleave( function(){ self.mouseOut(); } );
            $("#soundButton" ).click( function(){ self.click(); } );
            // done set button events
        };
        self.mouseOver = function( ) {
            // no sound loaded, button disabled 
            if( !self.soundLoaded ){ 
                return;
            }
            // done no sound loaded, button disabled 

            // play over sound
            self.playOverSound();
            
            // set the class
            if( self.soundOn ){
                $("#soundButton" ).attr( "class", "soundButtonOnOver" );
            }
            else {
                $("#soundButton" ).attr( "class", "soundButtonOffOver" );
            }
            // done set the class
            
        };
        self.mouseOut = function( ) {
            // no sound loaded, button disabled 
            if( !self.soundLoaded ){ 
                return;
            }
            // done no sound loaded, button disabled 

            // set the class
            if( self.soundOn ){
                $("#soundButton" ).attr( "class", "soundButtonOn" );
            }
            else {
                $("#soundButton" ).attr( "class", "soundButtonOff" );
            }
            // done set the class
        };
        self.playOverSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            //done  no sound
            
            // play sound
            var sound = jsProject.getResource( 'gameControlsOver', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound
            
        };
        self.click = function(){
            // no sound loaded, button disabled 
            if( !self.soundLoaded ){ 
                return;
            }
            // done no sound loaded, button disabled 
            
            // play sound
            self.playClickSound();
            
            if( self.soundOn ){
                self.soundOn = false;
                // set project value
                jsProject.setValue( "on", "sound", false );
                // set the class
                $("#soundButton" ).attr( "class", "soundButtonOffOver" );
            }
            else {
                self.soundOn = true;
                // set project value
                jsProject.setValue( "on", "sound", true );
                // set the class
                $("#soundButton" ).attr( "class", "soundButtonOnOver" );
            }
            
        };
        self.playClickSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            //done  no sound
            
            // play sound
            var sound = jsProject.getResource( 'gameControlsClick', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound
        };
        self.show = function( visible ){
            if( visible ){
                self.visible = true;
                
                // get project values
                self.soundLoaded = jsProject.getValue( "load", "sound" );
                self.soundOn = jsProject.getValue( "on", "sound" );
                // done get project values
                 
                // disable no sound loaded
                if( !self.soundLoaded ){
                    $("#soundButton" ).attr( "class", "soundButtonDisabled" );
                }
                else {
                    // set the class
                    if( self.soundOn ){
                        $("#soundButton" ).attr( "class", "soundButtonOn" );
                    }
                    else {
                        $("#soundButton" ).attr( "class", "soundButtonOff" );
                    }
                    // done set the class
                }
                $('#soundButton').show();
            }
            else {
                self.visible = false;
                $('#soundButton').hide();
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