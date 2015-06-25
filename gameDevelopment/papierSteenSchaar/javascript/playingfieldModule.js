/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the background and the canvas for the game Rock-Paper-Scissors
 *          the module starts with a intro 
 *          when the intro is ready a playingfield is shown where in buttons, menus and hands are displayed in
 *          the playingfield consumes the sceneChange event, the playingfields dimensions are set and the payingfield change event
 *          is called that is consumed by the buttons menus and hands to set their position
 *          when exiting the game an exit animation is played
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
    gameDevelopment.playingfieldModule = function( ) {


    /*
     *  module playingfieldModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          show                    called by the public function
     *          introStep               called by a timer              
     *          introReady              called by introStep function
     *          exitStep                called by a timer
     *          exitReady               called by exitStep function
     *          sceneChange             called by the event subscription sceneChange
     *          draw                    called by sceneChange function    
     *          debug
     *     public:
     *          show     
     *           
     *  event subscription: 
     *      sceneChange              called from main
     */
    
        // private
        var self = this;
        self.MODULE = 'playingfieldModule';
        self.debugOn = false;
        self.visible = false;                       // visibility
        self.canvasSurface = null;                  // store the canvas surface to draw on
        self.borderWidth = 40;                      // constant, store the border width drawn around the playingfield 
        self.timer = null;                          // store the timer
        self.introDelay = 10;                       // constant, store the delay for the intro
        self.exitDelay = 10;                        // constant, store the delay for the exit
        self.opacity = 0.1;                         // store the opacity of the playingfield for intro exit animation
        self.width = 520;                           // constant, store the position
        self.height = 400;                          // constant, store the position
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'sceneChange', self.sceneChange );
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
            // add the background
            html += '<div id="background" ';
            html += ' style="position:absolute;top:0px;left:0px;z-index:' + jsProject.getValue( "playingfield", "zIndex" ) + ';background-color:white;border:5px white solid;"';
            html += '>';
            html += '</div>';
            // done add the background
            
            // add canvas
            html += '<canvas id="playingfield" ';
                html += ' style="position:absolute;top:3px;left:0px;z-index:61;background-color:white; ';
                html += ' background-image:url(./papierSteenSchaar/images/playfieldBackground.png);';
                html += ' "';
            html += '>';
            html += '</canvas>';
            // done  add canvas

            // add to scene
            $('#jsProjectScene').append( html );
            
            // hide
            $('#background').hide();
            $('#playingfield').hide();
            // done hide
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById('playingfield').getContext('2d');
        };
        self.show = function( visible ) {
            if( visible ) {
                // already visible
                if( self.visible ) {
                    return;
                }
                // done already visible
                self.debug( 'show' );
                
                self.visible = true;
                // call sceneChange to set the positions
                self.sceneChange();
                
                // get ready for animation
                $('#background').css( "opacity", self.opacity );
                $('#background').show();
                $('#playingfield').css( "opacity", self.opacity );
                $('#playingfield').show();
                // done get ready for animation
                 
                // play the intro sound
                if( jsProject.getValue( "on", "sound" ) ){
                    var sound = jsProject.getResource( 'intro', 'sound' );
                    if( sound){
                        sound.play();
                    }
                }
                // done play the intro sound
                
                // start intro timer
                self.timer = setTimeout( function () { self.introStep(); }, self.introDelay );
            }
            else {
                // start exit timer
                self.timer = setTimeout( function () { self.exitStep(); }, self.exitDelay );
            }
        };
        self.introStep = function( ) {
            // clear the timer
            clearTimeout( self.timer );
            // change opacity 0 -> 1
            if( self.opacity < 1 ){
                self.opacity += 0.1;
                // set opacity of background
                $('#background').css( "opacity", self.opacity );
                // set opacity of canvas
                $('#playingfield').css( "opacity", self.opacity );
                // start timer
                self.timer = setTimeout( function () { self.introStep(); }, self.introDelay );
            }
            else {
                // intro ready
                self.introReady();
            }
        };
        self.introReady = function(){
            self.debug( 'introReady' );
            // call event
            jsProject.callEvent( "introReady" );
        };
        self.exitStep = function( ) {
            // clear the timer
            clearTimeout( self.timer );
            // change opacity 1 -> 0
            if( self.opacity > 0.1 ){
                self.opacity -= 0.1;
                // set opacity of background
                $('#background').css( "opacity", self.opacity );
                // set opacity of canvas
                $('#playingfield').css( "opacity", self.opacity );
                // start timer
                self.timer = setTimeout( function () { self.exitStep(); }, self.exitDelay );
            }
            else {
                // exit ready
                self.exitReady();
            }
        };
        self.exitReady = function(){
            self.debug( 'exitReady' );
            self.visible = false;
            // hide
            $('#background').hide();
            $('#playingfield').hide();
            // done hide
            
            // call event
            jsProject.callEvent( "exitReady" );
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );
            
            // calculate position
            var width = $( document.body ).width();
            var height = $( '#main' ).height() + $( '#main' ).position().top + 5;
            var left = ( width -  self.width ) / 2;
            // done calculate position

            // set postiions
            $( '#playingfield' ).css( 'top', '50px' );    
            $( '#playingfield' ).css( 'left', left + 'px' );    
            $( '#playingfield' ).css( 'width', self.width + 'px' );    
            $( '#playingfield' ).css( 'height', self.height + 'px' ); 
            $( '#background' ).css( 'width', width + 'px' );    
            $( '#background' ).css( 'height', height + 'px' ); 
            // done set postiions
            
            // set canvas dimensions
            self.canvasSurface.canvas.width = self.width;
            self.canvasSurface.canvas.height = self.height;
            // done set canvas dimensions
            
            // draw playing fiels
            self.draw();
            
            // call event to set positions of buttons, menus and hands
            jsProject.callEvent( "playingFieldChanged" );
        };
        self.draw = function(){
            self.debug( 'draw' );
            
            var width = $( '#playingfield' ).width();
            var height = $( '#playingfield' ).height();
            var lineWidth = 10;
            var top = 0, left = 0, right = 0, bottom = 0;
            
            // draw outer rect
            self.canvasSurface.strokeStyle = "#ffffff";
            self.canvasSurface.lineWidth = 20;
            self.canvasSurface.beginPath();
            
            top = 0;
            left = 0;
            self.canvasSurface.moveTo( 0, 0 );
            
            left = width;
            self.canvasSurface.lineTo( width, 0 );
            self.canvasSurface.lineTo( width , height );
            self.canvasSurface.lineTo( 0 , height );
            self.canvasSurface.lineTo( 0, 0 );
            self.canvasSurface.stroke();
            // done draw outer rect
            
            // draw inner rect
            self.canvasSurface.strokeStyle = "#000000";
            self.canvasSurface.lineWidth = lineWidth;
            self.canvasSurface.beginPath();
            
            top = lineWidth / 2;
            left = self.borderWidth + lineWidth / 2;
            self.canvasSurface.moveTo( left, top );
            
            left = width - ( self.borderWidth + ( lineWidth / 2 ) );
            self.canvasSurface.lineTo( left, top );
            self.canvasSurface.quadraticCurveTo( left + self.borderWidth, top, left + self.borderWidth, top + self.borderWidth );
            bottom = height - ( self.borderWidth + ( lineWidth / 2 ) ); 
            self.canvasSurface.lineTo( left + self.borderWidth, bottom );
            self.canvasSurface.quadraticCurveTo( left + self.borderWidth, bottom + self.borderWidth, left, bottom + self.borderWidth );
            left = lineWidth / 2;
            self.canvasSurface.lineTo( left + self.borderWidth, bottom + self.borderWidth );
            self.canvasSurface.quadraticCurveTo( left, bottom + self.borderWidth, left, bottom );
            self.canvasSurface.lineTo( left, self.borderWidth );
            self.canvasSurface.quadraticCurveTo( left, top, left + self.borderWidth, top );
            self.canvasSurface.stroke();
            // done draw inner rect
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