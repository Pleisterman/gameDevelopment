/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module displays a screen with three buttons for the user to set the difficulty  
 *          level when starting a game for the application space invaders
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
    gameDevelopment.difficultyModule = function( callback ) {


        /*
         *  module difficultyModule 
         *   
         *  functions: 
         *      private:
         *          construct                           called internal
         *          addHtml                             called from the construct function
         *          difficultyButtonClick               called from html button event
         *          difficultyButtonOver                called from html button event
         *          chooseLevel                         called from keyPressSubscription in set show function
         *          buttonLeft                          called from keyPressSubscription in set show function
         *          buttonRight                         called from keyPressSubscription in set show function
         *          show                                called by the public function
         *          hide                                called by the public function
         *          calculateFontsSize                  called from the layoutChange function
         *          layoutChange                        called from event subscription
         *          animate                             called from layoutChange and event subscription
         *          translate                           called from the event subscription, show function
         *          translateCallback                   callback for the translate function
         *          debug
         *      public:
         *          show                                called from the gameFlowModule
         *          hide                                called from the gameFlowModule
         *          
         *  event subscription: 
         *      layoutChange                            called from gameLayoutModule
         *      animate                                 called from gameModule
         *      languageChange                          called from languageModule
         */
  
    
        // private
        var self =                          this;
        self.MODULE =                       'difficultyModule';
        self.debugOn =                      false;
        self.visible =                      false;                                          // visibility
        self.callback =                     callback;                                       // store the callback
        self.canvasSurface =                null;                                           // store the surface to draw on
        self.animationDelay =               2000;                                           // ms
        self.lastAnimationDate =            0;                                              // save last animation time for delay
        self.position = {   "height" :      90,                                             // constant percentage of background height
                            "width" :       80 };                                           // constant percentage of background width
        self.drawRect = {   "top" :         0,                                              // px of original image
                            "left" :        0,                                              // px
                            "height" :      0,                                              // px
                            "width" :       0 };                                            // px
        self.borderWidth =                          10;                                     // percentage of background width store width of the border
        self.lineWidth =                            10;                                     // percentage of background width
        self.font =                                 "Arial";                                // store font set by jsproject value layout font 
        self.introText = {  "id" :                                  "difficultyIntro",      // store the textId  
                            "translation" :                         null,                   // store the translation 
                            "top" :                                 3,                      // percentage of background height, offset top
                            "left" :                                4,                      // percentage of background width, offset left
                            "width" :                               110,                    // percentage of background width, width of the textarea
                            "height" :                              50,                     // percentage of background height, height of the textarea
                            "titleFontSize" :                       10,                     // percentage extra relative to fontSize 
                            "fontSize" :                            3.1,                    // percentage of background height, initial fontSize
                            "fittingFontSize" :                     3.1,                    // percentage of background height, font size that fits the width and height 
                            "linePadding" :                         0.5 };                  // percentage of background height, padding between text lines    
        self.difficultyLevelButtonSize =            8;                                      // percentage of background width,  store width of the buttons
        self.difficultyLevelButtonTop =             58;                                     // percentage of background height, store top offset of the buttons
        self.difficultyLevelButtonMarginSides =     15;                                     // percentage of background width, store offset left and right of the button together    
        self.difficultyLevelsText = {       "fontSize" :            3.1,                    // percentage of background height, initial fontSize
                                            "fittingFontSize" :     3.1,                    // percentage of background height, font size that fits the width and height 
                                            "top" :                 74,                     // percentage of background height, offset top
                                            "left" :                4,                      // percentage of background width, offset left
                                            "width" :               110,                    // percentage of background width, width of the textarea
                                            "height" :              25,                     // percentage of background height, height of the textarea
                                            "linePadding" :         0.5 };                  // percentage of background height, padding between text lines
        self.difficultyLevels = new Array( { "name" :               "difficultyOne",        // store difficulty levels structure
                                             "translation" :        null, 
                                             "canvasSurface" :      null },   
                                           { "name" :               "difficultyTwo",      
                                             "translation" :        null, 
                                             "canvasSurface" :      null },
                                           { "name" :               "difficultyThree",    
                                             "translation" :        null, 
                                             "canvasSurface" :      null } );
        self.selectedDifficultyLevel =              0;                                     // currently selected button  
                       
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'messagesDrawLayer' ).getContext( '2d' );
            
            // add html
            self.addHtml();
            
            // get the font and size 
            self.font = jsProject.getValue( "font", "layout" );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'languageChange', self.translate );
            // done subscribe to events
            
            self.translate();
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
            // add html for buttons
            html += '<div id="difficultyLevelButtons"';
            html += '>';
                // loop over difficulty levels
                for( var i = 0; i < self.difficultyLevels.length; i++ ){
                    // create a canvas for difficulty level
                    html += '<div';
                        html += ' id="' + self.difficultyLevels[i]['name'] + 'Button" ';
                        html += ' style="'
                            html += 'position:absolute;z-index:2;cursor:hand;cursor:pointer; ';
                            html += ' background-color:transparent;';
                        html += ' "';
                    html += ' >';
                        html += '<canvas id="' + self.difficultyLevels[i]['name'] + 'Canvas" ';
                            html += ' style="'
                                html += ' background-color:transparent;';
                            html += ' "';
                        html += ' value="' + i + '"'; 
                        html += ' >';
                        html += '</canvas>';
                    html += '</div>';
                    // done create a canvas for the difficulty level
                }
                // done loop over difficulty levels
            html += '</div>';
            $( '#messages' ).append( html );
            // done add html for buttons
            
            // loop over the difficulty levels
            for( var i = 0; i < self.difficultyLevels.length; i++ ){
                // get the canvas surface to draw on set it in the difficulty level structure
                self.difficultyLevels[i]['canvasSurface'] = document.getElementById( self.difficultyLevels[i]['name'] + "Canvas" ).getContext( '2d' );
                // set the button event
                $( "#" + self.difficultyLevels[i]['name'] + "Canvas" ).mouseover( 
                    function(){ 
                        self.difficultyButtonOver( this ); 
                    } 
                );
                
                $( "#" + self.difficultyLevels[i]['name'] + "Canvas" ).click( 
                    function() { 
                        self.difficultyButtonClick( this ); 
                    } 
                );
                // done set the button event
            }
            // done loop over the difficulty levels
            
            // hide the buttons
            $( '#difficultyLevelButtons' ).hide();
            
        };
        self.difficultyButtonClick = function( element ) {
            self.debug( 'buttonClick' + element.id );
            // set the chosen difficuoty level
            self.selectedDifficultyLevel = parseInt( $( "#" + element.id  ).attr( "value" ) );
            jsProject.setValue( "difficulty", "game", self.selectedDifficultyLevel );
            // done set the chosen difficuoty level
            // hide the screen
            self.hide();
            // call the callback
            self.callback();
        };
        self.difficultyButtonOver = function( element ) {
            self.debug( 'levelButtonOver' + element.id );
            // set selected button for animating buton over image
            self.selectedDifficultyLevel = parseInt( $( "#" + element.id  ).attr( "value" ) );
            // animate without delay
            self.animate( true );
        };
        self.show = function( callback ) {
            // pauze the animation
            self.callback = callback;
            self.debug( 'show' );
            // show the buttons
            $( '#difficultyLevelButtons' ).show();
            self.visible = true;
            
            // activate key presses
            jsProject.setValue( "spacebar", "keyPressEvents", self.chooseLevel );
            jsProject.setValue( "left", "keyPressEvents", self.buttonLeft );
            jsProject.setValue( "right", "keyPressEvents", self.buttonRight );
            // done activate key presses
            
            // change the layout according to new dimensions
            self.layoutChange();
        };
        self.chooseLevel = function(){
            // set the chosen difficuoty level
            jsProject.setValue( "difficulty", "game", self.selectedDifficultyLevel );
            // hide the screen
            self.hide();
            // call the callback
            self.callback();
        };
        self.buttonLeft = function() {
            // select the next button
            self.selectedDifficultyLevel++;
            if( self.selectedDifficultyLevel >= self.difficultyLevels.length ){
                // higher then length of araay back to 0 
                self.selectedDifficultyLevel = 0;
            }
            // animate without delay
            self.animate( true );
        };
        self.buttonRight = function(){
            // select the previous button
            self.selectedDifficultyLevel--;
            if( self.selectedDifficultyLevel < 0 ){
                // smaller then 0 back to last of array 
                self.selectedDifficultyLevel = self.difficultyLevels.length - 1;
            }
            // animate without delay
            self.animate( true );
        };
        self.hide = function( ) {
            // remove the key press events
            jsProject.setValue( "spacebar", "keyPressEvents", null );
            jsProject.setValue( "left", "keyPressEvents", null );
            jsProject.setValue( "right", "keyPressEvents", null );
            // done remove the key press events
            // hide the screen
            $( '#difficultyLevelButtons' ).hide();
            self.visible = false;
            // clear the whole canvas
            self.canvasSurface.clearRect( 0,0, $( '#background' ).width(), $( '#background' ).height() );  
        };
        self.calculateFontsSize = function( ) {
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
                // calculate title font size in px
                titleFontSize = fontSize + ( ( fontSize / 100 ) * self.introText["titleFontSize"] );
                // calculate linePadding in px
                linePadding = ( self.drawRect["height"] / 100 ) * self.introText["linePadding"];
                // calculate total height
                textHeight +=  titleFontSize;
                textHeight += ( fontSize * ( self.introText["translation"].length - 1 ) );
                textHeight += ( linePadding * ( self.introText["translation"].length - 1 ) )
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
                    if( i === 0 ){
                        // calculate fontSize in px
                        fontSize = ( $( "#background" ).height() / 100 ) * self.introText["fittingFontSize"];
                        fontSize += ( fontSize / 100 ) * self.introText["titleFontSize"];
                    }
                    else {
                        // calculate fontSize in px
                        fontSize = ( $( "#background" ).height() / 100 ) * self.introText["fittingFontSize"];
                    }
                    self.canvasSurface.font = fontSize + "px " + self.font;
                    // get text width
                    textWidth = self.canvasSurface.measureText( self.introText["translation"][i] ).width;
                    self.debug( " textWidth: " + textWidth );
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

            // check difficulty levels
            // check check for height loop over difficultyLevels
            self.difficultyLevelsText["fittingFontSize"] = self.difficultyLevelsText["fontSize"];
            height = ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["height"];
            for( var i = 0; i < self.difficultyLevels.length; i++ ){
                // set fittingFontSize = fontSize 
                // calculate height of text item in px
                foundFit = false;
                while( !foundFit ){
                    // calculate fontSize in px
                    fontSize = ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["fittingFontSize"];
                    // calculate linePadding in px
                    linePadding = ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["linePadding"];
                    // calculate total height
                    textHeight = ( fontSize * ( self.difficultyLevels[i]["translation"].length  ) );
                    textHeight += ( linePadding * ( self.difficultyLevels[i]["translation"].length - 1 ) )
                    // done calculate total height
                    if( textHeight > height ){
                        // to big
                        if( self.difficultyLevelsText["fittingFontSize"] > 2 ){
                            self.difficultyLevelsText["fittingFontSize"] -= 0.2;
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
            // done check for height loop over difficultyLevels
             
            var textWidth = 0;
            // check for width loop over texts
            width = ( self.drawRect["width"] / 100 ) * self.difficultyLevelsText["width"];
            for( var i = 0; i < self.difficultyLevels.length; i++ ){
                for( var j = 0; j < self.difficultyLevels[i]["translation"].length; j++ ){
                    // check for width
                    foundFit = false;        
                    // while to long
                    while( !foundFit ){
                        // calculate fontSize
                        fontSize = ( $( "#background" ).height() / 100 ) * self.difficultyLevelsText["fittingFontSize"];
                        self.canvasSurface.font = fontSize + "px " + self.font;
                        // get text width
                        textWidth = self.canvasSurface.measureText( self.difficultyLevels[i]["translation"][j] ).width;
                        if( textWidth > width ){
                            // to long
                            if( self.difficultyLevelsText["fittingFontSize"] > 2 ){
                                self.difficultyLevelsText["fittingFontSize"] -= 0.2
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
            }
            // done check difficultyLevels
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

            // check if fontSizes fit
            self.calculateFontsSize()

            // calculate button placement
            var top = ( ( self.drawRect["height"] / 100 ) * self.difficultyLevelButtonTop );
            var sideMargin = ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelButtonMarginSides );
            var totalWidth = ( self.drawRect["width"] - ( 2 * sideMargin ) );
            var width = ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelButtonSize );
            var height = ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelButtonSize );
            var spacing = ( totalWidth - ( self.difficultyLevels.length * width ) ) / ( self.difficultyLevels.length - 1 ); 
            var left = self.drawRect["left"] + sideMargin;
            // done calculate button placement

            // loop over buttons
            for( var i = 0; i < self.difficultyLevels.length; i++ ){

                self.canvasSurface.clearRect( 0,0, $( '#' + self.difficultyLevels[i]['name'] + "Button" ).width(), $( '#' + self.difficultyLevels[i]['name'] + "Button" ).height() );  
                
                // set positions
                $( '#' + self.difficultyLevels[i]['name'] + "Button" ).css( "left", left );
                $( '#' + self.difficultyLevels[i]['name'] + "Button" ).css( "top", top );
                $( '#' + self.difficultyLevels[i]['name'] + "Button" ).css( "width", width );
                $( '#' + self.difficultyLevels[i]['name'] + "Button" ).css( "height", height );
                $( '#' + self.difficultyLevels[i]['name'] + "Canvas" ).css( "width", width );
                $( '#' + self.difficultyLevels[i]['name'] + "Canvas" ).css( "height", height );
                self.difficultyLevels[i]['canvasSurface'].canvas.width = width;
                self.difficultyLevels[i]['canvasSurface'].canvas.height = height;
                left += spacing + width;
                // done set positions
                
            }
            // done loop over buttons
            
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

            top = ( self.drawRect["top"] - 1 )  + self.lineWidth;
            left = ( self.drawRect["left"] - 1) + self.lineWidth;
            height = ( self.drawRect["height"] + 1 ) - ( self.lineWidth * 2 );
            width = ( self.drawRect["width"] + 1 ) - ( self.lineWidth * 2 );
            self.canvasSurface.fillRect( left, top, width, height );
            // done draw outer rect

            // intro text
            var left = self.drawRect["left"] + ( ( self.drawRect["width"] / 100 ) * self.introText["left"] );
            var top = self.drawRect["top"] + ( ( self.drawRect["height"] / 100 ) * self.introText["top"] );
            var linePadding = ( self.drawRect["height"] / 100 ) * self.introText["linePadding"];
            var fontSize = ( self.drawRect["height"] / 100 ) * self.introText["fittingFontSize"];
            var titleFontSize = fontSize + ( ( fontSize / 100 ) * self.introText["titleFontSize"] );
            self.canvasSurface.font = titleFontSize + "px " + self.font;
            self.canvasSurface.fillStyle = 'whitesmoke';
            //self.debug( 'animate' + self.introText["translation"][0] );
            for( var i = 0; i < self.introText["translation"].length; i++ ){
                //self.debug( 'animate' + self.introText["translation"][i] );
                if( i > 0 ){
                    self.canvasSurface.font = fontSize + "px " + self.font;
                    top += fontSize + linePadding;
                    self.canvasSurface.fillText( self.introText["translation"][i], left, top );
                }
                else {
                    top += titleFontSize + linePadding;
                    var name = jsProject.getValue( "userName", "game" );
                    self.canvasSurface.fillText( self.introText["translation"][i] + " " + name, left, top );
                }

            }
            // done intro text
        
            // loop over buttons
            for( var i = 0; i < self.difficultyLevels.length; i++ ){
                // draw the sign
                var width = ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelButtonSize );
                var height = ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelButtonSize );
                if( i === self.selectedDifficultyLevel ){
                    var image = jsProject.getResource( self.difficultyLevels[i]['name'] + "Over", 'image' );
                }
                else {
                    var image = jsProject.getResource( self.difficultyLevels[i]['name'], 'image' );
                }
                self.difficultyLevels[i]['canvasSurface'].drawImage( image, 0, 0, image.width, image.height, 
                                                                     2, 2, width - 4, height - 4 );
                // done draw the sign
            }   
            // done loop over buttons
            
            // show the text for the level of the button where mouse is over
            if( self.selectedDifficultyLevel >= 0 ){
                // intro text
                // calculate position
                var linePadding = ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["linePadding"];
                var fontSize = ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["fittingFontSize"];
                var left = self.drawRect["left"] + ( ( self.drawRect["width"] / 100 ) * self.difficultyLevelsText["left"] );
                var top = self.drawRect["top"] + ( ( self.drawRect["height"] / 100 ) * self.difficultyLevelsText["top"] );
                // done calculate position
                self.canvasSurface.font = fontSize + "px " + self.font;
                self.canvasSurface.fillStyle = 'whitesmoke';
                var text = self.difficultyLevels[self.selectedDifficultyLevel]["translation"];
                // loop over text
                for( var i = 0; i < text.length; i++ ){
                    self.canvasSurface.fillText( text[i], left, top );
                    top += fontSize + linePadding;
                }
                // done loop over text
            }
            // done show the text for the level of the button where mouse is over
            
        };
        self.translate = function(){
            self.debug( 'translate' );
            // create an array with the translation id's
            var translationIds = []
            translationIds.push( self.introText["id"] );
            for( var i = 0; i < self.difficultyLevels.length; i++ ){
                translationIds.push( self.difficultyLevels[i]["name"] );
            }    
            // done create an array with the translation id's
            
            // make a ajax call for the translations
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                if( self.introText["id"] === index ){
                    // intro text break up in to array
                    self.introText["translation"] = value.split( "<br />" );
                }
                // loop over difficulty levels for translations
                for( var i = 0; i < self.difficultyLevels.length; i++ ){
                    if( self.difficultyLevels[i]["name"] === index ){
                        // translation break up in to array
                        self.difficultyLevels[i]["translation"] = value.split( "<br />" );
                    }
                }    
                // done loop over difficulty levels for translations
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