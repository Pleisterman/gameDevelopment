/*
 * Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose:      this module handles asynchronous ajax calls for the application gameDevelopment
 *               the ajax calls are not secured with tokens or encryption 
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
    gameDevelopment.ajaxModule = function( ) {


    /*
     *  module ajaxModule 
     *   
     *  functions: 
     *      private:
     *          construct               called internal
     *          post                    called through the added function post of gameDevelopment
     *          succes                  called from the post function 
     *          
     */
    
        // private
        var self = this;
        self.MODULE = 'ajaxModule';
        self.debugOn = false;
        self.nextProcesId = 0;                  // auto increment for proces id's
        self.processes = {};                    // store the process structures
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            
            // add the post function to the gameDevelopment module
            gameDevelopment.post = self.post;       
        };
        self.post = function( url, data, callback ) {
            // add proces id to data
            data['procesId'] = self.nextProcesId;
            self.debug( 'post url: ' + url );
            // create the proces structure
            var proces = {  'id'   : self.nextProcesId,
                            'url'  : url,
                            'data' : data,
                            'callback' : callback };
            // add the proces to the array
            self.processes[proces['id']] = proces;
            self.nextProcesId++;
            // make the call
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: 'json',
                success: function( result )
                {
                    self.debug( 'ajax succes' );
                    // call succes
                    self.succes( result );
                },
                error: function( jqXHR, textStatus,errorThrown )
                {
                    // handle error
                    $.each( jqXHR, function( index, value ) {
                        self.debug( 'ajax failed jqXHR:' + value );
                    } );
                    self.debug( 'ajax failed textStatus:' + textStatus );
                    self.debug( 'ajax failed errorThrown:' + errorThrown );
                    // done handle error
                }
            });
        };
        self.succes = function( result ) {
            self.debug( 'succes' );
            if( result['procesId'] === null ){
                // error
                $.each( result, function( index, value ) {
                    console.log( index + ": " + value );
                } );
                // done error
            }
            else {
                // call the callback with result
                $.each( result['result'], function( index, value ) {
                    self.debug( index + ": " + value );
                } );                
                self.processes[result['procesId']]['callback']( result['result'] );
                // remove the proces
                delete self.processes[result['procesId']];
            }
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
        };
    };
})( gameDevelopment );