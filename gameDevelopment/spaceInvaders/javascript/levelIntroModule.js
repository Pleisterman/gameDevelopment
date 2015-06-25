/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the lives for the application space invaders
 *          the lives draws the number of lives on the right top side of the screen
 *          every live is represented by a ship on the screen drawing from top to bottom
 *          
 * Last revision: 23-05-2015
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
    gameDevelopment.levelIntroModule = function( ) {


        /*
         *  module levelIntroModule 
         *   
         *  functions: 
         *      private:
         *          construct                   called internal
         *          show                        called by the public function
         *          hide                        called by the public function
         *          handleResources             called from the show function, frees and loads level sounds and images
         *          resourceLoaded              called from a eent subscription to the resourceLoaded event
         *          resourcesLoaded             callback for the loadResources function called in function handleResources 
         *          calculateFontsSize          called from the layout function
         *          layoutChange                called from event subscription
         *          animate                     called from layoutChange and event subscription
         *          translate                   called from the event subscription, show function
         *          translateCallback           callback for the translate function
         *          translateIntroText          called from the show function
         *          translateIntroTextCallback  callback for the translateIntroText function
         *          debug
         *      public:
         *          show 
         *          hide
         *          
         *  event subscription: 
         *      layoutChange                    called from gameLayoutModule
         *      animate                         called from gameModule
         *      languageChange                  called from languageModule
         */
  
    
        // private
        var self =                  this;
        self.MODULE =               'levelIntroModule';
        self.debugOn =              false;
        self.visible =              false;                                          // visibility
        self.callback =             null;                                           // store the callback, called when resources are loaded 
        self.canvasSurface =        null;                                           // store the surface to draw on                
        self.position = {           "height" :              90,                     // constant percentage of background height
                                    "width" :               80 };                   // constant percentage of background width
        self.drawRect = {           "top" :                 0,                      // px, calculated size
                                    "left" :                0,                      // px, calculated size
                                    "height" :              0,                      // px, calculated size
                                    "width" :               0 };                    // px, calculated size
        self.loadingText = {        "id" :                  "loadingLevel",         // translation id
                                    "translation" :         null,                   // translation string
                                    "count" :               0,                      // count for waiting ... animation
                                    "countMaximum" :        3,                      // maximum of points in waiting animation
                                    "fontSize" :            4.5,                    // fontsize of the text
                                    "fittingFontSize" :     4.5,                    // calculated font that will fit the screen
                                    "top" :                 92,                     // percentage of background
                                    "left" :                3,                      // percentage of background
                                    "width" :               95,                     // percentage of background
                                    "height" :              20,                     // percentage of background
                                    "fileText" :            "",                     // filename that is being loaded
                                    "allLoaded" :           false,                  // all files loaded
                                    "proceedTextId" :       "pressSpaceToStarLevel",// translation id  
                                    "proceedTranslation" :  "" };                   // translated string
        self.borderWidth =          10;                                             // widht of the rounded border
        self.lineWidth =            10;                                             // width of the line of the border        
        self.font = "               Arial";                                         // store the font set by jsProject value font                
        self.introText = {          "id" :              "",                         // translation id
                                    "loaded" :          false,                      // store if text translation is loaded
                                    "top" :             4,                          // percentage of background
                                    "left" :            3,                          // percentage of background                
                                    "height" :          74,                         // percentage of background
                                    "width" :           110,                        // percentage of background
                                    "fontSize" :        3.5,                        // fontsize of the text
                                    "fittingFontSize" : 3.5,                        // calculated font that will fit the screen
                                    "linePadding" :     0.5,                        // percentage of background padding between lines of text
                                    "translation" :     null,                       // translated text
                                    "displayDone" :     false,                      // all lines have been displayed
                                    "count" :           0 };                        // store the lines that are being displayed, lines are displayed one by one
        self.animationDelay =       400;                                            // ms
        self.lastAnimationDate =    0;                                              // save last animation time for delay
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'messagesDrawLayer' ).getContext( '2d' );

            // get the font and size 
            self.font = jsProject.getValue( "font", "layout" );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'languageChange', self.translate );
            // done subscribe to events
            
            self.translate();
        };
        self.show = function( callback ) {
            // pauze the animation
            self.callback = callback;
            self.debug( 'show' );
            
            self.introText["id"] = jsProject.getValue( "introTextId", "level" );
            self.introText["count"] = 0;
            self.introText["loaded"] = false;
            self.translateIntroText();
            self.handleResources();
            
            // change the layout according to new dimensions
            self.visible = true;

            self.layoutChange();
        };
        self.hide = function( ) {
            self.debug( 'hide' );

            self.visible = false;
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
        };
        self.handleResources = function( ) {
            // get the resources that can be freed      
            var freeResources = jsProject.getValue( "freeResources", "level" )
            // loop over the resources
            for( var i = 0; i < freeResources.length; i++ ){
                jsProject.freeResource( freeResources[i]['name'], freeResources[i]['type'] );
            }
            // done loop over the resources
            
            // get the new resources to add
            var addResources = jsProject.getValue( "addResources", "level" )
            var validSoundType = jsProject.getValue( "validSoundType", "sound" )
            // loop over the resources
            for( var i = 0; i < addResources.length; i++ ){
                if( jsProject.getValue( "load", "sound" ) && validSoundType ){
                    if( self.addResources[i]["type"] === "sound" ){
                        // add the sounds
                        if( !jsProject.getResource( self.addResources[i]["name"], "sound" ) ){
                            self.debug( 'addResource: ' + self.addResources[i]["name"] );
                            jsProject.addResource( self.addResources[i]["name"], './spaceInvaders/sounds/' + self.addResources[i]["name"] + '.' + validSoundType, 'sound' );
                        }
                    }
                    
                    if( self.addResources[i]["type"] === "image" ){
                            // add the images
                            if( !jsProject.getResource( self.addResources[i]["name"], "image" ) ){
                                self.debug( 'addResource: ' + self.addResources[i]["name"] );
                                jsProject.addResource( self.addResources[i]["name"], './spaceInvaders/images/' + self.addResources[i]["name"] + '.png', 'image' );
                            }
                    }
                }
            }
            // done loop over the resources
            
            // subscribe to the resource loaded event called after each resource loads
            jsProject.subscribeToEvent( 'resourceLoaded', self.resourceLoaded );

            // start the load
            jsProject.loadResources( self.resourcesLoaded );
        };
        self.resourceLoaded = function( ){
            // get and display the loader message
            self.loadingText["fileText"] = jsProject.getValue( "loadedResource", "resourceLoader" );
        };
        self.resourcesLoaded = function(){
            // all resources are loaded
            // unsubscribe from the events
            jsProject.unSubscribeFromEvent( 'resourceLoaded', self.resourceLoaded );
            self.loadingText["allLoaded"] = true;
            self.loadingText["fileText"] = '';
            self.debug( "loaded" );
            // call the callback to notify all files are loaded
            self.callback();
        };
        self.calculateFontsSize = function( ) {
            if( !self.introText["loaded"] ){
                // wait for load
                return;
            }
            self.debug( "calculateFonts" );
            var width = 0, height = 0;
            var fontSize = 0;
            var titleFontSize = 0;
            var linePadding = 0;
            var foundFit = false;
            var textHeight = 0;
            
            // check intro text
            // check for height 
            // set fittingFontSize = fontSize 
            self.introText["fittingFontSize"] = self.introText["fontSize"];
            // calculate height of textarea  in px
            height = ( self.drawRect["height"] / 100 ) * self.introText["height"];
            foundFit = false;
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( self.drawRect["height"] / 100 ) * self.introText["fittingFontSize"];
                // calculate linePadding in px
                linePadding = ( self.drawRect["height"] / 100 ) * self.introText["linePadding"];
                // calculate total height
                textHeight = ( fontSize * ( self.introText["translation"].length ) );
                textHeight += ( linePadding * ( self.introText["translation"].length - 1 ) );
                // done calculate total height
                if( textHeight > height ){
                    // to big
                    if( self.introText["fittingFontSize"] > 2 ){
                        self.introText["fittingFontSize"] -= 0.2;
                    } 
                    else {
                        // give up minimum reached
                        foundFit = true;
                    }
                }
                else {
                    foundFit = true;
                }
            }            
            // done check for height 
            
            var textWidth = 0;
            // check for width loop over texts
            width = ( self.drawRect["width"] / 100 ) * self.introText["width"];
            for( var i = 0; i < self.introText["translation"].length; i++ ){
                // check for width
                foundFit = false;        
                // while to long
                while( !foundFit ){
                    // calculate fontSize in px
                    fontSize = ( $( "#background" ).height() / 100 ) * self.introText["fittingFontSize"];
                    self.canvasSurface.font = fontSize + "px " + self.font;
                    // get text width
                    textWidth = self.canvasSurface.measureText( self.introText["translation"][i] ).width;
                    if( textWidth > width ){
                        // to long
                        if( self.introText["fittingFontSize"] > 2 ){
                            self.introText["fittingFontSize"] -= 0.2;
                        } 
                        else {
                            // give up minimum reached
                            foundFit = true;
                        }
                    }
                    else {
                        foundFit = true;
                    }
                    
                }
            }
            // done check intro text
            
            // check proceed text
            // check for height 
            // set fittingFontSize = fontSize 
            self.loadingText["fittingFontSize"] = self.loadingText["fontSize"];
            // calculate height of textarea  in px
            height = ( self.drawRect["height"] / 100 ) * self.loadingText["height"];
            foundFit = false;
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( self.drawRect["height"] / 100 ) * self.loadingText["fittingFontSize"];
                // calculate total height
                // done calculate total height
                if( fontSize > height ){
                    // to big
                    if( self.loadingText["fittingFontSize"] > 2 ){
                        self.loadingText["fittingFontSize"] -= 0.2;
                    } 
                    else {
                        // give up minimum reached
                        foundFit = true;
                    }
                }
                else {
                    foundFit = true;
                }
            }            
            // done check for height 
            
            var textWidth = 0;
            // check for width loop over texts
            width = ( self.drawRect["width"] / 100 ) * self.loadingText["width"];
            // check for width
            foundFit = false;        
            // while to long
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( $( "#background" ).height() / 100 ) * self.loadingText["fittingFontSize"];
                self.canvasSurface.font = fontSize + "px " + self.font;
                // get text width
                textWidth = self.canvasSurface.measureText( self.loadingText["proceedTranslation"] ).width;
                if( textWidth > width ){
                    // to long
                    if( self.loadingText["fittingFontSize"] > 2 ){
                        self.loadingText["fittingFontSize"] -= 0.2;
                    } 
                    else {
                        // give up minimum reached
                        foundFit = true;
                    }
                }
                else {
                    foundFit = true;
                }
            }
            // done check proceed text
            
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;
            self.debug( 'layoutChange' );

            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  

            // set the draw rect
            self.drawRect["height"] = ( ( $( '#background' ).height() / 100 ) * self.position["height"] );
            self.drawRect["width"] = ( ( $( '#background' ).width() / 100 ) * self.position["width"] );
            self.drawRect["top"] = ( $( '#background' ).height() - self.drawRect["height"] ) / 2;
            self.drawRect["left"] = ( $( '#background' ).width() - self.drawRect["width"] ) / 2;
            // done set the draw rect

            self.calculateFontsSize();

            self.visible = true;
            // animate without delay
            self.animate( true );
        };
        self.animate = function( skipDelay ){
            if( !self.visible ){
                return;
            }
            
            // check for delay
            var date = new Date();
            if( !skipDelay ){
                if( date - self.lastAnimationDate < self.animationDelay ){
                    return;
                }
            }

            // done delay
            self.lastAnimationDate = date;
                
            self.canvasSurface.clearRect( 0,0, $( "#background" ).width(), $( "#background" ).height() );

            // draw outer rect
            self.canvasSurface.strokeStyle = "rgba(0,0,0,0.7)";
            self.canvasSurface.fillStyle = "rgba(0,0,0,0.7)";
            self.canvasSurface.lineWidth = self.lineWidth;
            

            var top = 0, left = 0, right = 0, bottom = 0, width = 0, height = 0;;
                        self.canvasSurface.beginPath();

            
            
            top = self.drawRect["top"] + self.lineWidth / 2;
            left = self.drawRect["left"] + self.borderWidth + self.lineWidth / 2;
            self.canvasSurface.moveTo( left, top );
            
            left = self.drawRect["left"] + self.drawRect["width"] - ( self.borderWidth + ( self.lineWidth / 2 ) );
            self.canvasSurface.lineTo( left, top );
            self.canvasSurface.quadraticCurveTo( left + self.borderWidth, top, left + self.borderWidth, top + self.borderWidth );
            bottom = self.drawRect["top"] + self.drawRect["height"] - ( self.borderWidth + ( self.lineWidth / 2 ) ); 
            self.canvasSurface.lineTo( left + self.borderWidth, bottom );
            self.canvasSurface.quadraticCurveTo( left + self.borderWidth, bottom + self.borderWidth, left, bottom + self.borderWidth );
            left = self.drawRect["left"] + self.lineWidth / 2;
            self.canvasSurface.lineTo( left + self.borderWidth, bottom + self.borderWidth );
            self.canvasSurface.quadraticCurveTo( left, bottom + self.borderWidth, left, bottom );
            self.canvasSurface.lineTo( left, top  + self.borderWidth );
            self.canvasSurface.quadraticCurveTo( left, top, left + self.borderWidth, top );
            self.canvasSurface.stroke();
            // done draw outer rect

            // draw inner rect
            top = ( self.drawRect["top"] - 1 ) + self.lineWidth;
            left = ( self.drawRect["left"] - 1 ) + self.lineWidth;
            height = ( self.drawRect["height"] + 1 ) - ( self.lineWidth * 2 );
            width = ( self.drawRect["width"] + 1 ) - ( self.lineWidth  * 2 );
            self.canvasSurface.fillRect( left, top, width, height );
            // done draw inner rect
            
            // introText
            self.canvasSurface.fillStyle = 'whitesmoke';
            // calculate the position px
            var left = self.drawRect["left"] + ( ( self.drawRect["width"] / 100 ) * self.introText["left"] );
            var top = self.drawRect["top"] + ( ( self.drawRect["height"] / 100 ) * self.introText["top"] );
            // done calculate the position px
            // calculate line padding
            var linePadding = ( self.drawRect["height"] / 100 ) * self.introText["linePadding"];
            // calculate font size
            var fontSize = ( self.drawRect["height"] / 100 ) * self.introText["fittingFontSize"];
            if( self.introText["loaded"] ){
                //set the font
                self.canvasSurface.font = fontSize + "px " + self.font;
                // loop over intro text till count, animates text one line at per animation step
                for( var i = 0; i < self.introText["count"]; i++ ){
                    // add the line height
                    top += fontSize + linePadding;
                    // draw the text
                    self.canvasSurface.fillText( self.introText["translation"][i], left, top );
                }
                if( self.introText["count"] < self.introText["translation"].length ){
                    // next animation step
                    self.introText["count"]++;
                }
                else {
                    // animation ready
                    self.introText["displayDone"] = true;
                }
            }
            // done introText
            
            // loading text
            // calculate the fontSize
            var fontSize = ( self.drawRect["height"] / 100 ) * self.loadingText["fittingFontSize"];
            // set font
            self.canvasSurface.font = fontSize + "px " + self.font;
            // calculate position
            top = ( self.drawRect["height"] / 100 ) * self.loadingText["top"] + fontSize;
            if( self.loadingText["allLoaded"] ){
                // all files are loaded 
                self.canvasSurface.fillText( self.loadingText["proceedTranslation"], left, top );
            }
            else {
                // create animated wait
                var points = ".";
                for( var i = 0; i < self.loadingText["count"]; i++ ){
                    points += ".";
                }
                // done create animated wait
                
                // draw the text
                self.canvasSurface.fillText( self.loadingText["translation"] + " " + self.loadingText["fileText"] + " " + points, left, top );
                
                // update animated wait
                self.loadingText["count"]++;
                if( self.loadingText["count"] >= self.loadingText["countMaximum"] ){
                    self.loadingText["count"] = 0;
                }
                // done update animated wait
            }
            // done loading text
            
        };
        self.translate = function(){
            self.debug( 'translate' );

            // create translation id array
            var translationIds = []
            translationIds.push( self.loadingText["id"] );
            translationIds.push( self.loadingText["proceedTextId"] );
            // done create translation id array
            
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                if( self.loadingText["id"] === index ){
                    self.loadingText["translation"] = value;
                }
                if( self.loadingText["proceedTextId"] === index ){
                    self.loadingText["proceedTranslation"] = value;
                }
            });
        };
        self.translateIntroText = function(){
            self.debug( 'translateIntroText' );
            
            // create translation id array
            var translationIds = []
            translationIds.push( self.introText["id"] );
            // done create translation id array
            
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateIntroTextCallback );
        };
        self.translateIntroTextCallback = function( result ){
            self.debug( 'translateIntroTextCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                if( self.introText["id"] === index ){
                    self.introText["translation"] = value.split( "<br />" );
                    self.introText["loaded"] = true;
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
            show : function( callback ){
                self.show( callback );
            },
            hide : function(){
                self.hide()
            }
        };
    };
})( gameDevelopment );