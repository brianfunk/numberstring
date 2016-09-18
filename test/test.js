/*

 /11   /11                         /11                            /111111   /11               /11                    
| 111 | 11                        | 11                           /11__  11 | 11              |__/                    
| 1111| 11 /11   /11 /111111/1111 | 1111111   /111111   /111111 | 11  \__//111111    /111111  /11 /1111111   /111111 
| 11 11 11| 11  | 11| 11_  11_  11| 11__  11 /11__  11 /11__  11|  111111|_  11_/   /11__  11| 11| 11__  11 /11__  11
| 11  1111| 11  | 11| 11 \ 11 \ 11| 11  \ 11| 11111111| 11  \__/ \____  11 | 11    | 11  \__/| 11| 11  \ 11| 11  \ 11
| 11\  111| 11  | 11| 11 | 11 | 11| 11  | 11| 11_____/| 11       /11  \ 11 | 11 /11| 11      | 11| 11  | 11| 11  | 11
| 11 \  11|  111111/| 11 | 11 | 11| 1111111/|  1111111| 11      |  111111/ |  1111/| 11      | 11| 11  | 11|  1111111
|__/  \__/ \______/ |__/ |__/ |__/|_______/  \_______/|__/       \______/   \___/  |__/      |__/|__/  |__/ \____  11
                                                                                                            /11  \ 11
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


