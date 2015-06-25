/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls a score display for the game Rock-Paper-Scissors
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
    gameDevelopment.scoresModule = function( ) {


    /*
     *  module scoresModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          show                    called by the public function
     *          drawScore               called from the event sunsciptions gameStop, scoreChanged and the show function
     *          sceneChange             called from event subsription playingFieldChanged
     *          debug
     *     public:
     *          show     
     *          
     *  event subscription: 
     *      playingFieldChanged         called from playingfieldModule
     *      gameStop                    called from gameModule
     *      scoreChanged                called from gameFlowModule
     */
    
        // private
        var self = this;
        self.MODULE = 'scoresModule';
        self.debugOn = false;
        self.offsetLeft = 60;           // constant, store the position
        self.offsetTop = 65;            // constant, store the position
        self.offsetRight = -30;         // constant, store the position
        self.width = 500;               // constant, store the position
        self.height = 100;              // constant, store the position
        self.canvasSurface = null;      // constant, store canvas surface to draw on

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();

            // subscribe to events
            jsProject.subscribeToEvent( 'playingFieldChanged', self.sceneChange );
            jsProject.subscribeToEvent( 'gameStop', self.drawScore );
            jsProject.subscribeToEvent( 'scoreChanged', self.drawScore );
            // done subscribe to events
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
            // add a canvas
            html += '<canvas';
                html += ' id="score" ';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "scores", "zIndex" ) + '; ';
                html += ' background-color:transparent;';
                html += ' "';
                html += ' >';
            html += '</canvas>';
            $('#jsProjectScene').append( html );
            // done add a canvas
            
            // set the canvas surface
            self.canvasSurface = document.getElementById( 'score' ).getContext( '2d' );
        };
        self.show = function( visible ){
            self.debug( 'show' );
            if( visible ){
                self.visible = true;
                // calculate position
                self.width = $( '#playingfield' ).width() - ( ( self.offsetLeft * 2 ) + self.offsetRight );
                // draw score
                self.drawScore();
                // show
                $('#score' ).show();
                // call sceneCHange to set the position
                self.sceneChange();
            }
            else {
                // hide
                $('#score' ).hide();
            }
        };
        self.drawScore = function( ) {
            // clear the canvas surfcae
            self.canvasSurface.clearRect(0, 0, self.width, self.height );
            // set the dimensions of the canvas
            $( '#score' ).css( 'width', self.width + 'px' );    
            $( '#score' ).css( 'height', self.height + 'px' ); 
            self.canvasSurface.canvas.width = self.width;
            self.canvasSurface.canvas.height = self.height;
            // done set the dimensions of the canvas
            
            //draw outer rect
            self.canvasSurface.strokeStyle = "#000000";
            self.canvasSurface.lineWidth = 3;
            self.canvasSurface.beginPath();
            
            // create the score text
            var x = 0, y = 0;
            var text = "Score:";
            self.canvasSurface.font = '20pt Calibri';
            self.canvasSurface.fillStyle = 'blue';
            self.canvasSurface.textAlign = 'center';
            x = ( self.width / 2 ) - 20;
            y = 40;
            self.canvasSurface.fillText( text , x, y );

            var text = "Computer: ";
            text += jsProject.getValue( "computer", "scores" );
            text += "  /  ";
            text += jsProject.getValue( "bestOf", "scores" );
            text += "  -  ";
            text += $( "#userName" ).val();
            text += ": ";
            text += jsProject.getValue( "player", "scores" );
            text += "  /  ";
            text += jsProject.getValue( "bestOf", "scores" );
            self.canvasSurface.font = '16pt Calibri';
            self.canvasSurface.fillStyle = 'black';
            self.canvasSurface.textAlign = 'center';
            x = ( self.width / 2 ) - 20;
            y = 75;
            self.canvasSurface.fillText( text , x, y );
            // done create the score text

        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );
            // calculate position
            var top = parseInt( $( '#playingfield' ).position().top ) + self.offsetTop;
            var left = parseInt( $( '#playingfield' ).position().left )  + self.offsetLeft ;
            // done calculate position
            
            // set the position
            $( '#score' ).css( 'top', top + 'px' );    
            $( '#score' ).css( 'left', left + 'px' );    
            // done set the position
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