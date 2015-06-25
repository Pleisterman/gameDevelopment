/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the intro for the application space invaders
 *          displays a title and text
 *          displays a text box for the player name
 *          displays a sound on/off toggle button
 *          displays the game start button
 *           
 * Last revision: 19-05-2015
 * 
 * Status:   code:               ready
 *           comments:           ready
 *           memory:             ready
 *           development:        ready
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
    gameDevelopment.introModule = function( callback ) {


    /*
     *  module introModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          addHtml                 called internal by construct function
     *          click                   called by html start button
     *          translate               called by the event subscription languageChange
     *          translateCallback       calback for translate function
     *          debug
     *          
     *  event subscription: 
     *      languageChange              called from languageModule
     */
    
        // private
        var self = this;
        self.MODULE = 'introModule';
        self.debugOn = false;
        self.callback = callback;               // store callback for startbutton click
        self.translationIds = [ "appTitle",     // translation id's that should be translated during translate function
                                "introText", 
                                "nameLabel", 
                                "defaultUserName" ]; 
        self.soundButton = null;                // store soundButton; toggleButtonModule
        self.userNameChanged = false;           // store if user name is changed, for translation. default username is not used when name is changed
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add the html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'languageChange', self.translate );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            
            // add html 
            var html = '';
                // add css 
                html += '<style>' + "\n";
                    html += ' .introSoundButton { ' + "\n";
                    html += '    background-image:url( ./spaceInvaders/images/soundButtonOn.png );' + "\n";
                    html += '  }' + "\n" + "\n";
                    html += ' .introSoundButtonOn { ' + "\n";
                    html += '    background-image:url( ./spaceInvaders/images/soundButtonOn.png );' + "\n";
                    html += '  }' + "\n" + "\n";
                    html += ' .introSoundButtonOnOver { ' + "\n";
                    html += '    background-image:url( ./spaceInvaders/images/soundButtonOnOver.png );' + "\n";
                    html += '  }' + "\n" + "\n";
                    html += ' .introSoundButtonOff { ' + "\n";
                    html += '    background-image:url( ./spaceInvaders/images/soundButtonOff.png );' + "\n";
                    html += '  }' + "\n" + "\n";
                    html += ' .introSoundButtonOffOver { ' + "\n";
                    html += '    background-image:url( ./spaceInvaders/images/soundButtonOffOver.png );' + "\n";
                    html += '  }' + "\n" + "\n";
                html += '</style>' + "\n";
                // done add css 
            
                html += '<div id="introHtml">';
                    html += '<div class="introTitle">';
                        html += '<span id="appTitle"></span>';
                    html += '</div>';    
                    html += '<div class="introText">';
                        html += '<div class="introTextLine">';
                            html += '<span id="introText" ></span>';
                        html += '</div>';    
                    html += '<div class="introText" ';
                        html += 'style="margin-bottom:20px;';
                        html += '"';
                    html += '>';
                        html += '<div id="nameLabel" ';
                            html += 'style="float:left;font-size:1.1em;font-weight:normal;text-align:left;margin-left:30px;margin-top:17px;color:#25408f;';
                            html += '"';
                        html += '>';
                        html += '</div>';
                        html += '<input id="userName" type="text" size="10" value=""';
                            html += 'style="float:left;font-size:1.1em;font-weight:normal;margin-left:14px;margin-top:14px;color:black;';
                            html += '"';
                        html += '>';
                        html += '<div id="introSoundButton" ';
                            html += 'style="float:left;margin-left:15px;';
                            html += 'width:40px;height:40px;cursor:pointer;cursor:hand;';
                            html += 'background-repeat:no-repeat;background-position:center center;';
                            html += ' "';
                            html += ' class="panelBorder introSoundButton" ';
                        html += '>';
                        html += '</div>';
                    html += '<div id="startButton" ';
                        html += 'style="float:left;clear:left;font-size:1.2em;font-weight:normal;padding:5px;text-align:left;margin-left:120px;margin-top:15px;color:#25408f;';
                        html += 'width:90px;text-align:center;cursor:pointer;cursor:hand;"';
                    html += ' class="panelBorder hoverPanelColor" ';
                    html += '>';
                        html += "Start";
                    html += '</div>';    
                html += '</div>';    

            $('#content').html( html );
            //done add html 
                
            // create the sound button
            self.soundButton = gameDevelopment.toggleButtonModule( "introSoundButton", false, self.soundButtonClick );
            
            // add the click event to the start button
            $( "#startButton" ).click( function(){ self.click(); } );

            // set change event for userName
            $('#userName').change( function(){
                self.userNameChanged = true;
                $('#userName').unbind();
            }); 

            // set the focus
            $('#userName').focus();
            
        };
        self.click = function(){
            self.debug( 'click' );

            // set the UserName
            if( self.userNameChanged ){
                self.debug( "setUsername" + $('#userName').val( ) );
                jsProject.setValue( "userName", "game", $('#userName').val( ) ); 
            }

            // call provided callback
            if( self.callback ){
                self.callback();
            }
            else {
                self.debug( "warning start callback not provided." );
            }
            // done call provided callback
        };
        self.soundButtonClick = function( on ) {
            self.debug( 'soundButtonClick' + on );
            jsProject.setValue( "load", "sound", on );
            jsProject.setValue( "on", "sound", on );
        };
        self.translate = function(){
            self.debug( 'translate' );
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                switch( index ) {
                    case 'defaultUserName' : {
                        // change user name to default userName value if not changed
                        if( !self.userNameChanged ){
                            $('#userName').val( value );
                        }
                        break;
                    }
                    default : {
                        // set html element translations    
                        $('#' + index ).html( value );
                    }
                }
            });
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