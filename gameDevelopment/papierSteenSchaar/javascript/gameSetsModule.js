/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the selection of the number of sets for the game Rock-Paper-Scissors
 *          the module shows a popup menu
 *          the popup menu is displayed on the top left of the game screen
 *          the module controls how many sets are played in one game
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
    gameDevelopment.gameSetsModule = function( ) {


    /*
     *  module gameSetsModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          click                   called by popup menu calls
     *          playPopupMenuSound      called from click   
     *          itemOverChange          called from popUpMenuModule
     *          sceneChange             called from event subsription playingFieldChanged
     *          translate               called by the event subscription languageChange
     *          translateCallback       callback for translate function
     *          show                    called from the public function
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
        self.MODULE = 'gameSetsModule';
        self.debugOn = false;
        self.visible = false;                       // visibility
        self.translationIds = [ "bestOf" ];         // text to translate    
        self.sets = [ 9, 7, 5, 3 ];                 // constant, possible choice of sets
        self.selectedSet = 3;                       // current selected set
        self.offsetTop = 30;                        // px constant, store position
        self.offsetRight = 60;                      // px constant, store position
        self.width = 90;                            // px constant, store position
        
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
            
             // add popup menu html
           html += '<div ';
                html += ' id="gameSetsPanel" ';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "gameSets", "zIndex" ) + '; ';
                html += ' cursor:hand;cursor:pointer;padding-top:4px;padding-bottom:4px;padding-left:10px;';
                html += ' "';
                html += ' class="panelBorder hoverPanelColor gameSetsPanel" ';
                html += ' >';
                    html += '<span id="bestOf">best of </span><span id="selectedSet">' + self.sets[self.selectedSet] + '</span>';
            html += '</div>';
            html += '<div ';
                html += ' id="gameSetsPopUpMenu" ';
                html += ' style="margin-left:10px;position:absolute;z-index:'+ jsProject.getValue( "gameSets", "zIndex" ) + ';"';
                html += ' class="" ';
            html += ' >';
             // loop over the sets
           for( var i = 0; i < self.sets.length; i++ ){
                html += '<div ';
                html += ' id="gameSetsPopUpMenu' + i + '" ';
                html += ' value="' + i + '" ';
                html += ' class="panelBorder hoverPanelColor gameSetsPopUpMenuItem" ';
                html += ' style="padding-top:5px;padding-bottom:5px;text-align:center;"';
                html += ' >';
                    html += '<span id="bestOf' + i + '">best of </span><span id="set">' + self.sets[i] + '</span>';
                html += '</div>';
            }
            // done loop over the sets
            html += '</div>';
            $('#jsProjectScene').append( html );
            // done add popup menu html
            
            // create popup menu
            self.gameSetsPanel = new jsProject.popUpMenuModule( 'gameSetsPanel', 'gameSetsPopUpMenu', false, self.click, self.itemOverChange );

            // hide the menu
            $('#gameSetsPanel').hide();

            // set current selection
            jsProject.setValue( "bestOf", "scores", self.sets[self.selectedSet] );

            // translate text
            self.translate();
        };
        self.click = function( value ) {
            self.debug( 'click' );
            // play sound
            self.playPopupMenuSound();
            self.selectedSet = value;
            $( '#selectedSet' ).html( self.sets[self.selectedSet] );
            // update the project value
            // set the translated text of the selected panel
            jsProject.setValue( "bestOf", "scores", self.sets[self.selectedSet] );
            // call the event
            jsProject.callEvent( 'gameSetsChange' );
        };
        self.playPopupMenuSound = function() {
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            //done  no sound
            
            // play sound
            var buttonSound = jsProject.getResource( 'popupMenu', 'sound' );
            if( buttonSound ){
                buttonSound.play();
            }
            // done play sound
        };
        self.itemOverChange = function( ) {
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            //done  no sound

            // play sound
            var buttonSound = jsProject.getResource( 'popupMenuOver', 'sound' );
            if( buttonSound ){
                buttonSound.play();
            }
            // done play sound
            
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );
            
            // calculate position
            var top = parseInt( $( '#playingfield' ).position().top ) + self.offsetTop;
            var left = parseInt( $( '#playingfield' ).position().left )  + parseInt( $('#playingfield').width( ) ) - ( self.offsetRight + self.width ) ;
            var width = self.width;
            // done calculate position
            
            // set position of selected sets
            $('#gameSetsPanel').css( 'top', top + "px" );
            $('#gameSetsPanel').css( 'left', left + "px" );
            $('#gameSetsPanel').css( 'width', width + "px" );
            // done set position of selected sets
            
            // set position of popup menu
            top += 30;
            width -= 20;
            $('#gameSetsPopUpMenu').css( 'top', top + "px" );
            $('#gameSetsPopUpMenu').css( 'left', left + "px" );
            $('#gameSetsPopUpMenu').css( 'width', width + "px" );
            // done set position of popup menu
            
        };
        self.translate = function(){
            self.debug( 'translate' );
            // call for translation
            gameDevelopment.translate( 'papierSteenSchaar', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            
            // loop over Sets Translations id's
            $.each( result, function( index, value ) {
                if( index === 'bestOf' ){
                    $('#bestOf' ).html( value ); 
                    for( var i = 0; i < self.sets.length; i++ ){
                        $('#bestOf' + i ).html( value ); 
                    }
                }
                else {
                    $('#' + index ).html( value );
                }
            } ); 
            // done loop over Sets Translations id's
        };
        self.show = function( visible ){
            self.debug( 'show' );
            if( visible ){
                self.visible = true;
                // show the popup menu
                $('#gameSetsPanel').show();
                // call for scene change to set position
                self.sceneChange();
            }
            else {
                self.visible = false;
                // hide the popup menu
                $('#gameSetsPanel').hide();
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
            getMatchLength : function(){
                return self.sets[self.selectedSet];
            }
        };
    };
})( gameDevelopment );