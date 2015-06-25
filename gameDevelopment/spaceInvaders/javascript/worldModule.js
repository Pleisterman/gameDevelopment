/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module controls the drawing of the world for the application space invaders
 *          the world is positioned in the middle of the bottom of the screen 
 *          
 * Last revision: 17-05-2015
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

(function (gameDevelopment) {
    gameDevelopment.worldModule = function () {

        /*
         *  module worldModule 
         *  purpose:
         *   this module draws the world for the application space invaders.
         *   the world is positioned in the middle of the bottom of the screen 
         *   
         *  functions: 
         *      private:
         *          construct           called internal
         *          show                called by the public function
         *          layoutChange        called by the event subscription
         *          draw                called internal after layoutChange 
         *          debug
         *      public:
         *          show 
         *  event subscription: 
         *      layoutChange            called from gameLayoutModule
         */

        // private
        var self = this;
        self.MODULE = 'worldModule';
        self.debugOn = false;
        self.visible = false;                   // visibiltity
        self.canvasSurface = null;              // store the surface to draw on
        self.position = {  "top" :     85,      // constant percentage of background height
                           "left" :     0,      // calculated image is placed in middle of the background
                           "height" :  15,      // constant percentage of background height
                           "width" :  120 };    // constant percentage of background width, overSize allowed
        self.clearPadding = 2;                  // px of background
        self.clearRect = { "top" :      0,      // px, the rect that the image was drawn in  
                           "left" :     0,      // px
                           "height" :   0,      // px
                           "width" :    0 };    // px
        self.drawRect = {  "top":       0,      // px, the rect that the image is drawn in  
                           "left":      0,      // px
                           "height":    0,      // px
                           "width":     0 };    // px

        // functions
        self.construct = function () {
            self.debug('construct');

            // get the canvas surface to draw on
            self.canvasSurface = document.getElementById('worldDrawLayer').getContext('2d');

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
                self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  
            }
        };
        self.layoutChange = function ( ) {
            if (!self.visible) {
                return;
            }
            self.debug('layoutChange');

            // calculate the draw rect
            self.drawRect["top"] = ( $('#background').height() / 100 ) * self.position["top"];
            self.drawRect["height"] = ( $('#background').height() / 100 ) * self.position["height"];
            self.drawRect["width"] = ( $('#background').width() / 100 ) * self.position["width"];
            self.drawRect["left"] = ( $('#background').width() - self.drawRect["width"] ) / 2;
            // done calculate the draw rect

            // draw 
            self.draw();
        };
        self.draw = function () {

            // clear the clearRect
            self.canvasSurface.clearRect( self.clearRect["left"], self.clearRect["top"], self.clearRect["width"], self.clearRect["height"] );  

            // get the image
            var image = jsProject.getResource('world', 'image');
            // draw the image
            self.canvasSurface.drawImage( image, 0, 0, image.width, image.height,
                                          self.drawRect["left"], self.drawRect["top"],
                                          self.drawRect["width"], self.drawRect["height"] );

            // clearRect = drawRect
            self.clearRect["top"] = self.drawRect["top"] - self.clearPadding;
            self.clearRect["left"] = self.drawRect["left"] - self.clearPadding;
            self.clearRect["height"] = self.drawRect["height"] + ( self.clearPadding * 2 );
            self.clearRect["width"] = self.drawRect["width"] + ( self.clearPadding * 2 );
            // done clearRect = drawRect
            
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