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
	
	it('should be five if 5 ', function() {
		expect( numberstring(5) ).to.equal('five');
	});
	
	it('should be fifteen if 15 ', function() {
		expect( numberstring(15) ).to.equal('fifteen');
	});
	
	it('should be fifty if 50 ', function() {
		expect( numberstring(50) ).to.equal('fifty');
	});
	
	it('should be fifty-five if 55 ', function() {
		expect( numberstring(55) ).to.equal('fifty-five');
	});
	
	it('should be five hundred if 500 ', function() {
		expect( numberstring(500) ).to.equal('five hundred');
	});
	
	it('should be five thousand if 5000 ', function() {
		expect( numberstring(5000) ).to.equal('five thousand');
	});
	
	it('should be fifty thousand if 50000 ', function() {
		expect( numberstring(50000) ).to.equal('fifty thousand');
	});
	
	it('should be five hundred thousand if 500000 ', function() {
		expect( numberstring(500000) ).to.equal('five hundred thousand');
	});
	
	it('should be five million if 5000000 ', function() {
		expect( numberstring(5000000) ).to.equal('five million');
	});
	
	it('should be five million five hundred fifty-five thousand five hundred fifty-five if 5555555 ', function() {
		expect( numberstring(5555555) ).to.equal('five million five hundred fifty-five thousand five hundred fifty-five');
	});
  
});

//*******************************************************************

describe('numberstring options', function() {	
 
	it('should use lower case capitalization option - five hundred', function() {
		expect( numberstring(500, {"cap": "lower"}) ).to.equal('five hundred');
	});
	
	it('should use upper case capitalization option - FIVE HUNDRED', function() {
		expect( numberstring(500, {"cap": "upper"}) ).to.equal('FIVE HUNDRED');
	});
	
	it('should use title case capitalization option - Five Hundred', function() {
		expect( numberstring(500, {"cap": "title"}) ).to.equal('Five Hundred');
	});
	
	it('should use title case capitalization option with hyphen - Fifty-Five', function() {
		expect( numberstring(55, {"cap": "title"}) ).to.equal('Fifty-Five');
	});
	
	it('should use exclamation punctuation option - five hundred!', function() {
		expect( numberstring(500, {"punc": "!"}) ).to.equal('five hundred!');
	});
	
	it('should use question punctuation option - five hundred?', function() {
		expect( numberstring(500, {"punc": "?"}) ).to.equal('five hundred?');
	});
	
	it('should use period punctuation option - five hundred.', function() {
		expect( numberstring(500, {"punc": "."}) ).to.equal('five hundred.');
	});
	
	it('should use both capitalization and punctuation option - Fifty-Five!', function() {
		expect( numberstring(55, {"cap": "title", "punc": "!"}) ).to.equal('Fifty-Five!');
	});
	
	it('should ignore invalid capitalization option', function() {
		expect( numberstring(500, {"cap": "topper"}) ).to.equal('five hundred');
	});
	
	it('should ignore invalid punctuation option', function() {
		expect( numberstring(500, {"punc": "&"}) ).to.equal('five hundred');
	});
  
});

//*******************************************************************

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

//*******************************************************************

