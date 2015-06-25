/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the menu for the gameDevelopment application
 *          for every game there is a menu option

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
    gameDevelopment.contentMenuModule = function( ) {


    /*
     *  module introModule 
     *  
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          setLanguage             called by event subscription
     *          translate               called by addHtml and setLanguage
     *          translateCallback       called as the callback of translate
     *          debug
     *          
     *  event subscription: 
     *      languageChange              called from languageModule
     */
    
        // private
        var self = this;
        self.MODULE = 'contentMenuModule';
        self.debugOn = false;
        self.translationIds = [ "papierSteenSchaarMenuName", "spaceInvadersMenuName", "testMenuName" ];
        self.menus = [ "papierSteenSchaar", "spaceInvaders" ];
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'languageChange', self.setLanguage );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            
            var html = '';
            // loop menu array
            for( var i = 0; i < self.menus.length; i++ ){
                // add link
                html += '<a id="' + self.menus[i] + 'Link" href="./?app=' + self.menus[i] + '&lang=' + gameDevelopment.getLanguage() +  '">';
                    
                html += '<div id="' + self.menus[i] + 'Menu" ';
                        html += 'style="float:left;margin-left:50px;margin-top:10px;text-align:center;';
                        html += '"';
                        html += ' class="contentMenuButton" ';
                    html += ' >';
                        // add the text
                        html += '<div id="' + self.menus[i] + 'MenuName" ';
                            html += ' class="contentMenuName" ';
                        html += ' >';
                        html += '</div>';    
                        // add the image
                        html += '<div  ';
                            html += 'style="margin:0 auto;width:60px;height:60px;padding-bottom:4px; background-repeat: no-repeat;background-position: center center;';
                            html += 'background-image:url(./' + self.menus[i] + '/images/logo.png);';
                            html += '"';
                        html += ' >';
                        html += '</div>';    
                    
                    html += '</div>';    
                html += '</a>';    
                // done add link
            }
            // done loop menu array

            // add test menu option for debug mode
            if( jsProject.getValue( "debugOn", "gameDevelopment" ) ) { 
                // add link
                html += '<a id="testLink" href="./?app=test&lang=' + gameDevelopment.getLanguage() +  '">';
                    html += '<div id="testMenu"';
                        html += 'style="float:left;margin-left:50px;margin-top:10px;text-align:center;';
                        html += '"';
                        html += ' class="contentMenuButton" ';
                    html += ' >';
                        // add the text 
                        html += '<div id="testMenuName" ';
                            html += ' class="contentMenuName" ';
                        html += ' >';
                        html += '</div>';   
                        // add the image
                        html += '<div  ';
                            html += 'style="margin:0 auto;width:60px;height:60px;padding-bottom:4px; background-repeat: no-repeat;background-position: center center;';
                            html += '"';
                        html += ' >';
                        html += '</div>';    
                    html += '</div>';    
                html += '</a>';    
                // done add link
            }
            // done add test menu option for debug mode

            // add html
            $( '#contentMenu' ).html( html );
            // select the current menu
            if( gameDevelopment.app !== "" ){
                $( '#' + gameDevelopment.appName + "Menu" ).attr( 'class', "contentMenuButtonSelected" );
            }
            
            // translate the text
            self.translate();
        };
        self.setLanguage = function( ) {
            self.debug( 'setLanguage' );
            // set the new translated links
            $( '#papierSteenSchaarLink' ).attr( "href", './?app=papierSteenSchaar&lang=' + gameDevelopment.getLanguage() );
            $( '#spaceInvadersLink' ).attr( "href", './?app=spaceInvaders&lang=' + gameDevelopment.getLanguage() );
            $( '#testLink' ).attr( "href", './?app=test&lang=' + gameDevelopment.getLanguage() );
            // doen set new translated links
            
            // translate text
            self.translate();
        };
        self.translate = function(){
            self.debug( 'translate' );
            // call for translation
            gameDevelopment.translate( 'menus', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // loop translation id's
            $.each( result, function( index, value ) {
                $('#' + index ).html( value );
            });
            // done loop translation id's
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
        };
    };
})( gameDevelopment );