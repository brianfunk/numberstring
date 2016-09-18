/*
                                   /##                                       /""               /""                    
                                  | ##                                      | ""              |__/                    
 /#######  /##   /## /######/#### | #######   /######   /######   /""""""" /""""""    /""""""  /"" /"""""""   /"""""" 
| ##__  ##| ##  | ##| ##_  ##_  ##| ##__  ## /##__  ## /##__  ## /""_____/|_  ""_/   /""__  ""| ""| ""__  "" /""__  ""
| ##  \ ##| ##  | ##| ## \ ## \ ##| ##  \ ##| ########| ##  \__/|  """"""   | ""    | ""  \__/| ""| ""  \ ""| ""  \ ""
| ##  | ##| ##  | ##| ## | ## | ##| ##  | ##| ##_____/| ##       \____  ""  | "" /""| ""      | ""| ""  | ""| ""  | ""
| ##  | ##|  ######/| ## | ## | ##| #######/|  #######| ##       /"""""""/  |  """"/| ""      | ""| ""  | ""|  """""""
|__/  |__/ \______/ |__/ |__/ |__/|_______/  \_______/|__/      |_______/    \___/  |__/      |__/|__/  |__/ \____  ""
                                                                                                             /""  \ ""
                                                                                                            |  """"""/
                                                                                                             \______/ 
*/

//*******************************************************************

'use strict';

//*******************************************************************

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

//*******************************************************************

var numberstring = require('../index.js');

//*******************************************************************

describe('numberstring', function() {
  
	it('should return string from a number', function() {
		expect( numberstring(1) ).to.be.a('string');
	});

	it('should not be a number', function() {
		expect( numberstring(1) ).to.not.be.a('number');
	});

	it('should be boolean if not a number', function() {
		expect( numberstring('one') ).to.be.a('boolean');
	});

	it('should be false if not a number', function() {
		expect( numberstring('one') ).to.be.false;
	});

	it('should be false if typeof not a number', function() {
		expect( numberstring(false) ).to.be.false;
	});

	it('should be smaller than maximum number', function() {
		expect( numberstring(Number.MAX_SAFE_INTEGER + 1) ).to.be.false;
	});
	
	it('should be zero if 0 ', function() {
		expect( numberstring(0) ).to.equal('zero');
	});
  
});

describe('numberstring.comma', function() {
  
	it('should return string from a number', function() {
		expect( numberstring.comma(1) ).to.be.a('string');
	});

	it('should not be a number', function() {
		expect( numberstring.comma(1) ).to.not.be.a('number');
	});

	it('should be boolean if not a number', function() {
		expect( numberstring.comma('one') ).to.be.a('boolean');
	});

	it('should be false if not a number', function() {
		expect( numberstring.comma('one') ).to.be.false;
	});
  
});


