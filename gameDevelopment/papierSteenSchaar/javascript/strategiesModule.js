/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the selection of the strategy for the game Rock-Paper-Scissors
 *          the module shows a popup menu
 *          the popup menu is displayed on the top left of the game screen
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
    gameDevelopment.strategiesModule = function( ) {


    /*
     *  module strategiesModule 
     *   
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          click                   called by popup menu calls
     *          playPopupMenuSound      called from click
     *          itemOverChange          called from popUpMenuModule
     *          show                    called from the public function
     *          sceneChange             called from event subsription playingFieldChanged
     *          translate               called by the event subscription languageChange
     *          translateCallback       callback for translate function
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
        self.MODULE = 'strategiesModule';
        self.debugOn = false;
        self.visible = false;                                           // visibility
        self.translationIds = [ "strategyLabel",                        // translations for the text
                                "notAgain", 
                                "as123", 
                                "iCanDoThat" ];
        self.strategyIds = [ "notAgain",                                // store the srtategies
                             "as123", 
                             "iCanDoThat" ];
        self.strategyTranslations = { "notAgain" : "notAgain",          // translations for the strategies
                                      "as123" : "as123",
                                      "iCanDoThat" : "iCanDoThat" };
        self.offsetTop = 30;                                            // store the position of the popup menu         
        self.offsetLeft = 40;                                           // store the position of the popup menu 
        self.offsetRight = 160;                                         // store the position of the popup menu    
        self.strategiesPanel = null;                                    // store the popup mneu module
        
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
                html += ' id="strategiesPanel" ';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "strategies", "zIndex" ) + ';';
                html += ' cursor:hand;cursor:pointer;padding-top:4px;padding-bottom:4px;padding-left:10px;';
                html += ' "';
                html += ' class="panelBorder hoverPanelColor strategiesPanel" ';
                html += ' >';
                    html += '<span id="strategyLabel">Strategy</span>';
                    html += '<span id="selectedStrategy">' + self.strategyTranslations[self.strategyIds[jsProject.getValue( "strategy","game" )]] + '</span>';
            html += '</div>';
            html += '<div ';
                html += ' id="strategiesPopUpMenu" ';
                html += ' style="margin-left:10px;position:absolute;z-index:' + jsProject.getValue( "strategies", "zIndex" ) + ';"';
                html += ' class="" ';
            html += ' >';
            // loop over the strategies
            for( var i = 0; i < self.strategyIds.length; i++ ){
                html += '<div ';
                html += ' id="strategiesPopUpMenuItem' + i + '" ';
                html += ' value="' + i + '" ';
                html += ' class="panelBorder hoverPanelColor strategiesPopUpMenuItem" ';
                html += ' style="padding-top:5px;padding-bottom:5px;padding-left:15px;"';
                html += ' >';
                    html += self.strategyTranslations[self.strategyIds[i]] + '<br/>';
                html += '</div>';
            }
            // done loop over the strategies
            html += '</div>';
            $('#jsProjectScene').append( html );
            // done add popup menu html
            
            // create popup menu
            self.strategiesPanel = new jsProject.popUpMenuModule( 'strategiesPanel', 'strategiesPopUpMenu', false, self.click, self.itemOverChange );
            
            // hide the menu
            $('#strategiesPanel').hide();
            
            // translate text
            self.translate();
        };
        self.click = function( value ) {
            self.debug( 'click' );
            // play sound
            self.playPopupMenuSound();
            // update the project value
            jsProject.setValue( "strategy", "game", value );
            // set the translated text of the selected panel
            $( '#selectedStrategy' ).html( self.strategyTranslations[self.strategyIds[jsProject.getValue( "strategy", "game" )]] );
            // call the event
            jsProject.callEvent( 'strategyChange' );
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
            var left = parseInt( $( '#playingfield' ).position().left ) + self.offsetLeft;
            var width = parseInt( $( '#playingfield' ).width() ) - ( self.offsetRight + ( 2 * self.offsetLeft ) );
            // done calculate position
            
            // set position of selected strategy
            $('#strategiesPanel').css( 'top', top + "px" );
            $('#strategiesPanel').css( 'left', left + "px" );
            $('#strategiesPanel').css( 'width', width + "px" );
            // done set position of selected strategy

            // set position of popup menu
            top += 30;
            width -= 20;
            $('#strategiesPopUpMenu').css( 'top', top + "px" );
            $('#strategiesPopUpMenu').css( 'left', left + "px" );
            $('#strategiesPopUpMenu').css( 'width', width + "px" );
            // done set position of popup menu
            
        };
        self.translate = function(){
            self.debug( 'translate' );
            // call for translation
            gameDevelopment.translate( 'papierSteenSchaar', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            
            // loop over strategyTranslations id's
            $.each( result, function( index, value ) {
                if( self.strategyTranslations[index] ){
                    self.strategyTranslations[index] = value;
                }
                else {
                    $('#' + index ).html( value );
                }
            } );
            // done loop over strategyTranslations id's
            
            // loop over translation id's
            for( var i = 0; i < self.strategyIds.length; i++ ){
                $( '#strategiesPopUpMenuItem' + i ).html( self.strategyTranslations[self.strategyIds[i]] );
            }
            // done loop over translation id's
            
            // set the translation for the selected strategy
            $( '#selectedStrategy' ).html( self.strategyTranslations[self.strategyIds[jsProject.getValue( "strategy","game" )]] );
        };
        self.show = function( visible ){
            self.debug( 'show' );
            if( visible ){
                self.visible = true;
                // show the popup menu
                $('#strategiesPanel').show();
                // call for scene change to set position
                self.sceneChange();
            }
            else {
                self.visible = false;
                // hide the popup menu
                $('#strategiesPanel').hide();
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