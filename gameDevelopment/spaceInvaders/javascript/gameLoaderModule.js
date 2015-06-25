/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this module controls load of the assets, images and sounds for the application space invaders
*          displays a load screen with load progress information and cancel button
*           
* Last revision: 05-05-2015
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
    gameDevelopment.gameLoaderModule = function( ) {


    /*
     *  module gameLoaderModule 
     *   
     *  functions: 
     *      private:
     *          construct
     *          addHtml 
     *          addResources
     *          load                called by the public function
     *          cancelLoad 
     *          resourceLoaded      called from the event subscription
     *          displayMessage
     *          resourcesLoaded     called from the event subscription
     *          translateCallback 
     *          translate
     *          sceneChange         called from the event subscription
     *          debug
     *      public:
     *          load 
     *  event subscription: 
     *      resourceLoaded          called from resourcesModule of jsProject
     *      languageChange          called from the language module
     *      sceneChange             called by the game module
     *      
     *  event calls: 
     *      cancelLoad          called when load is canceled
     */
  
        // private
        var self = this;
        self.MODULE = 'gameLoaderModule';
        self.debugOn = false;
        self.callback = null;
        self.translationIds = [ "loaderScreenLoadLabel", "cancelButton" ];

        self.assets = [ { "name" : "stars", "type" : "image" },
                        { "name" : "world", "type" : "image" },
                        { "name" : "mars", "type" : "image" },
                        { "name" : "moon", "type" : "image" },
                        { "name" : "shipOne", "type" : "image" },
                        { "name" : "shipOneStarting", "type" : "image" },
                        { "name" : "shipOneExploding", "type" : "image" },
                        { "name" : "shipOneDestruct", "type" : "image" },
                        { "name" : "shipOneNew", "type" : "image" },
                        { "name" : "shipOneDestructNew", "type" : "image" },
                        { "name" : "exitButtonLeft", "type" : "image" },
                        { "name" : "exitButtonRight", "type" : "image" },
                        { "name" : "bunkerTop", "type" : "image" },
                        { "name" : "bunkerPart", "type" : "image" },
                        { "name" : "invaderOne", "type" : "image" },
                        { "name" : "bulletBasic", "type" : "image" },
                        { "name" : "bombOne", "type" : "image" },
                        { "name" : "bombTwo", "type" : "image" },
                        { "name" : "groundExplosionOne", "type" : "image" },
                        { "name" : "bombExplosionOne", "type" : "image" },
                        { "name" : "bulletExplosionOne", "type" : "image" },
                        { "name" : "difficultyOne", "type" : "image" },
                        { "name" : "difficultyOneOver", "type" : "image" },
                        { "name" : "difficultyTwo", "type" : "image" },
                        { "name" : "difficultyTwoOver", "type" : "image" },
                        { "name" : "difficultyThree", "type" : "image" },
                        { "name" : "difficultyThreeOver", "type" : "image" },
                        { "name" : "exit", "type" : "sound" } ];
        
        self.width = 350; // messagebox width px 
        self.height = 150; // messagebox height px
        self.message = "start...";

        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add the html
            self.addHtml();

            jsProject.subscribeToEvent( 'languageChange', self.translate );
            jsProject.subscribeToEvent( 'sceneChange', self.sceneChange );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            // add the html
            var html = '';
                html += '<div id="loaderBackground"';
                    html += 'style="position:absolute;z-index:' + jsProject.getValue( "loader", "zIndex" ) + ';';
                    html += 'background-color:transparent;';
                    html += '"';
                html += '>';
                    html += '<div id="loaderScreen" ';
                        html += 'style="position:absolute;';
                        html += '"';
                        html += ' class="panelBorder panelColor" ';
                    html += '>';
                        html += '<div id="loaderScreenLoadLabel" ';
                            html += 'style="font-size:1.1em;font-weight:normal;text-align:left;padding: 5px 0px 5px 30px;color:#25408f;';
                            html += 'border-top-left-radius: 5px;border-top-right-radius: 5px;';
                            html += '"';
                            html += ' class="panelColor" ';
                        html += '>';
                        html += '</div>';    
                        html += '<div id="loaderMessages" ';
                            html += 'style="overflow:hidden;:font-size:1.1em;font-weight:normal;text-align:left;color:grey;';
                            html += 'width:' + self.width + 'px;height:' + self.height + 'px;';                
                            html += 'padding:3px 5px;';                
                            html += 'border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;';
                            html += '"';
                        html += ' class="" ';
                        html += '>';
                        html += '</div>';    
                        html += '<div id="cancelButton" ';
                            html += 'style="width:80px;margin-left:135px;margin-bottom:15px;font-size:1.1em;font-weight:normal;padding:5px;text-align:center;padding: 4px 5px;color:#25408f;';
                            html += '"';
                        html += ' class="panelBorder hoverPanelColor" ';
                        html += '>';
                            html += "cancel";
                        html += '</div>';    
                    html += '</div>';    
                html += '</div>';    
            
            $('#game').append( html );
            //done add html 
            
            // hide the screen
            $('#loaderBackground').hide();
            
            // set the cancel event
            $( "#cancelButton" ).click( function(){ self.cancelLoad(); } );
           
            // call the translation function
            self.translate();
        };
        self.load = function( callback ) {
             
            self.callback = callback;
            self.debug( 'load' );
            
            
            // show the message screen
            self.sceneChange();
            $('#loaderBackground').show();
            
            // start messages
            self.displayMessage( "start.." );
            self.displayMessage( "" );
            // sound check
            self.displayMessage( "checking sound capabilities." );
            var validSoundType = null;
            self.displayMessage( "checking mp3." );
            if( jsProject.canPlaySoundType( 'mp3' ) ) {
                validSoundType = 'mp3';
                self.displayMessage( "can play mp3." );
            }
            
            if( !validSoundType ){
                self.displayMessage( "checking ogg." );
                if( jsProject.canPlaySoundType( 'ogg' ) ){
                    validSoundType = 'ogg';
                    self.displayMessage( "can play ogg." );
                }
            }
            if( !validSoundType ) {
                self.displayMessage( "No valid sound format found." );
            }
            //done sound check

            self.displayMessage( "" );
            
            self.displayMessage( "Loading assets." );
            
            jsProject.setValue( "validSoundType", "sound", validSoundType );
            // done check sound
            
            self.addResources();
            // done add the resources 

            // subscribe to the events
            jsProject.subscribeToEvent( 'resourceLoaded', self.resourceLoaded );

            // start the load
            jsProject.loadResources( self.resourcesLoaded );
            
        };
        self.cancelLoad = function() {
            $( '#loaderBackground' ).hide();
            
            // unsubscribe from the events
            jsProject.unSubscribeFromEvent( 'resourceLoaded', self.resourceLoaded );

            //reset the callback
            self.callback = null;
            
            // call the cancel event
            jsProject.callEvent( 'loadCancel' );
        };
        self.addResources = function() {
            // add the assets for preloading
            for( var i = 0; i < self.assets.length; i++ ){
                
                var validSoundType = jsProject.getValue( "validSoundType", "sound" )
                if( jsProject.getValue( "load", "sound" ) && validSoundType ){
                    if( self.assets[i]["type"] === "sound" ){
                        // add the sounds
                        if( !jsProject.getResource( self.assets[i]["name"], "sound" ) ){
                            self.debug( 'addResource: ' + self.assets[i]["name"] );
                            jsProject.addResource( self.assets[i]["name"], './spaceInvaders/sounds/' + self.assets[i]["name"] + '.' + validSoundType, 'sound' );
                        }
                    }
                    
                }
                if( self.assets[i]["type"] === "image" ){
                        // add the images
                        if( !jsProject.getResource( self.assets[i]["name"], "image" ) ){
                            self.debug( 'addResource: ' + self.assets[i]["name"] );
                            jsProject.addResource( self.assets[i]["name"], './spaceInvaders/images/' + self.assets[i]["name"] + '.png', 'image' );
                        }
                }
            }
        };
        self.resourceLoaded = function( ){
            // get and display the loader message
            $( '#loaderMessages' ).append( jsProject.getValue( "loadedResource", "resourceLoader" ) + "<br />" );
            // scroll the screen up
            $( '#loaderMessages' ).scrollTop(  $('#loaderMessages').prop( "scrollHeight" ) );
        };
        self.displayMessage = function( message ){
            // display the message
            $( '#loaderMessages' ).append( message + "<br />" );
            // scroll the screen up
            $( '#loaderMessages' ).scrollTop(  $('#loaderMessages').prop( "scrollHeight" ) );
        };
        self.resourcesLoaded = function(){
            self.debug( 'loaded' );
            
            self.displayMessage( "" );
            self.displayMessage( "" );
            self.displayMessage( "All loaded." );
            self.displayMessage( "" );
            self.displayMessage( "" );
            
            // unsubscribe from the events
            jsProject.unSubscribeFromEvent( 'resourceLoaded', self.resourceLoaded );
            
            // hide the loader screen
            $( '#loaderBackground' ).hide();
            // call the provided callback
            if( self.callback ){
                self.callback();
                self.callback = null;
            }
        };
        self.translate = function(){
            self.debug( 'translate' );
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            $.each( result, function( index, value ) {
                // set the translations for the html elements
                $('#' + index ).html( value );
            });
        };
        self.sceneChange = function( ) {
            self.debug( 'sceneChange' );
            
            // calculate the screen rect
            var bodyHeight = $( document.body ).height();
            var bodyWidth = $( document.body ).width();
            var top = ( bodyHeight - self.height ) / 2;
            var left = ( bodyWidth - self.width ) / 2;
            // set the background
            $( '#loaderBackground' ).css( 'top', '0px' );    
            $( '#loaderBackground' ).css( 'left', '0px' );    
            $( '#loaderBackground' ).css( 'height', bodyHeight + 'px' ); 
            $( '#loaderBackground' ).css( 'width', bodyWidth + 'px' );    
            
            // set the screen postion
            $( '#loaderScreen' ).css( 'top', top + 'px' );    
            $( '#loaderScreen' ).css( 'left', left + 'px' );    
            
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
            load : function( callback ){
                self.load( callback );
            }
        };
    };
})( gameDevelopment );