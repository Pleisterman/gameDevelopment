/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this file controls the drawing and events of the exitButton for the application space invaders
 * 
 * Last revision: 17-05-2015
 * 
 * Status:   code:               ready
 *           comments:           ready
 *           memory:             ready
 *           development:        implement background image or some styling    
 * 
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
         *          addHtml                 called internal
         *          show                    called by public fucntion
         *          mouseOver               called internal
         *          click                   called internal
         *          layoutChange            called by event subscription
         *          animate                 called by the layoutChange event and the event subscription
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      layoutChange                called from gameLayoutModule
         *      animate                     called from gameModule
         */
    
        // private
        var self = this;
        self.MODULE = 'exitButtonModule';
        self.debugOn = false;
        self.name = 'exitButton';                // name of the button for html id
        self.canvasSurface = null;               // store the surface to draw on
        self.clickCallback = clickCallback;      // store the callback
        self.visible = false;                    // visibiltity
        self.imagePartWidth = 100;               // px, parts of the original image
        self.clearPadding = 2;                   // px of background
        self.position = {   "top" :    1.4,      // constant percentage background height
                            "left" :   1.5,      // constant percentage of background width
                            "height" :   0,      // constant set by jsProject value headerHeight
                            "width" :    0 };    // constant percentage of background width
        self.drawRect = {   "top" :      0,      // px of original image
                            "left" :     0,      // px
                            "height" :   0,      // px
                            "width" :    0 };    // px
        self.animationDelay = 2000;              // ms
        self.mouseIsOver = false;                // store if mouse is over the div
        self.mouseOverAnimationDelay = 100;      // ms faster animation on mouse over
        self.mouseOutAnimationDelay = 2000;      // ms
        self.animationDelay = 2000;              // ms
        self.lastAnimationDate = 0;              // store the last animation time
        self.state = 0;                          // state determines what to draw for mouse over and click events
        self.font = "";                          // store the font set by the jsProject value font 
        self.fontSize = 12;                      // store the font size set by the jsProject value fontSize 
        self.text = "Exit";                      // static text
        self.padding = 3;                        // text padding percentage of background width
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // get the height
            self.position["height"] = jsProject.getValue( "headerHeight", "layout" );
            // get the font and size 
            self.font = jsProject.getValue( "font", "layout" );
            self.fontSize = jsProject.getValue( "fontSize", "layout" );

            // add html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            // done subscribe to events
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            
            // create canvas
            var html = '';
            html += '<canvas id="' + self.name + '"';
                html += ' style="position:absolute;background-color:transparent; ';
                 html += ' cursor:hand;cursor:pointer;';
                html += ' "';
            html += '>';
            html += '</canvas>';
            // add it to the header
            $( '#messages' ).append( html );
            // hide the canvas
            $( "#" + self.name ).hide();
            // done create canvas

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( self.name ).getContext( '2d' );
            // get the font size and font
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            
            // add events
            $("#" + self.name ).mouseenter( function(){ self.mouseOver(); } );
            $("#" + self.name ).mouseleave( function(){ self.mouseOut(); } );
            $("#" + self.name ).click( function(){ self.click(); } );
            // done add events
            
        };
        self.mouseOver = function( ) {
            self.mouseIsOver = true;
            // set the delay to the mouse over delay
            self.animationDelay = self.mouseOverAnimationDelay;
            // animate without delay
            self.animate( true );
        };
        self.mouseOut = function( ) {
            self.mouseIsOver = false;
            // set the delay to the mouse out delay
            self.animationDelay = self.mouseOutAnimationDelay;
            // animate without delay
            self.animate( true );
        };
        self.click = function(){
            // call provided callback
            if( self.clickCallback ){
                self.clickCallback();
            }
            else {
                self.debug( "warning click callback not provided." );
            } 
            // done call provided callback
        };
        self.show = function( visible ){
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // change the layout according to new dimensions
                self.layoutChange();
                // show the canvas
                $("#" + self.name ).show();
            }
            else {
                // hide the canvas
                $("#" + self.name ).hide();
            }
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'layoutChange' );

            // pauze the animation
            self.visible = false;
            
            // calculate the width of the text
            var textWidth = self.canvasSurface.measureText( self.text ).width;
              
            // set the draw rect
            self.drawRect["top"] = ( ( $( '#background' ).height() / 100 ) * self.position["top"] );
            self.drawRect["left"] = ( ( $( '#background' ).width() / 100 ) * self.position["left"] );
            var padding = ( ( $( '#background' ).width() / 100 ) * self.padding );
            self.drawRect["height"] = self.fontSize + ( 2 * padding );
            self.drawRect["width"] = textWidth + ( 2 * padding );
            // done set the draw rect
            
            // resize canvas
            $("#" + self.name ).css( 'top', self.drawRect["top"] + "px" );
            $("#" + self.name ).css( 'left', self.drawRect["left"] + "px" );
            $("#" + self.name ).css( 'height', self.drawRect["height"] + "px" );
            $("#" + self.name ).css( 'width', self.drawRect["width"] + "px" );
            // resize inner canvas
            self.canvasSurface.canvas.height = self.drawRect["height"];
            self.canvasSurface.canvas.width = self.drawRect["width"];
            // done resize canvas

            // pauze the animation
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
            
            // clear the canvas
            self.canvasSurface.clearRect( 0, 0, $("#" + self.name ).width(), $("#" + self.name ).height() );
            
            // is mouse over exit button
            if( self.mouseIsOver ){
                // change state    
                if( self.state === 0 ){
                    self.state = 1;
                }
                else {
                    self.state = 0;
                }
            }
            else {
                self.state = 0;
            }
            // done is mouse over exit button
            
            // change text color according to state
            if( self.state === 0 ){
                self.canvasSurface.fillStyle = 'orange';
            }
            else {
                self.canvasSurface.fillStyle = 'red';
            }
            // done change text color according to state
            
            // draw text
            self.canvasSurface.font = self.fontSize + "px " + self.font;
            self.canvasSurface.fillText( self.text, 0, self.fontSize );
            // done draw text
            
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