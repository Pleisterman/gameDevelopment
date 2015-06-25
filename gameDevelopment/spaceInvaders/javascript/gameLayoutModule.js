/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module creates the drawinglayers for the application space invaders
 *          the drawinglayers are resized through the event call sceneChange
 *          the sceneChange event will call the event layoutChange
 *          the module creates the game div element wherein all the layers are contained
 *          
 * Last revision: 16-05-2015
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
    gameDevelopment.gameLayoutModule = function( ) {


        /*
         *  module gameLayoutModule 
         *   
         *  functions: 
         *      private:
         *          construct       called internal
         *          addHtml         called internal
         *          show            called by the public function
         *          sceneChange     called from event subscription
         *          debug
         *      public:
         *          show 
         *          
         *  event subscription: 
         *      sceneChange         called from gameModule
         *      
         *  event calls
         *      layoutChange        called after sceneChange  
         *      
         */
 
    
        // private
        var self = this;
        self.MODULE = 'gameLayoutModule';
        self.debugOn = false;
        self.visible = false;           // visibility
        self.padding = 3;           
        self.backgroundWidth = 70;      // percentage of window width
        self.backgroundHeight = 80;     // percentage of window height
        self.backgroundOffsetTop = 5;   // percentage of window height
        
        self.layers = [ "stars", "mars", "moon", "world", "player", "bullets", "bunkers", "header", "invaders", "bombs", "messages" ]; // drawlayers to create
        
        //
        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // add the html
            self.addHtml();
            
            // subscribe to the events
            jsProject.subscribeToEvent( 'sceneChange', self.sceneChange );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );

            var html = '';

                // game html exists
                if( !$( '#game' ).length ){
                    self.debug( 'create game html' );
                    
                    // create game html
                    html += '<div id="game" ';
                        html += ' style="position:absolute;z-index:' + jsProject.getValue( "game", "zIndex" ) + ';background-color:white;';
                        html += ' border-radius: 5px; ';
                        html += ' "';
                    html += ' >';
                    html += '</div>';
                    
                    $('#jsProjectScene').append( html );
                    // done create game html
                    
                    
                    html = '';    
                    // create background html
                    html += '<div id="background" ';
                        html += ' style="position:absolute;z-index:' + jsProject.getValue( "background", "zIndex" ) + ';background-color:black;';
                        html += ' border-radius: 5px; ';
                        html += ' "';
                    html += ' >';
                        
                        // create layers html
                        for( var i = 0; i < self.layers.length; i++ ){
                            // create mars html
                            html += '<div id="' + self.layers[i] + '" ';
                                html += ' style="position:absolute;z-index:' + jsProject.getValue(  self.layers[i], "zIndex" ) + ';background-color:transparent;';
                                html += ' border-radius: 5px;';
                                html += ' "';
                            html += ' >';
                                html += '<canvas id="' +  self.layers[i] + 'DrawLayer" ';
                                    html += ' style="position:absolute; ';
                                    html += ' border-radius: 5px;';
                                    html += ' background-color:transparent;';
                                    html += ' "';
                                html += ' >';
                                html += '</canvas>';
                            html += '</div>';
                            // done create html
                        }
                        // done create layers html

                    html += '</div>';
                    // done background
                    $('#game').append( html );
                }
            $('#game').hide( );
        };
        self.show = function( visible ){
            self.visible = visible;
            if( visible ){
                self.debug( 'show' );
                // show the game
                $('#game').show();
                // update the layout
                self.sceneChange();
            }
            else {
                // hide the game
                $('#game').hide();
            }
        };
        self.sceneChange = function( ) {
            self.debug( 'sceneChange' );
            
            // calculate the layout 
            var top = $( '#logo' ).position().top - self.padding;
            var height = $( '#main' ).position().top + $( '#main' ).height() + ( self.padding * 2 );
            var left = 0;
            var width = $( '#main' ).width() + self.padding;
            // done calculate the layout 
            
            // prepare the body
            $( document.body ).css( "width", $( window ).width()  );
            $( document.body ).css( "max-width", $( window ).width()  );
            $( document.body ).css( "height", $( window ).height()  );
            // done prepare body
            
            // resize the game css 
            height = $( window ).height();
            $( '#game' ).css( 'height', height + 'px' ); 
            width = $( window ).width();
            $( '#game' ).css( 'width', width + 'px' );    
            // done resize the game css 

            // position the game css
            $( '#game' ).css( 'top', top + 'px' );    
            $( '#game' ).css( 'left', left + 'px' );    
            // done position the game css
            
            // calculate and set the background position and size
            left = ( width - ( ( width / 100 ) * self.backgroundWidth ) ) / 2; 
            width = ( width / 100 ) * self.backgroundWidth; 
            height = ( height / 100 ) * self.backgroundHeight;  
            top = ( width / 100 ) * self.backgroundOffsetTop; 
            $( '#background' ).css( 'top', top + 'px' );    
            $( '#background' ).css( 'left', left + 'px' );    
            $( '#background' ).css( 'width', width + 'px' );    
            $( '#background' ).css( 'height', height + 'px' ); 
            // done calculate and set the background position and size
            
            // calculate and set the layers positions and sizes
            var canvasSurface = null;
            for( var i = 0; i < self.layers.length; i++ ){
                $( '#' + self.layers[i] ).css( 'top', '0px' );    
                $( '#' + self.layers[i] ).css( 'left', '0px' );    
                $( '#' + self.layers[i] ).css( 'width', width + 'px' );    
                $( '#' + self.layers[i] ).css( 'height', height + 'px' ); 
                canvasSurface = document.getElementById( self.layers[i] + 'DrawLayer' ).getContext('2d');
                canvasSurface.canvas.height = height;
                canvasSurface.canvas.width = width;
                $( '#' + self.layers[i] + 'DrawLayer' ).css( 'top', '0px' );    
                $( '#' + self.layers[i] + 'DrawLayer' ).css( 'left', '0px' );    
                $( '#' + self.layers[i] + 'DrawLayer' ).css( 'width', width + 'px' );    
                $( '#' + self.layers[i] + 'DrawLayer' ).css( 'height', height + 'px' ); 
            }
            // done calculate and set the layers positions and sizes

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