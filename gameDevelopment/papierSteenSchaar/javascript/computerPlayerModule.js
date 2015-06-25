/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the computer player for the game Rock-Paper-Scissors
 *          the module displays a hand on the left side of the screen
 *          the module makes a choice for the computer based on the selected game strategy
 *          the module displays a shaking hand during countdown
 *          the module displays an animated hand according to the computers choice when the choice is diplayed 
 *          
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
    gameDevelopment.computerPlayerModule = function( ) {


    /*
     *  module computerPlayerModule 
     *   
     *  functions: 
     *      private:
     *          construct                       called internal
     *          addHtml                         called from the construct function
     *          show                            called by the public function
     *          drawImages                      called from the show function
     *          sceneChange                     called by the event subscription playingFieldChanged
     *          shake                           called by the event subscription handShake
     *          shakeStep                       called by a timer
     *          shakeStop                       called by the function showChoice
     *          stopGame                        called by the event subscription gameStop
     *          makeChoice                      called by the event subscription makeComputerChoice
     *          chooseNotAgain                  called by the function makeChoice
     *          chooseOneTwoThree               called by the function makeChoice
     *          chooseICanDoThat                called by the function makeChoice
     *          showChoice                      called by the event subscription showChoice    
     *          resetChoice                     called by the event subscription resetChoice
     *          debug
     *     public:
     *          show
     *          
     *  event subscription: 
     *      playingFieldChanged                 called from playingfieldModule
     *      gameStop                            called from gameModule
     *      showChoice                          called from gameFlowModule
     *      handShake                           called from gameFlowModule
     *      makeComputerChoice                  called from gameFlowModule
     *      resetChoice                         called from gameFlowModule
     *      
     */
    
        // private
        var self = this;
        self.MODULE = 'computerPlayerModule';
        self.debugOn = true;
        self.visible = false;                                                   // visibility
        self.imagesDrawn = false;                                               // store if images are drawn    
        self.width = 245;                                                       // px constant dimensions of the displayed hand
        self.height = 364;                                                      // px constant dimensions of the displayed hand
        self.offsetLeft = 100;                                                  // px constant positions of the displayed hand
        self.offsetTop = 25;                                                    // px constant positions of the displayed hand
        self.rotation = 25;                                                     // rotation of the drawn hand
        self.imageOffsetLeft = -100;                                            // px constant, image offset of the orignal image
        self.imageOffsetTop =  -10;                                             // px constant, image offset of the orignal image    
        self.hands = [ { 'name' : "handStone", "canvasSurface" : null },        // store hands structure
                       { 'name' : "handPaper", "canvasSurface" : null },
                       { 'name' : "handScissors", "canvasSurface" : null } ];
        self.shakeTimer = null;                                                 // store timer
        self.shakeScaleOffset = 0.06;                                           // constant scaling factor relative to normal scale
        self.shakeCurrentScale = 1.0;                                           // store the current scaling factor
        self.shakeDirection = 1;                                                // 1 or -1 add or substract scale offset
        self.shakeScaleChange = 0.01;                                           // step for change in scaling factor per animation frame     
        self.shakedelay = 20;                                                   // ms constant, delay for the timer
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add html
            self.addHtml();
            
            // subscribe to events
            jsProject.subscribeToEvent( 'playingFieldChanged', self.sceneChange );
            jsProject.subscribeToEvent( 'gameStop', self.stopGame );
            jsProject.subscribeToEvent( 'showChoice', self.showChoice );
            jsProject.subscribeToEvent( 'handShake', self.shake );
            jsProject.subscribeToEvent( 'makeComputerChoice', self.makeChoice );
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
                    html += ' id="computer' + self.hands[i]['name'] + '" ';
                    html += ' width="' + self.width + '"';
                    html += ' height="' + self.height + '"';
                    html += ' style="position:absolute;z-index:' + jsProject.getValue( "computer", "zIndex" ) + '; ';
                    html += ' background-color:transparent;';
                    html += ' "';
                    html += ' >';
                html += '</canvas>';
                // done create a canvas for the hand
            }
            // done loop over the hands structure
            
            // add the html to the scene
            $('#jsProjectScene').append( html );
            
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // get the canvas surface to draw on set it in the hands structure
                self.hands[i]['canvasSurface'] = document.getElementById( 'computer' + self.hands[i]['name'] ).getContext( '2d' );
                // hide the hand
                $( '#computer' + self.hands[i]['name'] ).hide();
            }
            // done loop over the hands structure
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
                $('#computer' + self.hands[jsProject.getValue( "computerHand", "game" )]['name'] ).show();
                // set the positions
                self.sceneChange();
            }
            else {
                self.visible = false;
                // hide the selected hand
                $('#computer' + self.hands[jsProject.getValue( "computerHand", "game" )]['name'] ).hide();
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
                $( '#computer' + self.hands[i]['name'] ).css( 'width', self.width + 'px' );    
                $( '#computer' + self.hands[i]['name'] ).css( 'height', self.height + 'px' ); 
                self.hands[i]['canvasSurface'].canvas.width = self.width;
                self.hands[i]['canvasSurface'].canvas.height = self.height;
                // done set the dimensions of the canvas
                
                // draw hand image
                self.hands[i]['canvasSurface'].save();
                self.hands[i]['canvasSurface'].translate( image.width / 2, image.height / 2 );
                // add rotation
                self.hands[i]['canvasSurface'].rotate( self.rotation * TO_RADIANS);
                self.hands[i]['canvasSurface'].drawImage( image, -100, -10 );
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
            
            // claculate positions of the hands
            var top = parseInt( $( '#playingfield' ).position().top ) + self.offsetTop;
            var left = parseInt( $( '#playingfield' ).position().left )  + self.offsetLeft ;
            // done claculate positions of the hands
            
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                // set position of hand
                $( '#computer' + self.hands[i]['name'] ).css( 'top', top + 'px' );    
                $( '#computer' + self.hands[i]['name'] ).css( 'left', left + 'px' );    
                // done set position of hand
            }
            // done loop over the hands structure
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
            self.hands[0]['canvasSurface'].clearRect(0,0,self.width,self.height);
            // draw hand
            self.hands[0]['canvasSurface'].save();
            self.hands[0]['canvasSurface'].translate( image.width / 2, image.height / 2 );
            // add rotation
            self.hands[0]['canvasSurface'].rotate( self.rotation * TO_RADIANS );
            // add scaling
            self.hands[0]['canvasSurface'].scale( self.shakeCurrentScale, self.shakeCurrentScale );
            self.hands[0]['canvasSurface'].drawImage( image, -100, -10 );
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
            
            // draw hand
            self.hands[0]['canvasSurface'].save();
            self.hands[0]['canvasSurface'].translate( image.width / 2, image.height / 2 );
            // add rotation
            self.hands[0]['canvasSurface'].rotate( self.rotation * TO_RADIANS );
            self.hands[0]['canvasSurface'].drawImage( image, self.imageOffsetLeft, self.imageOffsetTop );
            self.hands[0]['canvasSurface'].restore(); 
            // done draw hand
        };
        self.stopGame = function(){
            // stop shaking
            self.shakeStop();
            // reset computer hand
            jsProject.setValue( "computerHand", "game", 0 );
            // loop over the hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === 0 ){
                    // show first hand
                    $( '#computer' + self.hands[i]['name'] ).show();
                }
                else {
                    $( '#computer' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over the hands structure
        };
        self.makeChoice = function(){
            // get selected startegy
            var strategy = parseInt( jsProject.getValue( "strategy", "game" ) );
            // choose strategy
            switch( strategy ) {
                case 0: { // strategy = notAgain
                    self.chooseNotAgain();
                    break;
                }
                case 1: { // strategy = as123
                    self.chooseOneTwoThree();
                    break;
                }
                case 2: { // strategy = iCanDoThat
                    self.chooseICanDoThat();
                    break;
                }
                default: {
                    self.debug( "unknown strategy" );
                    console.log( "unknown strategy" );
                }
            }
            // done choose strategy
        };
        self.chooseNotAgain = function(){
            // choose not again startegy -> choose some other hand as in previous choice if available
            
            // get previous choice
            var previousComputerHand = jsProject.getValue( "previousComputerHand", "game" );

            // make a choice
            var choice = 0;
            if( previousComputerHand !== null ){
                var i = Math.random();
                if( i >= 0.5 ){
                    choice = previousComputerHand + 1;
                }
                else {
                    choice = previousComputerHand + 2;
                }
                choice %= 3;
            }
            else {
                choice = parseInt( Math.random() * 3 );
            }
            // done make a choice
            
            // set the choice
            jsProject.setValue( "computerHand", "game", choice );
        };
        self.chooseOneTwoThree = function(){
            // choose oneTwoThree startegy -> choose next hand in hands structure, restart at begin when next > hands length
            
            // get previous choice
            var previousComputerHand = jsProject.getValue( "previousComputerHand", "game" );
            
            // make a choice
            var choice = 0;
            if( previousComputerHand !== null ){
                choice = previousComputerHand + 1;
                choice %= 3;
            }
            else {
                choice = parseInt( Math.random() * 3 );
            }
            // done make a choice
            
            // set the choice
            jsProject.setValue( "computerHand", "game", choice );
        };
        self.chooseICanDoThat = function(){
            // choose ICanDoThat startegy -> choose previous hand player chose if available

            // get previous choices
            var previousPlayerHand = jsProject.getValue( "previousPlayerHand", "game" );
            var previousComputerHand = jsProject.getValue( "previousComputerHand", "game" );
            // done get previous choices
            
            // make a choice
            var choice = 0;
            if( previousComputerHand !== null ){
                if( previousPlayerHand === previousComputerHand ){
                    choice = previousComputerHand + 1;
                    choice %= 3;
                }
                else {
                    choice = previousPlayerHand;
                }
            }
            else {
                self.debug( "random choice no previous" );
                choice = parseInt( Math.random() * 3 );
            }
            // done make a choice

            // set the choice
            jsProject.setValue( "computerHand", "game", choice );
        };
        self.showChoice = function(){
            // stop shaking
            self.shakeStop();
            
            // set the previous computer choice
            jsProject.setValue( "previousComputerHand", "game", jsProject.getValue( "computerHand", "game" ) );
            
            // loop over hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === jsProject.getValue( "computerHand", "game" ) ){
                    // show selected hand
                    $( '#computer' + self.hands[i]['name'] ).show();
                }
                else {
                    // hide unselected hands
                    $( '#computer' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over hands structure
        };
        self.resetChoice = function(){
            // loop over hands structure
            for( var i = 0; i < self.hands.length; i++ ){
                if( i === 0 ){
                    // show first hand
                    $( '#computer' + self.hands[i]['name'] ).show();
                }
                else {
                    // hide other hands
                    $( '#computer' + self.hands[i]['name'] ).hide();
                }
            }
            // done loop over hands structure
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