/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the start buttons for the game Rock-Paper-Scissors
 *          the module shows a flickering text: new game ( translated ) 
 *          the module shows three buttons for starting the game in slow, medium or fast mode
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
    gameDevelopment.startButtonsModule = function( ) {


    /*
     *  module startButtonsModule 
     *          
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          buttonMouseOver         called by the html buttons
     *          buttonMouseOut          called by the html buttons
     *          click                   called by the html buttons
     *          playOverSound           called by the buttonMouseOver function    
     *          playClickSound          called by the click function
     *          show                    called by the public function
     *          flicker                 called by a timer
     *          sceneChange             called from event subsription playingFieldChanged 
     *          translate               called by the event subscription languageChange
     *          translateCallback       calback for translate function 
     *          debug
     *     public:
     *          show     
     *          
     *  event subscription: 
     *      languageChange              called from languageModule
     *      playingFieldChanged         called from playingfieldModule
     */
    
        // private
        var self = this;
        self.MODULE = 'startButtonsModule';
        self.debugOn = false;
        
        self.visible = false;                                       // visibility
        self.translationIds = [ "newGame" ];                        // constant, store the translation id's
        self.offsetTop = 170;                                       // constant, store the position of the buttons
        self.offsetLeft = 40;                                       // constant, store the position of the buttons
        self.flickerDelay = 3000;                                   // constant, store time before flicker starts
        self.flickerCounter = 0;                                    // store count 
        self.flickerCountMaximum = 41;                              // store max counter
        self.flickerColors = [ "black",                             // store colors for flickering
                               "red", 
                               'blue', 
                               "yellow", 
                               "green" ];
        self.flickerBackgroundColors = [ "transparent",             // store colors of background fopr flickering
                                         'transparent', 
                                         "transparent", 
                                         "transparent", 
                                         "transparent" ];
        self.flickerIntervalStartAt = 2 * self.flickerCountMaximum; // store the speed for start of interval
        self.flickerIntervalSpeedUp = 2;                            // store the speed up of the interval
        self.flickerInterval = self.flickerIntervalStartAt;         // store the current interval speed
        self.flickerTimer = null;                                   // store the timer
        self.newGameLabelWidth = 110;                               // position of the new game label
        self.newGameLabelHeight = 16;                               // position of the new game label
        self.buttonWidth = 60;                                      // position of the buttons
        self.buttonHeight = 30;                                     // position of the buttons
        self.buttonSpacing = 6;                                     // position of the buttons
        
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
            var left = 0;
            var html = '';
            // add css
            html += '<style>' + "\n";
                html += ' .slowGameButton { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/slowButton.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .slowGameButtonOver { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/slowButtonOver.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .mediumGameButton { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/mediumButton.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .mediumGameButtonOver { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/mediumButtonOver.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .fastGameButton { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/fastButton.png);' + "\n";
                html += '  }' + "\n" + "\n";
                html += ' .fastGameButtonOver { ' + "\n";
                html += '    background-image:url(./papierSteenSchaar/images/fastButtonOver.png);' + "\n";
                html += '  }' + "\n" + "\n";
            html += '</style>' + "\n";
            // done add css

            // add start button html
            html += '<div id="playControls" ';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "playControl", "zIndex" ) + '; ';
                html += ' "';
            html += '>';
                // new game text
                html += '<div ';
                    html += ' id="newGame"';
                    html += ' style="position:absolute;padding-bottom:4px;text-align:center;background-color:' + self.flickerBackgroundColors[0] + ';';
                    html += ' padding-top:6px;padding-bottom:6px;text-align:center; ';
                    html += ' color: ' + self.flickerColors[0] + ';';
                    html += ' top:0px;';
                    html += ' left:0px;';
                    html += ' width:' + self.newGameLabelWidth + 'px;';
                    html += ' height:' + self.newGameLabelHeight + 'px;';
                    html += ' "';
                    html += ' class="" ';
                    html += ' >';
                html += '</div>';
                // done new game text
                
                // next item
                left += self.newGameLabelWidth + self.buttonSpacing;
                // slow button
                html += '<div ';
                    html += ' id="slowGameButton" ';
                    html += ' style="position:absolute;background-color:white;';
                    html += ' top:0px;';
                    html += ' left:' + left + 'px;';
                    html += ' width:' + self.buttonWidth + 'px;';
                    html += ' height:' + self.buttonHeight + 'px;';
                    html += ' "';
                    html += ' class="panelBorder slowGameButton" ';
                html += ' >';
                html += '</div>';
                // done slow button
                left += self.buttonWidth + self.buttonSpacing;
                // medium button
                html += '<div ';
                    html += ' id="mediumGameButton" ';
                    html += ' style="position:absolute;background-color:white;';
                    html += ' top:0px;';
                    html += ' left:' + left + 'px;';
                    html += ' width:' + self.buttonWidth + 'px;';
                    html += ' height:' + self.buttonHeight + 'px;';
                    html += ' "';
                    html += ' class="panelBorder mediumGameButton" ';
                html += ' >';
                html += '</div>';
                // done medium button
                left += self.buttonWidth + self.buttonSpacing;
                // fast button
                html += '<div ';
                    html += ' id="fastGameButton" ';
                    html += ' style="position:absolute;background-color:white;';
                    html += ' top:0px;';
                    html += ' left:' + left + 'px;';
                    html += ' width:' + self.buttonWidth + 'px;';
                    html += ' height:' + self.buttonHeight + 'px;';
                    html += ' "';
                    html += ' class="panelBorder fastGameButton" ';
                html += ' >';
                html += '</div>';
                // done fast button
            html += '</div>';
            $('#jsProjectScene').append( html );
            $('#playControls').hide();
            // done add html
            
            // set the button events
            $("#slowGameButton" ).mouseenter( function(){ self.buttonMouseOver( "slow" ); } );
            $("#slowGameButton" ).mouseleave( function(){ self.buttonMouseOut( "slow" ); } );
            $("#slowGameButton" ).click( function( ){ self.click( 0 ); } );
            $("#mediumGameButton" ).mouseenter( function(){ self.buttonMouseOver( "medium" ); } );
            $("#mediumGameButton" ).mouseleave( function(){ self.buttonMouseOut( "medium" ); } );
            $("#mediumGameButton" ).click( function( ){ self.click( 1 ); } );
            $("#fastGameButton" ).mouseenter( function(){ self.buttonMouseOver( "fast" ); } );
            $("#fastGameButton" ).mouseleave( function(){ self.buttonMouseOut( "fast" ); } );
            $("#fastGameButton" ).click( function( ){ self.click( 2 ); } );
            // done set the button events
            
            // translate text
            self.translate();
        };
        self.buttonMouseOver = function( speed ){
            self.debug( "buttonMouseOver" );
            // play sound
            self.playOverSound();
            // set the button over class
            $("#" + speed + "GameButton" ).attr( "class", speed + "GameButtonOver panelBorder" );
        };
        self.buttonMouseOut = function( speed ){
            // set the button out class
            $("#" + speed + "GameButton" ).attr( "class", speed + "GameButton panelBorder" );
        };
        self.click = function( speed ){
            // delete timer
            if( self.flickerTimer ){
                clearTimeout( self.flickerTimer );
                self.flickerTimer = null;
            }
            // done delete timer
            
            // reset counter
            self.flickerCounter = 0;
            // hide the buttons
            $('#playControls').hide();
            // set speed
            jsProject.setValue( "speed", "game", speed );
            // call start game event
            jsProject.callEvent( "startGame" );
        };
        self.playOverSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound
            var sound = jsProject.getResource( 'playButtonOver', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound
        };
        self.playClickSound = function(){
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound
            var sound = jsProject.getResource( 'playButton', 'sound' );
            if( sound ){
                sound.play();
            }
            // done play sound
        };
        self.show = function( visible ){
            if( visible ){
                
                // delete timer
                if( self.flickerTimer ){
                    clearTimeout( self.flickerTimer );
                    self.flickerTimer = null;
                }
                // done delete timer

                self.visible = true;
                // show the buttons
                $('#playControls').show();
               // call sceneChange top set positions 
                self.sceneChange();
                // reset the colors
                $('#newGame').css( 'color', self.flickerColors[0] );
                $('#newGame').css( 'background-color', self.flickerBackgroundColors[0] );
                // done reset the colors
                // reset counter
                self.flickerCounter = 0;
                // start timer
                self.flickerTimer = setTimeout( function () { self.flicker(); }, 1000 );
            }
            else {
                // delete timer
                if( self.flickerTimer ){
                    clearTimeout( self.flickerTimer );
                    self.flickerTimer = null;
                }
                // done delete timer
                
                // hide buttons
                $('#playControls').hide();
                self.visible = false;
            }
        };
        self.flicker = function() {
            // delete timer
            if( self.flickerTimer ){
                clearTimeout( self.flickerTimer );
                self.flickerTimer = null;
            }
            // done delete timer

            // update the counter
            self.flickerCounter++;
            if( self.flickerCounter < self.flickerCountMaximum ){
                // speed up the animation
                self.flickerInterval -= self.flickerIntervalSpeedUp;
                // set the colors
                var index = self.flickerCounter % ( self.flickerColors.length - 1 );
                $('#newGame').css( 'color', self.flickerColors[index] );
                index = self.flickerCounter % ( self.flickerBackgroundColors.length - 1 );
                $('#newGame').css( 'background-color', self.flickerBackgroundColors[index] );
                // done set the colors
                
                // start the timer
                self.flickerTimer = setTimeout( function () { self.flicker(); }, self.flickerInterval );
            }
            else {
                // reset flicker pause
                self.flickerInterval = self.flickerIntervalStartAt;
                self.flickerCounter = 0;
                
                // start the timer
                self.flickerTimer = setTimeout( function () { self.flicker(); }, self.flickerDelay );
            }
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }

            self.debug( 'sceneChange' );
            // calculate the position
            var top = parseInt( $( '#playingfield' ).position().top ) + self.offsetTop;
            var left = parseInt( $( '#playingfield' ).position().left ) + self.offsetLeft;
            // done calculate the position

            // set position
            $('#playControls').css( 'top', top + "px" );
            $('#playControls').css( 'left', left + "px" );
            // done set position

        };
        self.translate = function(){
            self.debug( 'translate' );
            // call for translation
            gameDevelopment.translate( 'papierSteenSchaar', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            // loop the translation id's
            $.each( result, function( index, value ) {
                self.debug( 'translateCallback index:' + index + " value:" + value);
                $('#' + index ).html( value );
            } );
            // done loop the translation id's
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