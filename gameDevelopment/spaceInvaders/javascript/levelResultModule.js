/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Module: levelResultModule 
 *  
 * Purpose: this module displays the level results for the application space invaders
 *          text will be displayed praising the user for completing the level
 *          The score for the level and total score are displayed
 *          
 * Last revision: 23-06-2015
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
    gameDevelopment.levelResultModule = function( ) {


        /*
         *  module levelResultModule 
         *  
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          hide                called by the public function
         *          calculateFontsSize  called from layoutChange
         *          resetResult         called by the public function
         *          layoutChange        called from event subscription
         *          animate             called from layoutChange and event subscription
         *          getTranslation      called from animate
         *          translate           called from the event subscription, show function
         *          translateCallback   callback for the translate function
         *          debug
         *      public:
         *          show 
         *          hide
         *          resetResult
         *          
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         *      animate                 called from gameModule  
         *      languageChange          called from languageModule
         */
  
    
        // private
        var self =                  this;
        self.MODULE =               'levelResultModule';
        self.debugOn =              false;
        self.visible =              false;                                          // visibility
        self.canvasSurface =        null;                                           // store the surface to draw on    
        self.animationDelay =       400;                                            // ms
        self.lastAnimationDate =    0;                                              // save last animation time for delay
        self.position = {           "height" :              90,                     // constant percentage of background height
                                    "width" :               80 };                   // constant percentage of background width
        self.drawRect = {           "top" :                 0,                      // px, calculated size
                                    "left" :                0,                      // px, calculated size
                                    "height" :              0,                      // px, calculated size
                                    "width" :               0 };                    // px, calculated size
        self.proceedText = {        "id" :                  "pressSpaceToProceed",  // translation id
                                    "translation" :         "",                     // translation string
                                    "fontSize" :            4.5,                    // fontsize of the text
                                    "fittingFontSize" :     4.5,                    // calculated font that will fit the screen
                                    "top" :                 92,                     // percentage of background
                                    "left" :                3,                      // percentage of background
                                    "width" :               95,                     // percentage of background
                                    "height" :              20 };                   // percentage of background    
                        
        self.borderWidth =          10;                                             // widht of the rounded border
        self.lineWidth =            10;                                             // width of the line of the border                
        self.font =                 "Arial";                                        // store the font set by jsProject value font                
        self.translations =   [ {   "id" :              "ScoreInThisLevel",         // store translations
                                    "translation" :     "" },
                                {   "id" :              "totalScore",
                                    "translation" :     "" },
                                {   "id" :              "invadersDestroyed",
                                    "translation" :     "" },
                                {   "id" :              "totalInvadersDestroyed",
                                    "translation" :     "" } ];
        self.introText = {          "id" :              "",                         // intro text translation id 
                                    "loaded" :          false,                      // bool translation loaded
                                    "top" :             4,                          // percentage of drawRect
                                    "left" :            3,                          // percentage of drawRect
                                    "height" :          74,                         // percentage of drawRect
                                    "width" :           110,                        // percentage of drawRect
                                    "fontSize" :        3.5,                        // fontsize of the text    
                                    "fittingFontSize" : 3.5,                        // calculated font that will fit the screen
                                    "linePadding" :     0.5,                        // percentage of background padding between lines of text
                                    "translation" :     null };                     // translated text
        self.lastScore =            0;
        self.score =                0;
        
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
        self.show = function( ) {
            // pauze the animation
            self.debug( 'show' );
            
            self.score = jsProject.getValue( "score", "game" ) - self.lastScore;
            self.lastScore = jsProject.getValue( "score", "game" );
            // get the intro text id to display
            if( jsProject.getValue( "lost", "game" ) ){
                self.introText["id"] = jsProject.getValue( "levelLostTextId", "level" );
            }
            else {
                self.introText["id"] = jsProject.getValue( "levelCompleteTextId", "level" );
            }
            self.introText["loaded"] = false;
            // get the translation
            self.translate();

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
        self.calculateFontsSize = function( ) {
            if( !self.introText["loaded"] ){
                return;
            }
            self.debug( "calculateFonts" );
            var width = 0, height = 0;
            var fontSize = 0;
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
                textHeight = ( fontSize * ( self.translations.length ) );
                textHeight += ( linePadding * ( self.translations.length - 1 ) );
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
            self.proceedText["fittingFontSize"] = self.proceedText["fontSize"];
            // calculate height of textarea  in px
            height = ( self.drawRect["height"] / 100 ) * self.proceedText["height"];
            foundFit = false;
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( self.drawRect["height"] / 100 ) * self.proceedText["fittingFontSize"];
                // calculate total height
                // done calculate total height
                if( fontSize > height ){
                    // to big
                    if( self.proceedText["fittingFontSize"] > 2 ){
                        self.proceedText["fittingFontSize"] -= 0.2;
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
            width = ( self.drawRect["width"] / 100 ) * self.proceedText["width"];
            // check for width
            foundFit = false;        
            // while to long
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( $( "#background" ).height() / 100 ) * self.proceedText["fittingFontSize"];
                self.canvasSurface.font = fontSize + "px " + self.font;
                // get text width
                textWidth = self.canvasSurface.measureText( self.proceedText["translation"] ).width;
                if( textWidth > width ){
                    // to long
                    if( self.proceedText["fittingFontSize"] > 2 ){
                        self.proceedText["fittingFontSize"] -= 0.2;
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
        self.resetResult = function( ) {
            self.lastScore = 0;
            self.invadersDestroyed = 0;
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
            
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  

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
            width = ( self.drawRect["width"] + 1 ) - ( self.lineWidth * 2 );
            self.canvasSurface.fillRect( left, top, width, height );
            // done draw inner rect
            
            // if text loaded
            if( self.introText["loaded"] ){
                // intro text
                self.canvasSurface.fillStyle = 'whitesmoke';
                // calculate position px
                var left = self.drawRect["left"] + ( ( self.drawRect["width"] / 100 ) * self.introText["left"] );
                var top = self.drawRect["top"] + ( ( self.drawRect["height"] / 100 ) * self.introText["top"] );
                // done calculate position px
                // calculate line padding px 
                var linePadding = ( self.drawRect["height"] / 100 ) * self.introText["linePadding"];
                // calculate font size px
                var fontSize = ( self.drawRect["height"] / 100 ) * self.introText["fittingFontSize"];
                // set the font
                self.canvasSurface.font = fontSize + "px " + self.font;
                // loop over intro text
                for( var i = 0; i < self.introText["translation"].length; i++ ){
                    top += fontSize + linePadding;
                    self.canvasSurface.fillText( self.introText["translation"][i], left, top );
                }
                // done loop over intro text
                // done intro text
                
                top += fontSize + linePadding;
                top += fontSize + linePadding;
                var text = self.getTranslation( "ScoreInThisLevel" ) + self.score;
                self.canvasSurface.fillText( text, left, top );
                top += fontSize + linePadding;
                top += fontSize + linePadding;
                var text = self.getTranslation( "totalScore" ) + jsProject.getValue( "score", "game" );
                self.canvasSurface.fillText( text, left, top );
                // score
                
            }
            // done if text loaded
            
            // proceed text
            self.canvasSurface.fillStyle = 'whitesmoke';
            // calculate the font size px
            var fontSize = ( self.drawRect["height"] / 100 ) * self.proceedText["fittingFontSize"];
            // set the font
            self.canvasSurface.font = fontSize + "px " + self.font;
            // calculate position px
            top = ( self.drawRect["height"] / 100 ) * self.proceedText["top"] + fontSize;
            var left = self.drawRect["left"] + ( ( self.drawRect["width"] / 100 ) * self.proceedText["left"] );
            // done calculate position px
            
            // draw the text
            self.canvasSurface.fillText( self.proceedText["translation"], left, top );
            // done proceed text
        };
        self.getTranslation = function( id ) {
            for( var i = 0; i < self.translations.length; i++ ){
                if( self.translations[i]["id"] === id ){
                    return self.translations[i]["translation"];
                }
            }
        };
        self.translate = function(){
            self.debug( 'translate' );

            // create translation id array
            var translationIds = [];
            translationIds.push( self.introText["id"] );
            translationIds.push( self.proceedText["id"] );
            for( var i = 0; i < self.translations.length; i++ ){
                translationIds.push( self.translations[i]["id"] );
            }
            // done create translation id array
            
            // make an ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                if( self.introText["id"] === index ){
                    self.introText["translation"] = value.split( "<br />" );
                    self.introText["loaded"] = true;
                }
                if( self.proceedText["id"] === index ){
                    self.proceedText["translation"] = value;
                }
                for( var i = 0; i < self.translations.length; i++ ){
                    if( self.translations[i]["id"] === index ){
                        self.translations[i]["translation"] = value;
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
            show : function(){
                self.show();
            },
            hide : function( ){
                self.hide();
            },
            resetResult : function( ){
                self.resetResult( );
            }
        };
    };
})( gameDevelopment );