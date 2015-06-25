/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the intro for the first level for the application space invaders
 *          an animation is shown with several pieces of test
 *          the user can skip this screen en go to the difficulty selection
 *          
 * Last revision: 22-06-2015
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
    gameDevelopment.firstLevelIntroModule = function( ) {


        /*
         *  module firstLevelIntroModule 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          hide                called by the public function
         *          calculateFontsSize  called from the layoutChange function
         *          layoutChange        called from event subscription
         *          animate             called from layoutChange and event subscription
         *          createCharacters    called from the animate function and show function
         *          animateCharacters   called from the animate function
         *          translate           called from the event subscription, show function
         *          translateCallback   callback for the translate function
         *          debug
         *      public:
         *          show                called from the gameFlowModule
         *          hide                called from the gameFlowModule 
         *          
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         *      animate                 called from gameModule
         *      languageChange          called from languageModule
         */
  
    
        // private
        var self = this;
        self.MODULE = 'firstLevelIntroModule';
        self.debugOn = false;
        self.visible = false;                                                       // visibility
        self.callback = null;                                                       // store the callback
        self.canvasSurface = null;                                                  // store the surface to draw on
        self.font = "Arial";                                                        // store the font
        self.characters = [ ];                                                      // store the characters for create and animate    
        self.texts = [ {    "id" :             "spaceInvaders",                     // text: Space Invaders
                            "translation" :    "Space Invaders",                    // store translation
                            "startPosition" : { "top" :         7,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        14,
                            "fittingFontSize" : 14,
                            "fontColor" :       "#ff0000",
                            "endPosition" :   { "top" :         20,
                                                "left" :        35,
                                                "height" :      15 } },             // done text: Space Invaders
                       {    "id" :             "createdByToshihiroNishikado",       // text: created by Toshihiro Nishikado
                            "translation" :    "",                                  // store translation
                            "startPosition" : { "top" :         70,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        3.2,
                            "fittingFontSize" : 6,
                            "fontColor" :       "#dddd00",
                            "endPosition" :   { "top" :         40,
                                                "left" :        10,
                                                "heigth" :       6 } },             // done text: created by Toshihiro Nishikado
                       {    "id" :             "recreatedBy",                       // text: recreated by
                            "translation" :    "",                                  // store translation
                            "startPosition" : { "top" :         76,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        3.2,
                            "fittingFontSize" : 6,
                            "fontColor" :       "#00dd00",
                            "endPosition" :   { "top" :         50,
                                                "left" :        18,
                                                "heigth" :      10 } },             // done text: recreated by
                       {    "id" :             "Pleisterman",                       // text: pleisterman
                            "translation" :    "Pleisterman",                       // store translation
                            "startPosition" : { "top" :         80,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        10,
                            "fittingFontSize" : 10,
                            "fontColor" :       "#25408f",
                            "endPosition" :   { "top" :         56,
                                                "left" :        24,
                                                "height" :      10 } },             // done text: pleisterman
                       {    "id" :              "softwareDevelopment",              // text: Software Development
                            "translation" :     "",                                 // store translation
                            "startPosition" : { "top" :         90,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        3.2,
                            "fontColor" :       "#00dd00",
                            "fittingFontSize" : 5,
                            "endPosition" :   { "top" :         68,
                                                "left" :        47,
                                                "height" :      8 } },              // done text: Software Development
                       {    "id" :             "in",                                // text: In
                            "translation" :    "In",                                // store translation
                            "startPosition" : { "top" :         92,
                                                "left" :        93,
                                                "width" :       -10 },
                            "fontSize" :        5,
                            "fittingFontSize" : 14,
                            "fontColor" :       "red",
                            "endPosition" :   { "top" :         77,
                                                "left" :        44,
                                                "height" :      10 } },             // done text: In
                       {    "id" :             "javascript",                        // text: Javascript
                            "translation" :    "Javascript",                        // store translation
                            "startPosition" : { "top" :         90,
                                                "left" :        90,
                                                "width" :       -10 },
                            "fontSize" :        8,
                            "fittingFontSize" : 14,
                            "fontColor" :       "#dddd00",
                            "endPosition" :   { "top" :         79 ,
                                                "left" :        54,
                                                "height" :      10 } } ];           // done text: press space to proceed
        
        self.textCounter = 0;                                                       // counter for displaying texts on at a time
        self.animationDelay = 10;                                                   // ms
        self.lastAnimationDate = 0;                                                 // save last animation time for delay
        self.animationCounter = 0;                                                  // counter for length of animation
        self.animationLength = 25;                                                  // total length of animation in animation steps
        self.animationReady = false;                                                // all animations done
        self.endDelayCounter = 0;                                                   // delay after all animations done, then call the callback function
        self.endDelay = 100;                                                        // total delay
        
        
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
            
            // translate the texts
            self.translate();
        };
        self.show = function( callback ) {
            // pauze the animation
            self.callback = callback;
            // reset animation values
            self.animationReady = false;
            self.textCounter = 0;
            self.animationCounter = 0;
            // done reset animation values
            
            // create first set of characters
            self.createCharacters();
            self.debug( 'show' );

            // set the click event, call the callback
            $( "#messages" ).click( 
                function() { 
                    self.callback(); 
                } 
            );
            // done set the click event, call the callback
    
            self.visible = true;

            // change the layout according to new dimensions
            self.layoutChange();
        };
        self.calculateFontsSize = function( ) {
            self.debug( "calculateFonts" );
            var left = 0, height = 0;
            var fontSize = 0;
            var foundFit = false;
            // check for height loop over texts
            for( var i = 0; i < self.texts.length; i++ ){
                // set fittingFontSize = fontSize 
                self.texts[i]["fittingFontSize"] = self.texts[i]["fontSize"];
                // calculate height of text item in px
                height = ( $( "#background" ).height() / 100 ) * self.texts[i]["endPosition"]["height"];
                foundFit = false;
                while( !foundFit ){
                    // calculate fontSize in px
                    fontSize = ( $( "#background" ).height() / 100 ) * self.texts[i]["fittingFontSize"];
                    if( fontSize > height ){
                        // to big
                        if( self.texts[i]["fittingFontSize"] > 2 ){
                            self.texts[i]["fittingFontSize"] -= 0.2;
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
            // done check for height loop over texts

            var textWidth = 0;
            // check for width loop over texts
            for( var i = 0; i < self.texts.length; i++ ){
                foundFit = false;        
                // get left in px
                left = ( $( "#background" ).width() / 100 ) * self.texts[i]["endPosition"]["left"];
                // while to long
                while( !foundFit ){
                    // calculate fontSize in px
                    fontSize = ( $( "#background" ).height() / 100 ) * self.texts[i]["fittingFontSize"];
                    self.canvasSurface.font = fontSize + "px " + self.font;
                    // get text width
                    textWidth = self.canvasSurface.measureText( self.texts[i]["translation"] ).width;
                    if( left + textWidth > $( "#background" ).width() ){
                        // to long
                        if( self.texts[i]["fittingFontSize"] > 2 ){
                            self.texts[i]["fittingFontSize"] -= 0.2;
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
                // done while to long
            }
            // done check for width loop over texts
        };    
        self.hide = function( ) {
            self.visible = false;
            // remove the click event
            $( "#messages" ).unbind();
            
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            // pauze the animation
            self.visible = false;
            self.debug( 'layoutChange' );

            // check if fontSizes fit
            self.calculateFontsSize()
            
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  

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
            
            // clear the whole rect
            self.canvasSurface.clearRect( 0, 0, $( '#background' ).width(), $( '#background' ).height() );
            
            var left = 0, top = 0, width = 0, height = 0;
            
            // draw the texts that have been animated
            for( var i = 0; i < self.textCounter; i++ ){
                height = self.texts[i]["fittingFontSize"] * ( $( '#background' ).height() / 100 );
                self.canvasSurface.fillStyle = self.texts[i]["fontColor"];
                self.canvasSurface.font = height + "px " + self.font;
                left = self.texts[i]["endPosition"]["left"] * ( $( '#background' ).width() / 100 );
                top = self.texts[i]["endPosition"]["top"] * ( $( '#background' ).height() / 100 );
                var text = self.texts[i]["translation"];
                for( var j = 0; j < text.length; j++ ){
                    self.canvasSurface.fillText( text[j], left, top );
                    left += self.canvasSurface.measureText( text[j] ).width;
                }
            }
            // draw the last text
            if( self.animationReady ){
                // draw lasr of the array
                height = self.texts[self.textCounter]["fittingFontSize"] * ( $( '#background' ).height() / 100 );
                self.canvasSurface.font = height + "px " + self.font;
                self.canvasSurface.fillStyle = self.texts[i]["fontColor"];
                left = self.texts[self.textCounter]["endPosition"]["left"] * ( $( '#background' ).width() / 100 );
                top = self.texts[self.textCounter]["endPosition"]["top"] * ( $( '#background' ).height() / 100 );
                var text = self.texts[self.textCounter]["translation"];
                // loop over characters
                for( var i = 0; i < text.length; i++ ){
                    self.canvasSurface.fillText( text[i], left, top );
                    left += self.canvasSurface.measureText( text[i] ).width;
                }
                // done loop over characters
                
                self.endDelayCounter++;
                // end delay done
                if( self.endDelayCounter >= self.endDelay ){
                    if( self.callback ){
                        // call the provided callback function
                        self.callback();
                        self.callback = null;
                    }
                }
            } // done draw last text
            else {  // still animating characters
                if( self.animationCounter < self.animationLength ){
                    // animation of one text still runing
                    self.animationCounter++;
                    self.animateCharacters();
                }
                else { // animation of one text ready
                    // reset the animation counter
                    self.animationCounter = 0;
                    if( self.textCounter < self.texts.length - 1 ){ // text counter max array length -1
                        // still text to animate
                        // next text
                        self.textCounter++;
                        // create characters for animation
                        self.createCharacters();
                    } // done still text to animate
                    else {
                        // all text are animated
                        self.animationReady = true;
                        //start end delay
                        self.endDelayCounter = 0;
                    }
                }
            }
        };
        self.createCharacters = function() {
            self.debug( 'createCharacters' );
            // empty the array
            self.characters = [];
            // get the text to animate
            var text = self.texts[self.textCounter]; 
            var startLeft = text["startPosition"]["left"];
            var endLeft = text["endPosition"]["left"];
            // create the characters
            var charWidth = 0;
            // loop over the translation
            for( var i = 0; i < text["translation"].length; i++ ){
                // set the font
                self.canvasSurface.font = text["fittingFontSize"] + "px " + self.font;
                // calculate the width of the character
                charWidth = self.canvasSurface.measureText( text["translation"][i] ).width
                // create an object
                var character = { "character" :         text["translation"][i],
                                  "startPosition" : {   "top" :    text["startPosition"]["top"],
                                                        "left" :   startLeft,
                                                        "width" :  text["startPosition"]["width"] },
                                  "endPosition" : {     "top" :    text["endPosition"]["top"],
                                                        "left" :   endLeft,
                                                        "charWidth" : charWidth },
                                  "position" : {        "top" :    text["startPosition"]["top"],
                                                        "left" :   startLeft, } };
                // add to the array
                self.characters.push( character );                            
                // done create an object
                startLeft += text["startPosition"]["width"];
                // change position,  add the width
                endLeft += charWidth;
            }
            // done loop over the translation
            // done create the characters
        };        
        self.animateCharacters = function() {
            var changeX = 0, changeY = 0, changeWidth = 0;
            // get the text to animate
            var text = self.texts[self.textCounter]; 
            var characterWidth = 0;
            // get the fontSize
            var fontSize = ( $( '#background' ).height() / 100 ) * text["fittingFontSize"];
            var left = 0, top = 0;
            // loop over characters of the text
            for( var i = 0; i < self.characters.length; i++ ){
                // calculate rates of change
                changeX = ( self.characters[i]["endPosition"]["left"] - self.characters[i]["startPosition"]["left"] ) / self.animationLength;
                changeY = ( self.characters[i]["endPosition"]["top"] - self.characters[i]["startPosition"]["top"]  ) / self.animationLength;
                
                changeWidth = ( self.characters[i]["endPosition"]["charWidth"] - self.characters[i]["startPosition"]["width"]  ) / self.animationLength;
                // done calculate rates of change
                
                // set the positions percentage of background
                self.characters[i]["position"]["left"] += changeX + changeWidth;
                self.characters[i]["position"]["top"] += changeY;
                // done set the positions percentage of background
        
                // calculate position px
                left = ( self.characters[i]["position"]["left"] * ( $( '#background' ).width() / 100 ) ) + characterWidth;
                top = self.characters[i]["position"]["top"] * ( $( '#background' ).height() / 100 );
                // done calculate position px
                
                // set the font
                self.canvasSurface.font = fontSize + "px " + self.font;
                // add the width
                characterWidth += self.canvasSurface.measureText( self.characters[i]["character"] ).width;
                self.canvasSurface.fillStyle = text["fontColor"];
                // draw the character
                self.canvasSurface.fillText( self.characters[i]["character"], left, top );
            }        
            // done loop over characters of the text
        };
        self.translate = function(){
            self.debug( 'translate' );
            // create an array with the translation id's
            var translationIds = []
            for( var i = 0; i < self.texts.length; i++ ){
                translationIds.push( self.texts[i]["id"] )
                self.debug( self.texts[i]["id"] );
            }
            // done create an array with the translation id's
            
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                // loop over texts for translations
                for( var i = 0; i < self.texts.length; i++ ){
                    if( self.texts[i]["id"] === index ){
                        self.texts[i]["translation"] = value;
                        self.debug( index + ":" + value );
                    }
                }
                // done loop over texts for translations
            });
            self.layoutChange();
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