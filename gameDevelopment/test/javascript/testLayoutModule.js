/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this module creates the drawinglayers for the application test
*          the drawinglayers are resized through the event call sceneChange
*          the sceneChange event will call the event layoutChange
*          the module creates the test div element wherein all the layers are contained
* Last revision: 05-05-2015
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
    gameDevelopment.testLayoutModule = function( ) {


        /*
         *  module testLayoutModule 
         *  purpose:
         *   this module creates the drawinglayers for the application test
         *   the drawinglayers are resized through the event call sceneChange
         *   the sceneChange event will call the event layoutChange
         *   the module creates the test div element wherein all the layers are contained
         *   
         *  functions: 
         *      private:
         *          construct
         *          addHtml
         *          show 
         *          sceneChange
         *          debug
         *      public:
         *          show 
         *  event subscription: 
         *      sceneChange called from testModule
         *  event calls
         *      layoutChange called after sceneChange  
         */
 
    
        // private
        var self = this;
        self.MODULE = 'testLayoutModule';
        self.debugOn = true;
        self.visible = false;
        
        self.padding = 3;           
        self.backgroundWidth = 70;     // percentage of window width
        self.backgroundHeight = 80;    // percentage of window height
        self.backgroundOffsetTop = 5;  // percentage of window height
        self.canvasWidth = 90;         // percentage of background width
        self.canvasHeight = 90;        // percentage of background height
        
//
        // functions
        self.construct = function() {
            self.debug( 'construct' );

                // add the html
                self.addHtml();
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );

            var html = '';

                // test html exists
                if( !$( '#test' ).length ){
                    self.debug( 'create test html' );
                    
                    // create test html
                    html += '<div id="test" ';
                        html += ' style="position:absolute;z-index:' + jsProject.getValue( "test", "zIndex" ) + ';background-color:black;';
                        html += ' border-radius: 5px; ';
                        html += ' "';
                    html += ' >';
                    html += '</div>';
                    
                    $('#jsProjectScene').append( html );
                    // done create test html
                    
                    
                    html = '';    
                    // create background html
                    html += '<div id="background" ';
                        html += ' style="position:absolute;z-index:' + jsProject.getValue( "background", "zIndex" ) + ';background-color:orange;';
                        html += ' border-radius: 5px; ';
                        html += ' "';
                    html += ' >';

                    html += '</div>';
                    // done background
                    $('#test').append( html );

                    html = '';    
                    // create canvas html
                    html += '<canvas id="canvas" ';
                        html += ' style="position:absolute;z-index:' + jsProject.getValue( "canvas", "zIndex" ) + ';background-color:black;';
                        html += ' border-radius: 5px; ';
                        html += ' "';
                    html += ' >';

                    html += '</canvas>';
                    // done canvas
                    $('#test').append( html );
            }
            $('#test').hide( );
        };
        self.show = function( visible ){
            if( visible ){
                self.debug( 'show' );

                // subscribe to the events
                jsProject.subscribeToEvent( 'sceneChange', self.sceneChange );
                self.visible = true;
                // show the test
                $('#test').show();
                // update the layout
                self.sceneChange();
            }
            else {
                self.visible = false;
                // hide the test
                $('#test').hide();
            }
        };
        self.sceneChange = function( ) {
            self.debug( 'sceneChange' );
            
            
            // prepare the body
            $( document.body ).css( "width", $( window ).width()  );
            $( document.body ).css( "max-width", $( window ).width()  );
            $( document.body ).css( "height", $( window ).height()  );
            // done prepare body
            
            // resize the test css 
            $( '#test' ).css( 'height', $( window ).height() + 'px' ); 
            $( '#test' ).css( 'width', $( window ).width() + 'px' );    
            $( '#test' ).css( 'top', 0 + 'px' );    
            $( '#test' ).css( 'left', 0 + 'px' );    
            // done position the test css
            
            // calculate and set the background position and size
            var left = ( $( '#test' ).width() - ( ( $( '#test' ).width() / 100 ) * self.backgroundWidth ) ) / 2; 
            var width = ( $( '#test' ).width() / 100 ) * self.backgroundWidth; 
            var height = ( $( '#test' ).height() / 100 ) * self.backgroundHeight;  
            var top = ( $( '#test' ).height() / 100 ) * self.backgroundOffsetTop; 
            $( '#background' ).css( 'top', top + 'px' );    
            $( '#background' ).css( 'left', left + 'px' );    
            $( '#background' ).css( 'width', width + 'px' );    
            $( '#background' ).css( 'height', height + 'px' ); 
            // done calculate and set the background position and size
            
            // calculate and set the background position and size
            var left = $( '#background' ).position().left + ( ( $( '#background' ).width() - ( ( $( '#background' ).width() / 100 ) * self.canvasWidth ) ) / 2 ); 
            var width = ( $( '#background' ).width() / 100 ) * self.canvasWidth; 
            var height = ( $( '#background' ).height() / 100 ) * self.canvasHeight;  
            var top = $( '#background' ).position().top + ( ( $( '#background' ).height() - ( ( $( '#background' ).height() / 100 ) * self.canvasWidth ) ) / 2 );
            $( '#canvas' ).css( 'top', top + 'px' );    
            $( '#canvas' ).css( 'left', left + 'px' );    
            $( '#canvas' ).css( 'width', width + 'px' );    
            $( '#canvas' ).css( 'height', height + 'px' ); 
            // done calculate and set the background position and size

            var canvasSurface = null;
                canvasSurface = document.getElementById( 'canvas' ).getContext('2d');
                canvasSurface.canvas.height = height;
                canvasSurface.canvas.width = width;

            jsProject.callEvent( "layoutChange" );
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