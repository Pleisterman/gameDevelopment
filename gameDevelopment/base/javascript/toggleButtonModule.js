/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this file controls toggle buttons for the application
 *               the toggleButtonModule will create the events: mouseenter, mouseout and click.
 *               when over the className will be appended by 'Over'
 *               when out the className will be reset
 *               when clicked the provided callback will be called with the selected value.
 *               
 * Last revision: 28-10-2014
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       ready
 *           
 * NOTICE OF LICENSE
 *
 * Copyright (C) 2014  Pleisterman
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
    gameDevelopment.toggleButtonModule = function(  buttonDivId, clickCallback ) {
        /*
        *   module button 
        *   
        *  functions: 
        *      new:                     parameters: 
        *                                   buttonDivId (html div id), 
        *                                   clickCallback: callback function         
        *            
        *      private:
        *          construct:           parameters: ( void ) return: void
        *                               called by the module for initialization of the module
        *          enable:              parameters: ( bool enable ) return: void
        *                               mouserEvents will be off when enabled is false
        *                               appends 'Disabled' to css className 
        *                               called by the public function
        *                               and from module function enableChanegEvent
        *          enter:               parameters: ( void ) return: void
        *                               called by the mouseenter event
        *                               appends 'Over' to css className 
        *          out:                 parameters: ( void ) return: void
        *                               called by the mouseout event
        *                               resets className 
        *          click:               parameters: ( void ) return: void
        *                               called by the click event
        *                               calls the provided callback 
        *          debug:               parameters: ( string string ) return: void
        *                               calls the application.debug( string ) when self.DebugOn
        *          destruct:            parameters: ( void ) return: void
        *                               remove the events
        *                               
        *  public: 
        *       enable         
        *       destruct 
        *       setValue
        *       getValue          
        *       
        */
    
        // private
        var self = this;
        self.MODULE = 'toggleButtonModule';
        self.debugOn = false;

        // store the id of the button div element
        self.buttonDivId = buttonDivId;
        // store the className of the button div element
        self.buttonClassName = null;
        // store the callback
        self.clickCallback = clickCallback;
        // store enabled mode
        self.enabled = true;
        // store the callback
        self.on = true;
        self.isOver = false;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            self.buttonClassName = $("#" + self.buttonDivId ).attr('class');

            // add the events
            $("#" + self.buttonDivId ).mouseenter( function(){ self.enter(); } );
            $("#" + self.buttonDivId ).mouseout( function(){ self.out(); } );
            $("#" + self.buttonDivId ).click( function(){ self.click(); } );
        
        };
        self.enable = function( enable ) {
            self.debug( ' enable ' + enable );
            self.enabled = enable; 
            if( self.enabled ) {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName ); 
            }
            else {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'Disabled' ); 
            }
        };
        self.enter = function( ) {
            self.isOver = true;
            if( !self.enabled ) {
                return;
            }
            self.debug( ' over');
            if( self.on ) {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OnOver' ); 
            }
            else {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OffOver' ); 
            }
        };
        self.out = function( ) {
            self.isOver = false;
            if( !self.enabled ) {
                return;
            }
            self.debug( 'out' );
            if( self.on ) {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'On' ); 
            }
            else {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'Off' ); 
            }
        };
        self.click = function( ) {
            self.on = !self.on;
            if( self.on ) {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OnOver' ); 
            }
            else {
                $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OffOver' ); 
            }
            self.clickCallback( self.on );
        };
        self.setValue = function( value ) {
            self.on = value;
            if( self.on ) {
                if( self.isOver ) {
                    $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OnOver' ); 
                }
                else {
                    $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'On' ); 
                }
            }
            else {
                if( self.isOver ) {
                    $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'OffOver' ); 
                }
                else {
                    $("#" + self.buttonDivId ).attr('class', self.buttonClassName + 'Off' ); 
                }
            }
        };
        self.debug = function( string ) {
            if( self.debugOn ) {
                jsProject.debug( self.MODULE + ': ' + string );
            }
        };
        // destruct the events
        self.destruct = function() {
            self.debug( 'destruct' );
            
            // remove the events
            $("#" + self.buttonDivId ).off();
            
        };

        // initialize the module 
        self.construct();

        // public
        return {
            enable : function( enable ) {
                self.enable( enable );
            },
            destruct : function( ) {
                self.destruct( );
            },
            setValue : function( value ) {
                self.setValue( value );
            },
            getValue : function() {
                return self.on;
            }
        };
    };
})( gameDevelopment );