/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the main for the application pleisterman test
* Last revision: 26-08-2014
* 
* NOTICE OF LICENSE
*
* All of the material on this site is protected by copyright 
* only code that is explicitly made available for copying may be 
* copied without permission. 
* 
* Where code is made available to be copied all of the conditions 
* within the existing or modified code as well as the conditions on the page 
* where you found it must be observed when you use the code on your site.
* 
*/

( function( gameDevelopment ){
    gameDevelopment.main = function( ) {


    /*
     *  module main 
     *  purpose:
     *   this module controls main for the gameDevelopment.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'main';
        self.debugOn = true;
        self.values = null;
        self.test = null;
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            // create the global values for the game
            self.values = new gameDevelopment.valuesModule();

            $('#jsProjectDebugDiv').css('left', '40px');
            $('#jsProjectDebugDiv').css('top', '510px');

            self.test = new gameDevelopment.test();
            self.test.show();
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