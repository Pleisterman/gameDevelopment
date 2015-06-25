/*
* Author: Pleisterman
* Info: 
* Web: www.pleisterman.nl 
* Mail: info@pleisterman.nl 
* GitHub: Pleisterman 
* 
* Purpose: this file controls the introModule for the application pleisterman Guitar Slider
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
    gameDevelopment.introModule = function( ) {


    /*
     *  module introModule 
     *  purpose:
     *   this module controls introModule for the gameDevelopment.
     *   
     *  functions: 
 *  events: 
 */
    
        // private
        var self = this;
        self.MODULE = 'introModule';
        self.debugOn = true;
        self.translationIds = [ "introTitle", "introText" ];
        
        // functions
        self.construct = function() {
            self.debug( 'construct' );
            self.addHtml();
            jsProject.subscribeToEvent( 'languageChange', self.translate );
        };
        self.addHtml = function() {
            self.debug( 'addHtml' );
            var html = '';
                html += '<div id="introHtml">';
                    html += '<div class="introTitle">';
                        html += '<span id="introTitle"></span>';
                    html += '</div>';    
                    html += '<div class="introText">';
                        html += '<div class="introTextLine">';
                            html += '<span id="introText" ></span>';
                        html += '</div>';    
                    html += '</div>';    
                html += '</div>';    
            
            $('#content').html( html );
            
        };
        self.translate = function(){
            self.debug( 'translate' );
            gameDevelopment.translate( 'intro', self.translationIds, self.translateCallback );
        };
        self.translateCallback = function( result ){
            self.debug( 'translateCallback' );
            $.each( result, function( index, value ) {
                $('#' + index ).html( value );
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
        };
    };
})( gameDevelopment );