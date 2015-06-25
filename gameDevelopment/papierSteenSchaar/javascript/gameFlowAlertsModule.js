/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the display of game flow messages for the game Rock-Paper-Scissors
 *          the module displays the messages for countdown 
 *          
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
    gameDevelopment.gameFlowAlertsModule = function( ) {


    /*
     *  module gameFlowAlertsModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          sceneChange             called from event subsription playingFieldChanged
     *          show                    called from the public function
     *          showCountdown           called from the public function
     *          hide                    called from the public function
     *          startFlicker            called from the public function flicker
     *          flicker                 called from a timer
     *          translate               called by the event subscription languageChange
     *          translateCallback       callback for translate function
     *          debug
     *     public:
     *          show     
     *          showCountdown
     *          flicker
     *          hide
     */
    
        // private
        var self = this;
        self.MODULE = 'gameFlowAlertsModule';
        self.debugOn = false;
        self.visible = false;                                   // visibility
        self.translations =  { "letsStart" : "",                // translations for the text
                               "weWillPlay" : "", 
                               "goodLuck" : "",
                               "gameNumber" : "",
                               "makeYourChoice" : "",
                               "itsADraw" : "",
                               "weWillStartOver" : "",
                               "youLost" : "",
                               "betterLuckNextTime" : "",
                               "youWin" : "",
                               "youWonTheMatch" : "",
                               "wellPlayed" : "",
                               "youLostTheMatch" : "",
                               "youCanTryAgain" : "",
                               "congratulations" : "", 
                               "reStart" : "" };
        self.offsetTop = 170;                                   // px constant, store position     
        self.offsetLeft = 40;                                   // px constant, store position     
        
        self.flickerCallback = null;                            // store the callback function for when flicker ends
        self.flickerCounter = 0;                                // store number of flickers 
        self.flickerCountMaximum = 41;                          // store maximum number of times to flicker
        self.flickerColors = [ "black",                         // color constant, store the flicker colors
                               "red", 
                               'blue', 
                               "yellow", 
                               "green" ];
        self.flickerBackgroundColors = [ "transparent",         // color constant, store the flicker background colors
                                         'transparent', 
                                         "transparent", 
                                         "transparent", 
                                         "transparent" ];
        self.flickerIntervalStartAt = 2 * self.flickerCountMaximum;     // set start speed of flicker
        self.flickerIntervalSpeedUp = 2;                                // store speed up of flicker
        self.flickerInterval = self.flickerIntervalStartAt;             // interval time between flickering
        self.flickerTimer = null;                                       // store the timer

        // functions
        self.construct = function() {
            self.debug( 'construct' );

            // add html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'languageChange', self.translate );
            jsProject.subscribeToEvent( 'playingFieldChanged', self.sceneChange );
            // done subscribe to events
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );

            var html = '';
            // add alerts html
            html += '<div id="alerts" ';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "alerts", "zIndex" ) + '; ';
                html += ' text-align:center;font-size:1.4em;"';
            html += ' class="" >';
            html += '</div>';
            $('#jsProjectScene').append( html );
            // done add alerts html
            
            // translate text
            self.translate();
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );

            // calculate position
            var top = parseInt( $( '#playingfield' ).position().top ) + self.offsetTop;
            var left = parseInt( $( '#playingfield' ).position().left ) + self.offsetLeft;
            var width = ( parseInt( $( '#playingfield' ).width() ) - ( 2 * self.offsetLeft ) );
            // done calculate position
            
            // set position of selected strategy
            $('#alerts').css( 'width', width + "px" );
            $('#alerts').css( 'top', top + "px" );
            $('#alerts').css( 'left', left + "px" );
            // done set position of selected strategy

        };
        self.show = function( messageId ){
            self.visible = true;
            // call sceneChange to set positions
            self.sceneChange();
            // translate the current message
            var message = self.translations[messageId];
            if( messageId === "weWillPlay" ){
                message = message.replace( "%i", jsProject.getValue( "bestOf", "scores" ) );
            }
            if( messageId === "gameNumber" ){
                message = message.replace( "%i", parseInt( jsProject.getValue( "setsPlayed", "scores" ) ) + 1 );
            }
            // show the message
            $('#alerts').html( message );
            $('#alerts').show();
        };
        self.showCountdown = function( number ){
            $('#alerts').css( 'color', self.flickerColors[0] );
            $('#alerts').css( 'background-color', self.flickerBackgroundColors[0] );
            $('#alerts').html( number );
            $('#alerts').show();
        };
        self.hide = function( ){
            // stop the timer
            if( self.flickerTimer ){
                clearTimeout( self.flickerTimer );
                self.flickerTimer = null;
            }
            // done stop the timer
            
            $('#alerts').hide();
            // clear the html
            $('#alerts').html( "" );
            self.visible = false;
        };
        self.startFlicker = function( callback ){
            // stop the timer
            if( self.flickerTimer ){
                clearTimeout( self.flickerTimer );
                self.flickerTimer = null;
            }
            // done stop the timer
            
            // set the callback
            self.flickerCallback = callback;
            // set the speed to start speed
            self.flickerInterval = self.flickerIntervalStartAt;
            // reset the counter
            self.flickerCounter = 0;
            
            // call flicker function
            self.flicker();
        };
        self.flicker = function(  ) {
            // stop the timer
            if( self.flickerTimer ){
                clearTimeout( self.flickerTimer );
                self.flickerTimer = null;
            }
            // done stop the timer
            
            // update counter
            self.flickerCounter++;
            if( self.flickerCounter < self.flickerCountMaximum ){
                // speed up
                self.flickerInterval -= self.flickerIntervalSpeedUp;
                // variate colors
                var index = self.flickerCounter % ( self.flickerColors.length - 1 );
                $('#alerts').css( 'color', self.flickerColors[index] );
                // variate background colors
                index = self.flickerCounter % ( self.flickerBackgroundColors.length - 1 );
                $('#alerts').css( 'background-color', self.flickerBackgroundColors[index] );
                // set timer
                self.flickerTimer = setTimeout( function () { self.flicker(); }, self.flickerInterval );
            }
            else if( self.flickerCallback ){
                // flickering ready
                // call the callback
                self.flickerCallback();
                self.flickerCallback = null;
            }
        };
        self.translate = function(){
            self.debug( 'translate' );
            // make a translation id array
            var translationIds = [];
            $.each( self.translations, function( index, value ) {
                translationIds.push( index );
            } ); 
            // done make a translation id array
            
            // call for translation
            gameDevelopment.translate( 'papierSteenSchaar', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );

            // loop over translations id's
            $.each( result, function( index, value ) {
                self.translations[index] = value;
            } );
            // done loop over translations id's
            
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
            show : function( messageId ){
                self.show( messageId );
            },
            showCountdown : function( number ){
                self.showCountdown( number );
            },
            flicker : function( callback ){
                self.startFlicker( callback );
            },
            hide : function(){
                self.hide();
            }
        };
    };
})( gameDevelopment );