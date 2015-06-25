/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the game messages for the application space invaders
 *          there are two message types:
 *          startMessages for starting game, displayed about 70% from top
 *          startMessages are displayed untill a call is made to hide the message
 *          game message displayed in the middle of the screen. 
 *          game messages are; level complete, game lost, upgrade bullet extra, ship lost, ...
 *          
 * Last revision: 23-06-2015
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
    gameDevelopment.gameMessageModule = function( ) {


    /*
     *  module gameMessageModule 
     *   
     *  functions: 
     *      private:
     *          construct                   called internal
     *          show                        called by the public function
     *          showGameStartMessage        called by event subscription
     *          hideGameStartMessage        called by event subscription
     *          lifeLost                    called by event subscription
     *          allInvadersKilled           called by event subscription
     *          gameOver                    called by event subscription allInvadersKilled and allLivesLost
     *          bulletAdded                 called by event subscription    
     *          layoutChange                called by event subscription
     *          animate                     called by event subscription
     *          gameStartMessageAnimate     called from the animate function
     *          gameMessageAnimate          called from the animate function
     *          translate                   called by the event subscription languageChange
     *          translateCallback           calback for translate function
     *          debug
     *      public:
     *          show 
     *  event subscription: 
     *      layoutChange                    called from gameLayoutModule
     *      animate                         called from gameLayoutModule
     *      showGameStartMessage            called from gameModule
     *      hideGameStartMessage            called from gameModule
     *      languageChange                  called from languageModule
     *      allInvadersKilled               called from the invaders module
     *      lifeLost                        called from the ship module
     *      invadersOnKillLine              called from the invaders module
     *      allLivesLost                    called from the lives module
     *      bulletAdded                     called from the score module
     *      
     */
    
        // private
        var self = this;
        self.MODULE = 'gameMessageModule';
        self.debugOn = false;
        self.visible = false;                                                       // visibiltity
        self.canvasSurface = null;                                                  // store the surface to draw on
        self.clearPadding = 2;                                                      // percentage of background
        self.gameMessageFontSize =                          2.0;                        
        self.gameMessageFittingFontSize =                   2.0;                        
        self.gameMessageMinimumFontSize =                   2.2;                        
        self.gameStartMessage = {   "top" :                 71,                     // percentage of background
                                    "width" :               95,                     // percentage of background
                                    "height" :              3.1,                     // percentage of background
                                    "drawTop" :             0,                      // px, the rect that the message is drawn in  
                                    "drawLeft" :            0,                      // px, the rect that the message is drawn in  
                                    "drawHeight" :          0,                      // px, the rect that the message is drawn in  
                                    "drawWidth" :           0,                      // px, the rect that the message is drawn in  
                                    "clearTop" :            0,                      // px, the rect that the message is drawn in  
                                    "clearLeft" :           0,                      // px, the rect that the message is drawn in  
                                    "clearHeight" :         0,                      // px, the rect that the message is drawn in  
                                    "clearWidth" :          0,                      // px, the rect that the message is drawn in  
                                    "visible" :             false,                  // visibility of the text
                                    "textId" :              null,                   // store the text id, set from jsProject value gameStartMessages textId
                                    "text" :                "",                     // store text
                                    "innerRectPadding" :    0.6,                      // padding around text
                                    "outerRectPadding" :    1.1,                      // padding around text
                                    "fontColor" :           "whitesmoke",           // color of the text
                                    "outerRectColors" : [   "#00ff00",              // used for color change outer rect
                                                            "#00ef00", 
                                                            "#00dd00", 
                                                            "#00cc00" ],
                                    "innerRectColor" :      'darkgreen' };          // store background color of inner rect
        self.gameMessage =      {   "top" :                 50,                     // percentage of background
                                    "drawTop" :             0,                      // px, the rect that the message is drawn in  
                                    "drawLeft" :            0,                      // px, the rect that the message is drawn in  
                                    "drawHeight" :          0,                      // px, the rect that the message is drawn in  
                                    "drawWidth" :           0,                      // px, the rect that the message is drawn in  
                                    "clearTop" :            0,                      // px, the rect that the message is drawn in  
                                    "clearLeft" :           0,                      // px, the rect that the message is drawn in  
                                    "clearHeight" :         0,                      // px, the rect that the message is drawn in  
                                    "clearWidth" :          0,                      // px, the rect that the message is drawn in      
                                    "visible" :             false,                  // visibility of the text
                                    "text" : "",                                    // store text
                                    "fontColor" :           "lightgrey",           // color of the text
                                    "innerRectPadding" :    0.8,                    // padding around text
                                    "outerRectPadding" :    1.0,                    // padding around text
                                    "outerRectColor" :      "#009900",              // store outer rect background color
                                    "innerRectColor" :      "#000000",              // store inner rect background color
                                    "animationLength" :     7,                      // store animation length in animation steps
                                    "animationCount" :      0 };                    // padding around text
        
        self.font = "";                                                             // store the font                                              
        self.animationDelay = 200;                                                  // ms 
        self.lastAnimationDate = 0;                                                 // store the last animation time
        self.state = 0;                                                             // used for color selection outer rect
        self.translationIds = [ {   "id" :                  "pressSpaceToStartGame",// translation id's that should be translated during translate function
                                    "translation" :         "" },
                                {   "id" :                  "levelComplete", 
                                    "translation" :         "" },
                                {   "id" :                  "lifeLost", 
                                    "translation" :         "" },
                                {   "id" :                  "gameOver", 
                                    "translation" :         "" },
                                {   "id" :                  "bulletAdded", 
                                    "translation" :         "" },
                                {    "id" :                  "name", 
                                    "translation" :         "" },
                                {    "id" :                  "rank", 
                                    "translation" :         "" } ];
        self.highScores = {         "borderWidth" :         10,
                                    "lineWidth" :           10,
                                    "drawTop" :             0,
                                    "drawLeft" :            0,
                                    "drawWidth" :           0,
                                    "drawHeight" :          0,
                                    "scores" :              null,
                                    "visible" :             false,
                                    "lineSpacing" :         30,
                                    "fontSize" :            3.1,
                                    "headerFontSize" :      10,
                                    "fittingFontSize" :     3.1,
                                    "top" :                  5,
                                    "height" :              60,
                                    "width" :               75,
                                    "nameColumnWidth" :     40,
                                    "rankColumnWidth" :     20,
                                    "levelColumnWidth" :    20,
                                    "scoreColumnWidth" :    20 };                          
                          
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // get the font and size 
            self.font = jsProject.getValue( "font", "layout" );
            self.gameMessageFontSize = jsProject.getValue( "fontSize", "gameStartMessages" );

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById( 'messagesDrawLayer' ).getContext( '2d' );

            // subscribe to events
            jsProject.subscribeToEvent( 'layoutChange', self.layoutChange );
            jsProject.subscribeToEvent( 'animate', self.animate );
            jsProject.subscribeToEvent( 'showGameStartMessage', self.showGameStartMessage );
            jsProject.subscribeToEvent( 'hideGameStartMessage', self.hideGameStartMessage );
            jsProject.subscribeToEvent( 'languageChange', self.translate );
            jsProject.subscribeToEvent( 'allInvadersKilled', self.allInvadersKilled );
            jsProject.subscribeToEvent( 'lifeLost', self.lifeLost );
            jsProject.subscribeToEvent( 'invadersOnKillLine', self.gameOver );
            jsProject.subscribeToEvent( 'allLivesLost', self.gameOver );
            jsProject.subscribeToEvent( 'bulletAdded', self.bulletAdded );
            jsProject.subscribeToEvent( 'showHighScores', self.showHighScores );
            jsProject.subscribeToEvent( 'hideHighScores', self.hideHighScores );
            // done subscribe to events
          
            self.translate();
        };
        self.show = function( visible ){
            if( visible ){
                self.debug( "show" );
                self.visible = visible;
                self.layoutChange();
            } 
            else {
                self.debug( "hide" );
                self.visible = visible;
                self.gameMessage["visible"] = false;
                self.gameStartMessage["visible"] = false;
                self.canvasSurface.clearRect( 0, 0, $( '#background' ).width(), $( '#background' ).height() );  
            }
            
        };
        self.showGameStartMessage = function(){
            self.gameStartMessage["textId"] = jsProject.getValue( "id", "gameStartMessages" );
            self.debug( 'self.showGameStartMessage' + self.gameStartMessage["textId"] );
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === self.gameStartMessage["textId"] ){
                    self.gameStartMessage["text"] = self.translationIds[i]["translation"];
                    self.debug( "test" + self.gameStartMessage["textId"]  + self.gameStartMessage["text"])
                }
            }            
            self.gameStartMessage["visible"] = true;
            // animate without delay
            self.animate( true );
             
        };
        self.hideGameStartMessage = function(){
            self.gameStartMessage["text"] = "";
            self.gameStartMessage["visible"] = false;
            self.gameMessage["text"] = "";
            self.gameMessage["visible"] = false;
            // clear the clearRect
             
            // animate without delay
            self.animate( true );
        };
        self.lifeLost = function(){
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "lifeLost" ){
                    self.gameMessage["text"] = self.translationIds[i]["translation"];
                }
            }            
            self.gameMessage["visible"] = true;
            
            self.gameMessage["animationCount"] = 0;
            
            // animate without delay
            self.animate( true );
             
        };
        self.allInvadersKilled = function(){
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "levelComplete" ){
                    self.gameMessage["text"] = self.translationIds[i]["translation"];
                }
            }            
            self.gameMessage["visible"] = true;
            
            self.gameMessage["animationCount"] = 0;
            
            // animate without delay
            self.animate( true );
             
        };
        self.gameOver = function(){
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "gameOver" ){
                    self.gameMessage["text"] = self.translationIds[i]["translation"];
                }
            }            
            self.gameMessage["visible"] = true;
            
            self.gameMessage["animationCount"] = 0;
            
            // animate without delay
            self.animate( true );
             
        };
        self.bulletAdded = function(){
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "bulletAdded" ){
                    self.gameMessage["text"] = self.translationIds[i]["translation"];
                }
            }            
            self.gameMessage["visible"] = true;
            
            self.gameMessage["animationCount"] = 0;
            
            // animate without delay
            self.animate( true );
             
        };
        self.showHighScores = function(){
            self.debug( 'showHighScores' );
            self.highScores["scores"] = jsProject.getValue( "highScores", "game" );
            self.highScores["visible"] = true;
            self.layoutChange();
        };
        self.hideHighScores = function(){
            self.debug( 'hideHighScores' );
            self.highScores["visible"] = false;
            self.layoutChange();
        };
        self.calculateFonts = function( ) {
            self.debug( "calculateFonts" );
            var width = 0;
            var foundFit = false;
            var height = 0;

            
            // check gameStartMessage text
            // check for height 
            // set fittingFontSize = fontSize 
            self.gameMessageFittingFontSize = self.gameMessageFontSize;
            // calculate height of textarea  in px
            height = ( $( "#background" ).height() / 100 ) * self.gameStartMessage["height"];
            foundFit = false;
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( $( "#background" ).height() / 100 ) * self.gameMessageFittingFontSize;
                // calculate total height
                // done calculate total height
                if( fontSize > height ){
                    // to big
                    if( self.gameMessageFittingFontSize > self.gameMessageMinimumFontSize ){
                        self.gameMessageFittingFontSize -= 0.1;
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
            width = ( $( "#background" ).width() / 100 ) * self.gameStartMessage["width"];
            // check for width
            foundFit = false;        
            // while to long
            while( !foundFit ){
                // calculate fontSize in px
                fontSize = ( $( "#background" ).height() / 100 ) * self.gameMessageFittingFontSize;
                self.canvasSurface.font = fontSize + "px " + self.font;
                // get text width
                textWidth = self.canvasSurface.measureText( self.gameStartMessage["text"] ).width;
                if( textWidth > width ){
                    // to long
                    if( self.gameMessageFittingFontSize > self.gameMessageMinimumFontSize ){
                        self.gameMessageFittingFontSize -= 0.1;
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
            
            // check highScores
            if( self.highScores["scores"] ){
                self.highScores["fittingFontSize"] = self.highScores["fontSize"];
                var width = ( $( "#background" ).width() / 100 ) * self.highScores["width"];
                width -= self.highScores["borderWidth"] * 2;
                var nameWidth = ( width / 100 ) * self.highScores["nameColumnWidth"];
                var longestTextWidth = 0;
                var textWidth = 0;
                var text = "";

                var height = 0;
                var lineSpacing = 0;
                var headerFontSize = 0;
                var totalHeight = 0;
                var foundFit = false;

                // check height
                var height = ( $( "#background" ).height() / 100 ) * self.highScores["height"];
                height -= self.highScores["borderWidth"] * 2;
                var lineSpacing = 0;
                var headerFontSize = 0;
                var totalHeight = 0;
                var fontSize = 0;
                while( !foundFit ){
                    fontSize = ( $( "#background" ).height() / 100 ) * self.highScores["fittingFontSize"];
                    lineSpacing = ( fontSize / 100 ) * self.highScores["lineSpacing"];
                    headerFontSize = fontSize + ( ( fontSize / 100 ) * self.highScores["headerFontSize"] );
                    // add highScores header
                    totalHeight = headerFontSize + lineSpacing;
                    totalHeight += ( 4 * lineSpacing );
                    // add column header
                    totalHeight += fontSize;
                    totalHeight += ( 4 * lineSpacing );
                    totalHeight += ( self.highScores["scores"].length + 1 ) * fontSize;
                    totalHeight += ( self.highScores["scores"].length ) * lineSpacing;
                    //self.debug( "totalHeight: " + height );
                    if( totalHeight > height ){
                       if( self.highScores["fittingFontSize"] > 2 ){
                            // to high
                           self.highScores["fittingFontSize"] -= 0.2;
                       } 
                       else {
                            // give up use minimum
                           foundFit = true;
                       }
                    }
                    else {
                        foundFit = true;
                    }
                }               
                // done check height

                // check width
                foundFit = false;        
                while( !foundFit ){
                    self.canvasSurface.font = self.highScores["fittingFontSize"] + "px " + self.font;
                    longestTextWidth = 0;
                    for( var i = 0; i < self.highScores["scores"].length; i++ ){
                        // check the name field for length
                        text = self.highScores["scores"][i]["name"];
                        textWidth = self.canvasSurface.measureText( text ).width;
                        if( textWidth > longestTextWidth ){
                            longestTextWidth = textWidth;
                        }
                    }
                    if( longestTextWidth > nameWidth ){
                       // to long
                       if( self.highScores["fittingFontSize"] > 2 ){
                           self.highScores["fittingFontSize"] -= 0.2;
                       } 
                       else {
                            // give up use minimum
                            foundFit = true;
                        }
                    }
                    else {
                        
                        foundFit = true;
                    }
                }
                // done check width
            }        
            // done check highScores
        };
        self.layoutChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'layoutChange' );

            self.visible = false;
            
            // set the draw rect of the highScores
            self.highScores["drawHeight"] = ( ( $( '#background' ).height() / 100 ) * self.highScores["height"] );
            self.highScores["drawWidth"] = ( ( $( '#background' ).width() / 100 ) * self.highScores["width"] );
            self.highScores["drawTop"] =  ( $( '#background' ).height() / 100 ) * self.highScores["top"];
            self.highScores["drawLeft"] = ( $( '#background' ).width() - self.highScores["drawWidth"] ) / 2;
            // done set the draw rect of th highScores

            
            
            self.calculateFonts();

            // calculate the draw rect
            self.gameStartMessage["drawHeight"] = ( $( '#background' ).height()  / 100 ) * self.gameMessageFittingFontSize;
            self.gameStartMessage["drawTop"] = ( ( $( '#background' ).height()  / 100 ) * self.gameStartMessage["top"] ) + ( self.gameStartMessage["drawHeight"] / 2 );
            
            // calculate the draw rect
            self.gameMessage["drawHeight"] = ( $( '#background' ).height()  / 100 ) * self.gameMessageFittingFontSize;
            self.gameMessage["drawTop"] = ( ( $( '#background' ).height()  / 100 ) * self.gameMessage["top"] ) + ( self.gameStartMessage["drawHeight"] / 2 );

            self.visible = true;
            
            self.canvasSurface.clearRect( 0, 0, $( "#background" ).width(), $( "#background" ).height() );

            // animate without delay
            self.animate( true );

        };
        self.animate = function( skipDelay ){
            if( !self.visible ){
                return;
            }
            if( !self.gameStartMessage["visible"] && !self.gameMessage["visible"] ){
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
/*
            // clear the clearRect
            self.canvasSurface.clearRect( self.gameStartMessage["clearLeft"], self.gameStartMessage["clearTop"], 
                                          self.gameStartMessage["clearWidth"], self.gameStartMessage["clearHeight"] );  

            self.canvasSurface.clearRect( self.gameMessage["clearLeft"], self.gameMessage["clearTop"], 
                                          self.gameMessage["clearWidth"], self.gameMessage["clearHeight"] );  
*/

            self.canvasSurface.clearRect( 0, 0, $( "#background" ).width(), $( "#background" ).height() );

            if( self.gameStartMessage["visible"] ){
                self.gameStartMessageAnimate();
            }

            if( self.gameMessage["visible"] && !self.highScores["visible"] ){
                self.gameMessageAnimate();
            }
            
            if( self.highScores["visible"] ){
                self.highScoresAnimate();
            }

        };
        self.gameStartMessageAnimate = function(){
            // get the font size and font
            var fontSize = ( $( "#background" ).height() / 100 ) * self.gameMessageFittingFontSize;
            self.canvasSurface.font =  fontSize + "px " + self.font;
            self.canvasSurface.textBaseline = 'top';
            // calculate the text width
            var textWidth = self.canvasSurface.measureText( self.gameStartMessage["text"] ).width;
            // set width to text width
            self.gameStartMessage["drawWidth"] = textWidth;
            // set left relative to text width
            self.gameStartMessage["drawLeft"] = ( $( '#background' ).width() - self.gameStartMessage["drawWidth"] ) / 2;
            
            // variate outerRect color
            self.canvasSurface.fillStyle = self.gameStartMessage["outerRectColors"][self.state];
            self.state++;
            if( self.state >=  self.gameStartMessage["outerRectColors"].length ){
               self.state = 0;
            }
            // done variate outerRect color
            
            // calculate outerRect position
            var top = 0, left = 0, width = 0, height = 0; 
            var outerRectPadding = ( $( '#background' ).height() / 100 ) *  self.gameStartMessage["outerRectPadding"];
            top = self.gameStartMessage["drawTop"];
            top -= outerRectPadding;
            height = self.gameStartMessage["drawHeight"] + ( 2 * outerRectPadding );
            left = self.gameStartMessage["drawLeft"] - outerRectPadding;
            width = self.gameStartMessage["drawWidth"] + ( 2 * outerRectPadding );
                        // done calculate outerRect position
            // draw outer rect
            self.canvasSurface.fillRect( left, top, width, height );

            // clearRect = outerRect
            self.gameStartMessage["clearTop"] = top - self.clearPadding;
            self.gameStartMessage["clearLeft"] = left - self.clearPadding;
            self.gameStartMessage["clearHeight"] = height + ( self.clearPadding * 2 );
            self.gameStartMessage["clearWidth"] = width + ( self.clearPadding * 2 );
            // done clearRect = outerRect
            
            // set innerRect color
            self.canvasSurface.fillStyle = self.gameStartMessage["innerRectColor"];
           // self.canvasSurface.fillStyle = "transparent";
            // calculate innerRect position
            var innerRectPadding = ( $( '#background' ).height() / 100 ) *  self.gameStartMessage["innerRectPadding"];
            top = self.gameStartMessage["drawTop"] - innerRectPadding;
            left = self.gameStartMessage["drawLeft"] - innerRectPadding;
            width = self.gameStartMessage["drawWidth"] + ( 2 * innerRectPadding );
            height = self.gameStartMessage["drawHeight"] + ( 2 * innerRectPadding );;
            // done calculate innerRect position
            // draw inner rect
            self.canvasSurface.fillRect( left, top, width, height );
            
            // draw gameStartText
            self.canvasSurface.fillStyle = self.gameStartMessage["fontColor"];
            self.canvasSurface.fillText( self.gameStartMessage["text"], self.gameStartMessage["drawLeft"], self.gameStartMessage["drawTop"] );
            // done draw gameStartText
        };
        self.gameMessageAnimate = function(){
            if( self.gameMessage["animationCount"] >= self.gameMessage["animationLength"] ){
                self.gameMessage["animationCount"] = 0;
                self.gameMessage["visible"] = false;
                return
            }
            
            // get the font size and font
            var fontSize = ( $( "#background" ).height() / 100 ) * self.gameMessageFittingFontSize;
            self.canvasSurface.font = fontSize + "px " + self.font;
            self.canvasSurface.textBaseline = 'top';
            // calculate the text width
            var textWidth = self.canvasSurface.measureText( self.gameMessage["text"] ).width;
            // set width to text width
            self.gameMessage["drawWidth"] = textWidth;
            // set left relative to text width
            self.gameMessage["drawLeft"] = ( $( '#background' ).width() - self.gameMessage["drawWidth"] ) / 2;
            
            self.canvasSurface.fillStyle = self.gameMessage["outerRectColor"];
            
            // calculate outerRect position
            var top = 0, left = 0, width = 0, height = 0; 
            var outerRectPadding = ( $( '#background' ).height() / 100 ) *  self.gameMessage["outerRectPadding"];
            top = self.gameMessage["drawTop"] - outerRectPadding;
            left = self.gameMessage["drawLeft"] - outerRectPadding;
            width = self.gameMessage["drawWidth"] + ( 2 * outerRectPadding );
            height = self.gameMessage["drawHeight"] + ( 2 * outerRectPadding );
            // done calculate outerRect position
            // draw outer rect
            self.canvasSurface.fillRect( left, top, width, height );

            // clearRect = outerRect
            self.gameMessage["clearTop"] = top - self.clearPadding;
            self.gameMessage["clearLeft"] = left - self.clearPadding;
            self.gameMessage["clearHeight"] = height + ( self.clearPadding * 2 );
            self.gameMessage["clearWidth"] = width + ( self.clearPadding * 2 );
            // done clearRect = outerRect
            
            // set innerRect color
            self.canvasSurface.fillStyle = self.gameMessage["innerRectColor"];
            // calculate innerRect position
            var innerRectPadding = ( $( '#background' ).height() / 100 ) *  self.gameMessage["innerRectPadding"];
            top = self.gameMessage["drawTop"] - innerRectPadding;
            left = self.gameMessage["drawLeft"] - innerRectPadding;
            width = self.gameMessage["drawWidth"] + ( 2 * innerRectPadding );
            height = self.gameMessage["drawHeight"] + ( 2 * innerRectPadding );;
            // done calculate innerRect position
            // draw inner rect
            self.canvasSurface.fillRect( left, top, width, height );
            
            // draw gameStartText
            self.canvasSurface.fillStyle = self.gameMessage["fontColor"];
            self.canvasSurface.fillText( self.gameMessage["text"], self.gameMessage["drawLeft"], self.gameMessage["drawTop"] );
            // done draw gameStartText

            self.gameMessage["animationCount"]++;
        };
        self.highScoresAnimate = function(){
            var highScores = jsProject.getValue( "highScores", "game" );
            var top = 0, left = 0, right = 0, bottom = 0, width = 0, height = 0;;
            self.canvasSurface.strokeStyle = "rgba(0,0,0,0.7)";
            self.canvasSurface.fillStyle = "rgba(0,0,0,0.7)";
            self.canvasSurface.lineWidth = self.highScores["lineWidth"];
            
            self.canvasSurface.beginPath();
            
            top = self.highScores["drawTop"] + self.highScores["lineWidth"] / 2;
            left = self.highScores["drawLeft"] + self.highScores["borderWidth"] + self.highScores["lineWidth"] / 2;
            self.canvasSurface.moveTo( left, top );
            
            left = self.highScores["drawLeft"] + self.highScores["drawWidth"] - ( self.highScores["borderWidth"] + ( self.highScores["lineWidth"] / 2 ) );
            self.canvasSurface.lineTo( left, top );
            self.canvasSurface.quadraticCurveTo( left + self.highScores["borderWidth"], top, left + self.highScores["borderWidth"], top + self.highScores["borderWidth"] );
            bottom = self.highScores["drawTop"] + self.highScores["drawHeight"] - ( self.highScores["borderWidth"] + ( self.highScores["lineWidth"] / 2 ) ); 
            self.canvasSurface.lineTo( left + self.highScores["borderWidth"], bottom );
            self.canvasSurface.quadraticCurveTo( left + self.highScores["borderWidth"], bottom + self.highScores["borderWidth"], left, bottom + self.highScores["borderWidth"] );
            left = self.highScores["drawLeft"] + self.highScores["lineWidth"] / 2;
            self.canvasSurface.lineTo( left + self.highScores["borderWidth"], bottom + self.highScores["borderWidth"] );
            self.canvasSurface.quadraticCurveTo( left, bottom + self.highScores["borderWidth"], left, bottom );
            self.canvasSurface.lineTo( left, top  + self.highScores["borderWidth"] );
            self.canvasSurface.quadraticCurveTo( left, top, left + self.highScores["borderWidth"], top );
            self.canvasSurface.stroke();

            top = ( self.highScores["drawTop"] - 1 ) + self.highScores["lineWidth"];
            left = ( self.highScores["drawLeft"] - 1 ) + self.highScores["lineWidth"];
            height = ( self.highScores["drawHeight"] + 1 ) - ( self.highScores["lineWidth"] * 2 );
            width = ( self.highScores["drawWidth"] + 1 ) - ( self.highScores["lineWidth"] * 2 );
            self.canvasSurface.fillRect( left, top, width, height );
            // done draw outer rect
            
            self.canvasSurface.fillStyle = self.gameMessage["fontColor"];
            var text = '';
            var fontSize = ( $( "#background" ).height() / 100 ) * self.highScores["fittingFontSize"]; 
            var lineSpacing = ( fontSize / 100 ) * self.highScores["lineSpacing"];
            fontSize += ( fontSize / 100 ) * self.highScores["headerFontSize"];
            // get the font size and font
            self.canvasSurface.font = fontSize + "px " + self.font;
            top = self.highScores["drawTop"] + self.highScores["borderWidth"];
            top += fontSize + lineSpacing;
            text = "HighScores";
            var textWidth = self.canvasSurface.measureText( text ).width;
            left = ( $( '#background' ).width() - textWidth ) / 2;
            self.canvasSurface.fillText( text, left, top );
            top += fontSize + ( 4 * lineSpacing );

            fontSize = ( $( "#background" ).height() / 100 ) * self.highScores["fittingFontSize"]; 
            left = self.highScores["drawLeft"] + self.highScores["borderWidth"];
            width = self.highScores["drawWidth"]  - ( 2 * self.highScores["borderWidth"] ) 
            // get the font size and font
            self.canvasSurface.font = fontSize + "px " + self.font;

            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "name" ){
                    text = self.translationIds[i]["translation"];
                }
            }
            self.canvasSurface.fillText( text, left, top );
            left += ( width  / 100 ) * self.highScores["nameColumnWidth"]
            for( var i = 0; i < self.translationIds.length; i++ ){
                if( self.translationIds[i]["id"] === "rank" ){
                    text = self.translationIds[i]["translation"];
                }
            }
            left += ( width  / 100 ) * self.highScores["rankColumnWidth"]
            left -= self.canvasSurface.measureText( text ).width
            self.canvasSurface.fillText( text, left, top );
            left += self.canvasSurface.measureText( text ).width
            left += ( width  / 100 ) * self.highScores["levelColumnWidth"]
            left -= self.canvasSurface.measureText( "Level" ).width
            self.canvasSurface.fillText( "Level", left, top );
            left += self.canvasSurface.measureText( "Level" ).width
            left += ( width  / 100 ) * self.highScores["scoreColumnWidth"]
            left -= self.canvasSurface.measureText( "Score" ).width
            self.canvasSurface.fillText( "Score", left, top );
            
            top += fontSize + ( 4 * lineSpacing );

            
            for( var i = 0; i < self.highScores["scores"].length; i++ ){
                width = self.highScores["drawWidth"]  - ( 2 * self.highScores["borderWidth"] ) 
                left = self.highScores["drawLeft"] + self.highScores["borderWidth"];
                text = self.highScores["scores"][i]["name"];
                self.canvasSurface.fillStyle = self.gameMessage["fontColor"];
                self.canvasSurface.fillText( text, left, top );
                left +=  ( width / 100 ) * self.highScores["nameColumnWidth"]
                left +=  ( width / 100 ) * self.highScores["rankColumnWidth"]
                
                left -= self.canvasSurface.measureText( self.highScores["scores"][i]["rank"] ).width
                self.canvasSurface.fillText( self.highScores["scores"][i]["rank"], left, top );
                left += self.canvasSurface.measureText( self.highScores["scores"][i]["rank"] ).width
                
                left += ( width / 100 ) * self.highScores["levelColumnWidth"]
                left -= self.canvasSurface.measureText( self.highScores["scores"][i]["level"] ).width
                self.canvasSurface.fillText( self.highScores["scores"][i]["level"], left, top );
                left += self.canvasSurface.measureText( self.highScores["scores"][i]["level"] ).width
                
                left += ( width / 100 ) * self.highScores["scoreColumnWidth"]
                left -= self.canvasSurface.measureText( self.highScores["scores"][i]["score"] ).width
                self.canvasSurface.fillText( self.highScores["scores"][i]["score"], left, top );

                top += fontSize + lineSpacing;
                //self.debug( self.translationIds[i]["id"] );
            }
        }
        self.translate = function(){
            self.debug( 'translate' );
            // make a ajax call for the translations
            var translationIds = []
            for( var i = 0; i < self.translationIds.length; i++ ){
                translationIds.push( self.translationIds[i]["id"] )
                //self.debug( self.translationIds[i]["id"] );
            }
            gameDevelopment.translate( 'spaceInvaders', translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            // callback for the translations
            $.each( result, function( index, value ) {
                for( var i = 0; i < self.translationIds.length; i++ ){
                    if( self.translationIds[i]["id"] === index ){
                        self.translationIds[i]["translation"] = value;
                        //self.debug( index + ":" + value );
                    }
                    if( index === self.gameStartMessage["textId"] ){
                        self.gameStartMessage["text"] = value;
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
            show : function( visible ) {
                self.show( visible );
            }
        };
    };
})( gameDevelopment );