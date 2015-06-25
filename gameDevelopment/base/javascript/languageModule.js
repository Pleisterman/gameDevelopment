/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this module handles the translation calls for the application gameDevelopment
 *               the module add the functions translate and getLanguage to the module gameDevelopment 
 *               the module adds a menu button to the layout
 *               
 * Last revision: 03-06-2015
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
    gameDevelopment.languageModule = function( menuDivName ) {


    /*
     *  module languageModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addMenu                 called internal, by the construct function
     *          languageChange          called by the menu button and construct function
     *          translate               called through the added function translate of gameDevelopment
     *          getLanguage             called through the added function translate of gameDevelopment
     *          debug
     *          
     *  event calls: 
     *      languageChange              called by the menu button and the construct function    
     */
    
        // private
        var self = this;
        self.MODULE = 'languageModule';
        self.debugOn = false;
        self.menuDivName = menuDivName;                     // store the menu div id
        self.language = gameDevelopment.defaultLanguage;    // store language = default
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            // check if the div in the layout exists
            if( self.menuDivName ){
                // add the language menu
                self.addMenu();
            }
            
            // add the functions to the gameDevelopment module
            gameDevelopment.translate = self.translate;
            gameDevelopment.getLanguage = self.getLanguage;
            // done add the functions to the gameDevelopment module
            
        };
        self.addMenu = function() {
            var html = '';
            // add css
            html += '' + "\n";        
            html += '<style> ' + "\n";
                html += ' .languageSelection { ' + "\n";
                html += '    float:left; ' + "\n";
                html += '  }' + "\n" + "\n";

                html += ' .languageSelectionButton { ' + "\n";
                html += '    float:right; ' + "\n";
                html += '    padding-left: 3px; ' + "\n";
                html += '    padding-right: 3px; ' + "\n";
                html += '    padding-top: 5px; ' + "\n";
                html += '    padding-bottom: 5px; ' + "\n";
                html += '    margin-top: 4px; ' + "\n";
                html += '    margin-left: 4px; ' + "\n";
                html += '    margin-bottom: 4px; ' + "\n";
                html += '    cursor: pointer; ' + "\n";
                html += '    min-width: 25px; ' + "\n";
                html += '    text-align: center; ' + "\n";
                html += '  }' + "\n" + "\n";
            html += '</style> ' + "\n";
            // done add css

            // add the menu divs for language selection
            html += '<div languageSelection">';
                for( var i = 0; i < gameDevelopment.languages.length; i++ ){
                    html += '<div id="languageButton_' + i + '" class="panelBorder panelShadow panelBorder hoverPanelColor languageSelectionButton" >';
                        html += gameDevelopment.languages[i];
                    html += '</div>';
                }
            html += '</div>';    
            $('#' + self.menuDivName ).append( html );   
            // done add the menu divs for language selection
            
            // loop over the created divs
            for( var i = 0; i < gameDevelopment.languages.length; i++ ){
                if( gameDevelopment.languages[i] === gameDevelopment.defaultLanguage ){
                    // hide button of selected language
                    $('#languageButton_' + i ).hide();
                }
                // add event to change language to button
                $('#languageButton_' + i ).click( function(){
                    self.languageChange( this );
                } );   
                // done add event to change language to button
            }
            // done loop over the created divs
        };
        self.languageChange = function( element ) {
            self.debug( 'languageChange ' );
            // split element to get array position of the language
            var arr = element.id.split( '_' );
            var selection = parseInt( arr[1] );
            // loop over language array
            for( var i = 0; i < gameDevelopment.languages.length; i++ ){
                if( i === selection ){
                    // current selection hide menu option
                    $('#languageButton_' + i ).hide();
                    self.language = gameDevelopment.languages[i];
                }
                else {
                    // show other menu option
                    $('#languageButton_' + i ).show();
                }
            }
            // done loop over language array
            
            // call the event to change the texts of the modules
            jsProject.callEvent( 'languageChange' );
        };
        self.translate = function( subject, ids, callback ){
            self.debug( 'translate ' + subject + " language:" + self.language );
            // create a data structure
            var data = { 'subject'  : subject,
                         'ids'  : ids.join(),
                         'language' : self.language   };
            // call the ajax event         
            gameDevelopment.post( './php/language/translate.php', data, callback );
        };
        self.getLanguage = function( ){
            // return selected language
            return self.language;
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