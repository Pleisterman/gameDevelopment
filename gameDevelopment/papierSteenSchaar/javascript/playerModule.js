/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the player buttons and the player hand for the game Rock-Paper-Scissors
 *          three buttons are displayed on the right of the screen, one button for Rock, Paper, Scissors choice of the user
 *          a hand is animated in the playing field on the right side of the center
 *          a hand shake animation is drawn during the gameflow just before showing the choosen hand
 *          when a choice is presented the choosen hand is animated on the screen
 *          buttons are enabled and disabled according to the gameflow
 *          
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
    gameDevelopment.playerModule = function( ) {


    /*
     *  module playerModule 
    *   
     *  functions: 
     *      private:
     *          construct                       called internal
     *          addHtml                         called from the construct function
     *          show                            called by the public function
     *          handSelectOverChange            called by html buttons
     *          handSelectClick                 called by html buttons
     *          drawImages                      called from the show function
     *          sceneChange                     called by the event subscription playingFieldChanged
     *          shake                           called by the event subscription handShake
     *          shakeStep                       called by a timer
     *          shakeStop                       called by the function showChoice
     *          stopGame                        called by the event subscription gameStop
     *          showChoice                      called by the event subscription showChoice    
     *          resetChoice                     called by the event subscription resetChoice
     *          enablePlayerChoice              called by the event subscription enablePlayerChoice    
     *          debug
     *     public:
     *          show     
     *   
     *  event subscription: 
     *      playingFieldChanged                 called from playingfieldModule
     *      gameStop                            called from gameModule
     *      showChoice                          called from gameFlowModule
     *      handShake                           called from gameFlowModule
     *      enablePlayerChoice                  called from gameFlowModule  
     *      resetChoice                         called from gameFlowModule
     *      
     */
    
        // private
        var self = this;
        self.MODULE = 'playerModule';
        self.debugOn = false;
        self.visible = false;                                                                   // visibility
        self.imagesDrawn = false;                                                               // store if images are drawn        
        self.handWidth = 245;                                                                   // px constant dimensions of the displayed hand
        self.handHeight = 364;                                                                  // px constant dimensions of the displayed hand
        self.handOffsetLeft = 165;                                                              // px constant positions of the displayed hand
        self.handOffsetTop = 25;                                                                // px constant positions of the displayed hand
        self.rotation = -15;
        self.imageRotationLeft = 130;                                                           // px constant, translation left of the rotation
        self.imageRotationTop = 170;                                                            // px constant, translation top of the rotation
        self.imageOffsetLeft = -120;                                                            // px constant, image offset of the orignal image
        self.hands = new Array( { 'name' : "handStone", "canvasSurface" : null },               // store hands structure
                                { 'name' : "handPaper", "canvasSurface" : null },
                                { 'name' : "handScissors", "canvasSurface" : null } );
        self.handSelectButtons = new Array( "stoneButton", "paperButton", "scissorsButton" );   // array with button id's that will be created
        self.handSelectButtonWidth = 50;                                                        // px constant, store dimensions of the buttons
        self.handSelectButtonHeight = 50;                                                       // px constant, store dimensions of the buttons
        self.handSelectButtonSpacing = 7;                                                       // px constant, store positions of the buttons
        self.handSelectButtonOffsetTop = 210;                                                   // px constant, store positions of the buttons
        self.handSelectButtonOffsetLeft = 420;                                                  // px constant, store positions of the buttons
        self.handSelectRadioButton = null;                                                      // store the radiobutton module
        self.shakeTimer = null;                                                                 // store timer
        self.shakeScaleOffset = 0.06;                                                           // constant scaling factor relative to normal scale  
        self.shakeCurrentScale = 1.0;                                                           // store the current scaling factor
        self.shakeDirection = 1;                                                                // 1 or -1 add or substract scale offset
        self.shakeScaleChange = 0.01;                                                           // step for change in scaling factor per animation frame     
        self.shakedelay = 20;                                                                   // ms constant, delay for the timer
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();

            // subscribe to events
            jsProject.subscribeToEvent( 'playingFieldChanged', self.sceneChange );
            jsProject.subscribeToEvent( 'gameStop', self.stopGame );
            jsProject.subscribeToEvent( 'enablePlayerChoice', self.enablePlayerChoice );
            jsProject.subscribeToEvent( 'showChoice', self.showChoice );
            jsProject.subscribeToEvent( 'handShake', self.shake );
            jsProject.subscribeToEvent( 'resetChoice', self.resetChoice );
            // done subscribe to events
            
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // create a canvas for the hand
                html += '<canvas';
                    html += ' id="player' + self.hands[i]['name'] + '" ';
                    html += ' width="' + self.handWidth + '"';
                    html += ' height="' + self.handHeight + '"';
                    html += ' style="position:absolute;z-index:' + jsProject.getValue( "playerHand", "zIndex" ) + '; ';
                    html += ' background-color:transparent;';
                    html += ' "';
                    html += ' >';
                html += '</canvas>';
                // done create a canvas for the hand
            }
            // done loop over the hands structure
            
            // add button css
            html += '<style> ' + "\n";
            
            // loop over the button array
            for( var i = 0; i < self.handSelectButtons.length; i++ ){
                    // button css
                    html += ' .' + self.handSelectButtons[i] + ' { ' + "\n";
                    html += ' background-image:url(./papierSteenSchaar/images/' + self.handSelectButtons[i] + '.png);';
                    html += '  }' + "\n" + "\n";
                    // button over css
                    html += ' .' + self.handSelectButtons[i] + 'Over { ' + "\n";
                    html += ' background-image:url(./papierSteenSchaar/images/' + self.handSelectButtons[i] + 'Over.png);';
                    html += '  }' + "\n" + "\n";
                    // button selected csss
                    html += ' .' + self.handSelectButtons[i] + 'Selected { ' + "\n";
                    html += ' background-image:url(./papierSteenSchaar/images/' + self.handSelectButtons[i] + 'Selected.png);';
                    html += '  }' + "\n" + "\n";
                    // button disabled css
                    html += ' .' + self.handSelectButtons[i] + 'Disabled { ' + "\n";
                    html += ' background-image:url(./papierSteenSchaar/images/' + self.handSelectButtons[i] + 'Disabled.png);';
                    html += '  }' + "\n" + "\n";
            }        
            // done loop over the button array
            html += '</style> ' + "\n";
            // done add button css

            // add buttons html
            html += '<div id="playerHandSelectRadioButtonDiv" class="playerHandSelectRadioButtonDiv"';
                html += ' style="position:absolute;z-index:' + jsProject.getValue( "playerButtons", "zIndex" ) + '; ';
                html += '"';
            html += '>';
            
                // loop over the button array
                for( var i = 0; i < self.handSelectButtons.length; i++ ){
                    // add button html
                    html += '<div class=" ' + self.handSelectButtons[i] + '"';
                        html += ' style="position:absolute;top:' + i * ( self.handSelectButtonHeight + self.handSelectButtonSpacing ) + 'px;';
                        html += ' width:' + self.handSelectButtonWidth + 'px;';
                        html += ' height:' + self.handSelectButtonHeight + 'px;';
                        html += '"';
                    html += ' value= "' + i  + '" ';
                    html += '>';
                    html += '</div>';
                    // done add button html
                }        
                // done loop over the button array
            html += '</div>';
            
            $('#jsProjectScene').append( html );
            // done add buttons html
            
            // create the radiobutton module
            self.handSelectRadioButton = new jsProject.radioButtonModule( 0, "playerHandSelectRadioButtonDiv", self.handSelectClick, self.handSelectOverChange );
            // disable buttons
            self.handSelectRadioButton.enable( false );
            // hide buttons
            $( '#playerHandSelectRadioButtonDiv' ).hide();

            
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // get the canvas surface to draw on set it in the hands structure
                self.hands[i]['canvasSurface'] = document.getElementById( 'player' + self.hands[i]['name'] ).getContext( '2d' );
                // hide the hand
                $( '#player' + self.hands[i]['name'] ).hide();
            }
            // done loop over the hands structure
        };
        self.handSelectOverChange = function(  ){
            self.debug( 'handSelectOverChange' );
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound

            // play sound
            var handSelectOverSound = jsProject.getResource( 'playerHandSelectOver', 'sound' );
            if( handSelectOverSound ){
                handSelectOverSound.play();
            }
            // done play sound
        };
        self.handSelectClick = function( value ){
            self.debug( 'handSelectClick' );
            // set the selected choice
            jsProject.setValue( "playerHand", "game", parseInt( value ) );
            
            // no sound
            if( !jsProject.getValue( "on", "sound" ) ){
                return;
            }
            // done no sound
            
            // play sound
            var handSelectSound = jsProject.getResource( 'playerHandSelect', 'sound' );
            if( handSelectSound ){
                handSelectSound.play();
            }
            // done play sound
        };
        self.show = function( visible ){
            self.debug( 'show' );
            if( !self.imagesDrawn ){
                self.imagesDrawn = true;
                // create the hand images
                self.drawImages();
            }  
            if( visible ){
                self.visible = true;
                // show the current selected hand
                $('#player' + self.hands[jsProject.getValue( "playerHand", "game" )]['name'] ).show();
                // show the radio buttons
                $( '#playerHandSelectRadioButtonDiv' ).show();
                // set the positions
                self.sceneChange();
            }
            else {
                self.visible = false;
                // hide the radio buttons
                $( '#playerHandSelectRadioButtonDiv' ).hide();
                // hide the selected hand
                $('#player' + self.hands[jsProject.getValue( "playerHand", "game" )]['name'] ).hide();
            }
        };
        self.drawImages = function(){
            self.debug( 'drawImages' );

            var TO_RADIANS = Math.PI/180; 
            
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // get the image
                var image = jsProject.getResource( self.hands[i]['name'], 'image' );
                // set the dimensions of the canvas
                $( '#player' + self.hands[i]['name'] ).css( 'width', self.handWidth + 'px' );    
                $( '#player' + self.hands[i]['name'] ).css( 'height', self.handHeight + 'px' ); 
                self.hands[i]['canvasSurface'].canvas.width = self.handWidth;
                self.hands[i]['canvasSurface'].canvas.height = self.handHeight;
                // done set the dimensions of the canvas

                // draw hand image
                self.hands[i]['canvasSurface'].save();
                self.hands[i]['canvasSurface'].translate( self.imageRotationLeft, self.imageRotationTop );
                // add rotation
                self.hands[i]['canvasSurface'].rotate( self.rotation * TO_RADIANS);
                self.hands[i]['canvasSurface'].drawImage( image, self.imageOffsetLeft, 0 );
                self.hands[i]['canvasSurface'].restore(); 
                // done draw hand image
            }
            // done loop over the hands structure
        };
        self.sceneChange = function( ) {
            if( !self.visible ){
                return;
            }
            self.debug( 'sceneChange' );
            
            // calculate positions of the hands
            var top = parseInt( $( '#playingfield' ).position().top ) + self.handOffsetTop;
            var left = parseInt( $( '#playingfield' ).position().left )  + self.handOffsetLeft ;
            // done calculate positions of the hands
            
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // set position of hand
                $( '#player' + self.hands[i]['name'] ).css( 'top', top + 'px' );    
                $( '#player' + self.hands[i]['name'] ).css( 'left', left + 'px' );    
                // done set position of hand
            }
            // done loop over the hands structure

            // calculate positions of the radio buttons
            var top = parseInt( $( '#playingfield' ).position().top ) + self.handSelectButtonOffsetTop;
            var left = parseInt( $( '#playingfield' ).position().left )  + self.handSelectButtonOffsetLeft ;
            // done calculate positions of the radio buttons
            
            // set postition of the radio buttons
            $( '#playerHandSelectRadioButtonDiv' ).css( 'top', top + 'px' );    
            $( '#playerHandSelectRadioButtonDiv' ).css( 'left', left + 'px' );    
            // done set postition of the radio buttons
            
        };
        self.shake = function(){
            self.debug( 'shake' );
            // remove the timer
            if( self.shakeTimer ){
                clearTimeout( self.shakeTimer );
                self.shakeTimer = null;
            }
            // done remove the timer
            
            // set start conditions
            self.shakeCurrentScale = 1.0;
            self.shakeDirection = 1;
            // done set start conditions
            
            // start timer
            self.shakeTimer = setTimeout( function () { self.shakeStep(); }, self.shakedelay );
        };
        self.shakeStep = function(){
            var TO_RADIANS = Math.PI/180;

            // remove the timer
            if( self.shakeTimer ){
                clearTimeout( self.shakeTimer );
                self.shakeTimer = null;
            }
            // done remove the timer
            
            // scale ++
            if( self.shakeDirection > 0 ){
                self.shakeCurrentScale += self.shakeScaleChange;
                if( self.shakeCurrentScale >= 1.0 + self.shakeScaleOffset ){
                    self.shakeDirection = -1;
                } 
            }
            else { // scale --
                self.shakeCurrentScale -= self.shakeScaleChange;
                if( self.shakeCurrentScale <= 1.0 - self.shakeScaleOffset ){
                    self.shakeDirection = 1;
                } 
            }
            // get the image
            var image = jsProject.getResource( self.hands[0]['name'], 'image' );
            // clear whole canvas
            self.hands[0]['canvasSurface'].clearRect(0,0,self.handWidth,self.handHeight);
            // draw hand
            self.hands[0]['canvasSurface'].save();
            self.hands[0]['canvasSurface'].translate( 130, 170 );
            // add rotation
            self.hands[0]['canvasSurface'].rotate( -15 * TO_RADIANS);
            // add scaling
            self.hands[0]['canvasSurface'].scale( self.shakeCurrentScale, self.shakeCurrentScale );
            self.hands[0]['canvasSurface'].drawImage( image, -120, 0 );
            self.hands[0]['canvasSurface'].restore(); 
            // done draw hand
            
            // start timer
            self.shakeTimer = setTimeout( function () { self.shakeStep(); }, self.shakedelay );
        };            
        self.shakeStop = function(){
            var TO_RADIANS = Math.PI/180; 
            
            // remove timer
            if( self.shakeTimer ){
                clearTimeout( self.shakeTimer );
                self.shakeTimer = null;
            }
            // done remove timer
            
            // get image
            var image = jsProject.getResource( self.hands[0]['name'], 'image' );
            // clear whole canvas
            self.hands[0]['canvasSurface'].clearRect(0,0,self.width,self.height);

            // reset canvas dimensions    
            self.hands[0]['canvasSurface'].canvas.width = self.handWidth;
            self.hands[0]['canvasSurface'].canvas.height = self.handHeight;
            // done reset canvas dimensions    

            // draw hand
            self.hands[0]['canvasSurface'].save();
            self.hands[0]['canvasSurface'].translate( 130, 170 );
            // add rotation
            self.hands[0]['canvasSurface'].rotate( -15 * TO_RADIANS);
            self.hands[0]['canvasSurface'].drawImage( image, -120, 0 );
            self.hands[0]['canvasSurface'].restore(); 
            // done draw hand
        };
        self.stopGame = function(){
            // stop shaking
            self.shakeStop();
            // reset player hand selection
            self.handSelectRadioButton.setValue( 0 );
            // disavle radio buttons
            self.handSelectRadioButton.enable( false );
            // reset choie
            jsProject.setValue( "playerHand", "game", 0 );

            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === 0 ){
                    // show first hand
                    $( '#player' + self.hands[i]['name'] ).show();
                }
                else {
                    $( '#player' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over the hands structure
            
        };
        self.showChoice = function(){
            // stop shaking
            self.shakeStop();
            
            // show the choice of the radio button
            self.handSelectRadioButton.showChoice( );
            // set the choice
            jsProject.setValue( "previousPlayerHand", "game", jsProject.getValue( "playerHand", "game" ) );
            
            // loop over hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === jsProject.getValue( "playerHand", "game" ) ){
                    // show selected hand
                    $( '#player' + self.hands[i]['name'] ).show();
                }
                else {
                    // hide unselected hands
                    $( '#player' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over hands structure
            
        };
        self.resetChoice = function(){
            self.debug( "resetChoice" );
            // loop over hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === 0 ){
                    // show first hand
                    $( '#player' + self.hands[i]['name'] ).show();
                }
                else {
                    // hide other hands
                    $( '#player' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over hands structure
        };
        self.enablePlayerChoice = function(){
            self.handSelectRadioButton.enable( true );
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
            show : function( visible ){
                self.show( visible );
            }
        };
    };
})( gameDevelopment );