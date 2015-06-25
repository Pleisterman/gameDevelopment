/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the stars for the application space invaders
 *          the stars are drawn on the background of the screen 
 *          
 * Last revision: 17-05-2015
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

(function (gameDevelopment) {
    gameDevelopment.starsModule = function () {

        /*
         *  module starsModule 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          layoutChange        called by the event subscription
         *          debug
         *      public:
         *          show 
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         */

        // private
        var self = this;
        self.MODULE = 'starsModule';
        self.debugOn = false;
        self.visible = false;                   // visibiltity
        self.canvasSurface = null;              // store the surface to draw on
        self.starCount = 120;                   // constant, number of stars to draw
        self.starMaximumSize = 15;              // pereentage of background height,  maximum height / width a star can have
        self.imagePartWidth = 40;               // px of original image
        self.imageParts = 4;                    // number of different parts in original image
        
        // functions
        self.construct = function() {
            self.debug('construct');

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById('starsDrawLayer').getContext('2d');

            // subscribe to events
            jsProject.subscribeToEvent('layoutChange', self.layoutChange);
        };
        self.show = function( visible ) {
            self.visible = visible;
            if( visible ) {
                self.debug('show');

                // change the layout according to new dimensions
                self.layoutChange();
            }
            else {
                // clear the clearRect
                self.canvasSurface.clearRect( 0, 0, $( '#background').width(), $( '#background').height() );  
            }
        };
        self.layoutChange = function ( ) {
            if (!self.visible) {
                return;
            }
            self.debug('layoutChange');

            // clear the clearRect
            self.canvasSurface.clearRect( 0, 0, $( '#background').width(), $( '#background').height() );
            
            // get the image    
            var image = jsProject.getResource( 'stars', 'image' );
            // draw stars.
            var part = 0;
            var top = 0;
            var left = 0;
            var size = 0;
            for( var i = 0; i < self.starCount; i++ ) {
                // vary postition
                top = Math.random() * $( "#background" ).height();
                left = Math.random() * $( "#background" ).width();
                // vary size
                size = self.starMaximumSize * Math.random() ;
                
                // find a random star
                part = Math.floor( Math.random() * self.imageParts ) * self.imagePartWidth;
                // draw the star
                self.canvasSurface.drawImage( image, part, 0, self.imagePartWidth, image.height,
                                              left, top, size, size );
            }
            // done draw stars.
            
        };
        // debug 
        self.debug = function (string) {
            if (self.debugOn) {
                jsProject.debug(self.MODULE + ' ' + string);
            }
        };

        // initialize the class 
        self.construct();

        // public
        return {
            show: function( visible ) {
                self.show( visible );
            }
        };
    };
})(gameDevelopment);