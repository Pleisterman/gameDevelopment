/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this file creates a basic layout for the application gameDevelopment
 *               the module creates a logo, a top menu, header, a content and a footer part 
 *               the module handles the logo link for translated links  
 *               the module translates the document title and footer part
 *               
 * Last revision: 04-06-2015
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       ready
 *           
 * NOTICE OF LICENSE
 *
 * Copyright (C) 2014  Pleisterman
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
    gameDevelopment.layoutModule = function( ) {


    /*
     *  module layoutModule 
     *  purpose:
     *      this file creates a basic layout for the application gameDevelopment
     *      the module creates a logo, a top menu, header, a content and a footer part 
     *      the module handles the logo link for translated links  
     *      the module translates the document title and footer part
     *   
     *  functions: 
     *      private:
     *          construct                       called internal
     *          addHtml                         called by the construct function
     *          translate                       called by the event subscription languageChange
     *          translateCallback               callback for translate function
     *          setLogo                         called by the translateCallback function
     *          debug
     *          
     *  event subscription: 
     *      languageChange         called from languageModule
     */
    
        // private
        var self = this;
        self.MODULE = 'layoutModule';
        self.debugOn = false;
        self.translationIds = [ "documentTitle", // translation id's that should be translated during translate function
                                "footerPart1", 
                                "footerPart2" ];

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html 
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'languageChange', self.translate );
        };
        self.addHtml = function() {
            self.debug( 'addCss' );
            var html = '';
            // logo
            html += '<button id="logo" class="logo" type="button" class="logo"  style="border-radius:5px;background-image:url(./base/images/logo.png);background-repeat:no-repeat;background-color:transparent; ">';
            html += '</button>';    

            // header image
            html += '<div class="header" style="background-image:url(' + './base/images/mainHeaderBackground.png' + ');background-repeat:no-repeat; ">' + "\n";
            html += '</div>' + "\n";
            
            // top menu
            html += '<div class="topMenu" id="topMenu">' + "\n";
            html += '</div>' + "\n";

            // content
            html += '<div id="main" class="panelBorder panelShadow invertedPanelColor panel">';
                html += '<div id="contentMenu" class="contentMenu">';
                html += '</div>';    
                html += '<div id="content" class="content">';
                html += '</div>';    
            html += '</div>';    

            // footer
            html += '<div id="footer" class="footer">';
                html += '<span id="footerPart1">';
                html += '</span>';
                html += '<a href="mailto:info@pleisterman.nl">info@pleisterman.nl</a>';
                html += '<span id="footerPart2">';
                html += '</span>';
            html += '</div>';    
            
            // add to scene
            $('#jsProjectScene').append( html );
        };
        self.translate = function(){
            self.debug( 'translate' );
            // make a ajax call for the translations
            gameDevelopment.translate( 'base', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                self.debug( 'translateCallback' + index );
                // translate document title
                if( index === 'documentTitle' ){
                    document.title = value;
                }
                else {
                    // translate html
                    $('#' + index ).html( value );
                }
            } );
            
            // set the logo for the language
            self.setLogo();
        };
        self.setLogo = function(){
            self.debug( 'setLogo' );
            
            if( gameDevelopment.getLanguage() === 'nl' ){
                $('#logo').css( 'background-image', 'url( ./base/images/logo.png )'  );
                $('#logo').off();  
                $('#logo').click( function(){ window.location = '/gameDevelopment/gameDevelopment'; } );  
            }
            else {
                $('#logo').css( 'background-image', 'url( ./base/images/logo_en.png )'  );
                $('#logo').off();  
                $('#logo').click( function(){ window.location = '/gameDevelopment/gameDevelopment?lang=en'; } );  
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
        };
    };
})( gameDevelopment );