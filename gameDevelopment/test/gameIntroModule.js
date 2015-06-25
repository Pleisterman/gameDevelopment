/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the gameIntroModule for the application pleisterman Guitar Slider
* Last revision: 26-08-2014
* 
* NOTICE OF LICENSE
*
* All of the material on this site is protected by copyright 
* only code that is explicitly made available for copying may be 
* copied without permission. 
* 
* Where code is made available to be copied all of the conditions 
* within the existing or modified code as well as the conditions on the page 
* where you found it must be observed when you use the code on your site.
* 
*/

( function( gameDevelopment ){
    gameDevelopment.gameIntroModule = function( ) {


    /*
     *  module gameIntroModule 
     *  purpose:
     *   this module controls gameIntroModule for the pps.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'gameIntroModule';
        self.debugOn = false;
        self.translationIds = [ "appTitle", "introText", "nameLabel", "defaultUserName", "loadSound", "soundLoaded", "loadEffects", "effectsLoaded", "mobileInfo" ];
        self.loadSoundTranslation = "";
        self.soundLoadedTranslation = "";
        self.loadEffectsTranslation = "";
        self.effectsLoadedTranslation = "";
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            self.addHtml();
            jsProject.subscribeToEvent( 'languageChange', self.translate );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
                html += '<div id="introHtml">';
                    html += '<div class="introTitle">';
                        html += '<span id="appTitle"></span>';
                    html += '</div>';    
                    html += '<div class="introText">';
                        html += '<div class="introTextLine">';
                            html += '<span id="introText" style="line-height:1.4;"></span>';
                        html += '</div>';    
                    html += '</div>';    
                    html += '<div class="introText" ';
                        html += 'style="margin-bottom:20px;';
                        html += '"';
                    html += '>';
                        html += '<span id="nameLabel" ';
                            html += 'style="font-size:1.1em;font-weight:normal;text-align:left;margin-left:40px;color:#25408f;';
                            html += '"';
                        html += '>';
                        html += '</span>';
                        html += '<input id="userName" type="text" size="10" value="">';
                    html += '</div>';
                    if( !gameDevelopment.isMobileBrowser ){
                        html += '<div id="loadSoundButton" ';
                            html += 'style="float:left;font-size:1.2em;font-weight:normal;padding:5px;text-align:left;margin-left:120px;margin-top:5px;color:#25408f;';
                            html += 'width:180px;text-align:center;cursor:pointer;cursor:hand;"';
                        html += ' class="panelBorder hoverPanelColor">';
                        html += '</div>';

                        html += '<div id="loadEffectsButton" ';
                            html += 'style="float:left;font-size:1.2em;font-weight:normal;padding:5px;text-align:left;margin-left:15px;margin-top:5px;color:#25408f;';
                            html += 'width:180px;text-align:center;cursor:pointer;cursor:hand;"';
                        html += ' class="panelBorder hoverPanelColor">';
                        html += '</div>';
                    }

                    html += '<div id="startButton" ';
                        html += 'style="float:left;font-size:1.2em;font-weight:normal;padding:5px;text-align:left;margin-left:15px;margin-top:5px;color:#25408f;';
                        html += 'width:90px;text-align:center;cursor:pointer;cursor:hand;"';
                    html += ' class="panelBorder hoverPanelColor">';
                    html += '</div>';

                    html += '<div id="mobileInfo" ';
                    if( gameDevelopment.isMobileBrowser ){
                            html += 'style="font-size:1.0em;font-weight:normal;padding:5px;text-align:left;margin-left:20px;margin-top:65px;color:black;"';
                            html += '>';
                    }
                    else {
                        html += 'style="display:none;"';
                        html += '>';
                    }
                    html += '</div>';
                html += '</div>';    

            
                
                
                
            $('#content').html( html );
            $('#userName').focus();
        };
        self.soundLoaded = function( ){
            self.debug( 'soundLoaded' );
            $('#loadSoundButton' ).html( self.soundLoadedTranslation );
            $('#loadSoundButton' ).removeClass( "hoverPanelColor" );
        };
        self.effectsLoaded = function(){
            self.debug( 'effectsLoaded' );
            $('#loadEffectsButton' ).html( self.effectsLoadedTranslation );
            $('#loadEffectsButton' ).removeClass( "hoverPanelColor" );
        };
        self.translate = function(){
            self.debug( 'translate' );
            gameDevelopment.translate( 'papierSteenSchaar', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            $.each( result, function( index, value ) {
                switch( index ) {
                    case 'defaultUserName' : {
                        $('#userName').val( value );
                        break;
                    }
                    case 'loadSound' : {
                        self.loadSoundTranslation = value;
                        break;
                    }
                    case 'soundLoaded' : {
                        self.soundLoadedTranslation = value;
                        break;
                    }
                    case 'loadEffects' : {
                        self.loadEffectsTranslation = value;
                        break;
                    }
                    case 'effectsLoaded' : {
                        self.effectsLoadedTranslation = value;
                        break;
                    }
                    default : {
                        $('#' + index ).html( value );
                    }
                }
            });
            self.translateButtons();
        };
        self.translateButtons = function() {
            if( !jsProject.getValue( "loaded", "sound" ) ){
                $('#loadSoundButton' ).html( self.loadSoundTranslation );
            }
            else {
                $('#loadSoundButton' ).html( self.soundLoadedTranslation );
            }
            if( !jsProject.getValue( "loaded", "effects" ) ){
                $('#loadEffectsButton' ).html( self.loadEffectsTranslation );
            }
            else {
                $('#loadEffectsButton' ).html( self.effectsLoadedTranslation );
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
            soundLoaded : function(){
                self.soundLoaded();
            },
            effectsLoaded : function(){
                self.effectsLoaded();
            }
        };
    };
})( gameDevelopment );