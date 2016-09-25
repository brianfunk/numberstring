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

var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var illions = ['', 'thousand', 'million', 'billion', 'trillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion'];

//*******************************************************************

var group = function(n) {

	return (Math.ceil(n.toString().length / 3) - 1);	
};

/*
var illion = function(n) {	
	return illions[group(n)];
}
*/

var power = function(n,g) {	
	// g = group
	return Math.pow(10,(g*3));
};

var segment = function(n,g) {	
	// g = group
	return (n % (power(n,g+1)));
};

var hundment = function(n,g) {
	// g = group
	return Math.floor( segment(n,g) / power(n,g) );
};

var tenment = function(n,g) {	
	// g = group
	return (hundment(n,g) % 100);
};

var hundred = function(n) {
	
	if ((n < 100) || (n > 1000)) {
		return '';
	}
	else {
		return (ones[Math.floor(n / 100)] + ' hundred ');	
	}
};

var ten = function(n) {
	
	if (n === 0) {
		return '';
	}
	else if ((n < 10) && (n >= 0)) {
		return (ones[n] + ' ');
	}
	else if ((n < 20) && (n >= 10)) {
		return (teens[n - 10] + ' ');	
	}
	else {
		
		if (ones[n % 10]) {
			return (tens[Math.floor(n / 10)] + '-' + ones[n % 10] + ' ');	
		}
		else {
			return (tens[Math.floor(n / 10)] + ' ');
		}
	}
};

//*******************************************************************

var cap = function(str,c) {

	if (c === 'title') {		
		return str.replace(/\w([^-\s]*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	else if (c === 'upper') {
		return str.toUpperCase();
	}
	else if (c === 'lower') {
		return str.toLowerCase();
	}
	else{
		return str;
	}
};

var punc = function(str,p) {

	if ( p.match(/[!?.]/g) ) {
		return (str += p);
	}
	else { 
		return str;
	}	
};

//*******************************************************************

var comma = function(n) {
	
	if (isNaN(n)) {
		return false;
	}
	else {		
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}		
};

//*******************************************************************

var string = function(n, opt) {
	
	if (isNaN(n)) {
		//console.error('n isNaN : ' + n);
		return false;
	}
	else if (typeof n !== 'number') {
		//console.error('n typeof : ' + n);
		return false;
	}
	else if (n > Number.MAX_SAFE_INTEGER) {
		//console.error('n MAX_SAFE_INTEGER : ' + n);
		return false;
	}
	else {			
		
		var s = '';
		
		if (n === 0) {
			s = 'zero';
		}
		else {				
	
			for (var i=group(n); i >= 0; i-- ) {
				
				s += hundred( hundment(n,i) );
				s += ten( tenment(n,i) );
			
				if ( hundment(n,i) > 0 ) {
					s += illions[i] + ' ';
				}
			}	
		}
		
		s = s.trim();
		
		if (opt) {			
			if (opt.cap) {
				s = cap(s, opt.cap);
			}
			if (opt.punc) {
				s = punc(s, opt.punc);
			}				
		}
		
		return s;
	}
};

//*******************************************************************


//*******************************************************************

module.exports = string;
module.exports.comma = comma;
module.exports.group = group;
