/* Author: Pleisterman
 * Info: 
 * Web: www.pleisterman.nl 
 * Mail: info@pleisterman.nl 
 * GitHub: Pleisterman 
 * 
 * Purpose: this module is the container class for the application gameDevelopment 
 *          all modules are linked to this module and can be accessed through the functions
 *          linked to this module.
 *          this module requires the implementation of the jsProject modules  
 *          
 * Last revision: 04-06-2015
 * 
 * Status:   code:              ready
 *           comments:          ready
 *           memory:            ready
 *           development:       implement autostart for games
 *                              review debugging settings
 *                              ajax module here or in jsproject
 *                              
 *           
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

( function() {
        /*
         *  module gameDevelopment
         */
        
    // create the gameDevelopment object
    window.gameDevelopment = new function(){};

    // private 
    // set the self
    var self = window.gameDevelopment;
    self.CLASSNAME = 'gameDevelopment';
    self.debugOn = true;

    // if there is no cookie with a language
    // and no browser language found
    // defaultLanguage will be used
    self.defaultLanguage = 'nl';
    self.app = null; 
    self.appName = null; 
    
    // zIndex for messageBox, debugEvents, scene
    self.jsProjectZIndex = 200; 

    self.start = function() {
        // set debug on
        jsProject.debugOn( self.debugOn );
        jsProject.initialize( "textColor" , 'black' );
        jsProject.initialize( "zIndex" , self.jsProjectZIndex );
        // create the jsProject modules
        jsProject.construct();
        
        // uses in contentmenu module to add the test button
        jsProject.addValue( "debugOn", "gameDevelopment", self.debugOn );
        // adjust the scene
        self.setScene();
        // load modules and app
        self.load();
        // all is well
        jsProject.debug( 'ok' );
    };
    self.setScene = function() {
        
        $(document.body).css('max-width', '1024px');
        $('#jsProjectScene').css('overflow', 'hidden');
        $('#jsProjectScene').css('clear', 'both');
        $(document.body).css('width', '80%');
        $('#jsProjectScene').css('position', 'relative');
        $(document.body).css('margin', '0 auto');
        $('#jsProjectDebugDiv').css('left', '40px');
        $('#jsProjectDebugDiv').css('top', '710px');
        $('#jsProjectDebugDivContent').css('height', '420px');
    };
    self.load = function() {
       self.layoutModule = new gameDevelopment.layoutModule();
       self.ajaxModule = new gameDevelopment.ajaxModule();
       self.languageModule = new gameDevelopment.languageModule( 'topMenu' );
       self.contentMenuModule = new gameDevelopment.contentMenuModule();
       self.loadApp();
       // translate text of modules
       jsProject.callEvent( 'languageChange' );
    };
    self.loadApp = function() {
        if( gameDevelopment.appName !== "" ) {
                self.appName = gameDevelopment.appName;
                self.app = new gameDevelopment.main();
        }
        else {
            self.introModule = new gameDevelopment.introModule();
        }
    };
    self.destruct = function() {
          self = null;
    };
    
    // public
    return {
        start : function() {
            self.start();
        }
    };
})();
 
