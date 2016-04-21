/* global SLang : true */

(function () {

"use strict";


var samples = [

/* 0 */   "",
/* 1 */   [ "New prim. op. + infix syntax",
	    "(fn (n,p,q) => (((~(n)+20)-p) / (q % 3)) 10 2 11)",
            '["Num",4]' ],
/* 2 */   [ "Boolean ops", "(1 === ( (100 / 4) % 3))",
	    '["Bool",true]' ],
/* 3 */   [ "Boolean ops", "not( ((11 / 4) > (30 - (25 % 13))) )",
	    '["Bool",true]'],
/* 4 */   [ "If expression" , 
	    "(fn (n,p,q) => if n then (p + q) else (p * q) (6 < 1) 2 3)",
	    '["Num",6]' ],
/* 5 */   [ "If expression" , 
	    "(fn (n,p,q) => if n then (p + q) else (p * q) (6 > 1) 2 3)",
            '["Num",5]' ],
/* 6 */   [ "If expression" , 
	    "(fn (n,p,q) => if n then (p + q) else (q / 0) 1 2 3)",
            'No output [Runtime error]' ],
/* 7 */   [ "If expression" , 
	    "(fn (n,p,q) => if n then (p + q) else (q / 0) (6 > 1) 2 3)",
            '["Num",5]' ],
/* 8 */   [ "Lists", "[]", '["List",[]]' ],
/* 9 */   [ "Lists", "[1]", '["List",[1]]' ],
/* 10 */  [ "Lists", "[1,2,3,4,5]", '["List",[1,2,3,4,5]]' ],
/* 11 */  [ "Lists", "hd([1,2])", '["Num",1]' ],
/* 12 */  [ "Lists", "tl([1,2])", '["List",[2]]' ],
/* 13 */  [ "Lists", "tl([1])", '["List",[]]' ],
/* 14 */  [ "Lists", "(1 :: [])", '["List",[1]]' ],
/* 15 */  [ "Lists", "(1 :: [2,3])", '["List",[1,2,3]]' ],
/* 16 */  [ "Lists", "isNull( [] )", '["Bool",true]' ],
/* 17 */  [ "Lists", "isNull( [1,2,3] )", '["Bool",false]' ],
/* 18 */  [ "filter", "(fn(x) => (x>0) -> [ ])", '["List",[]]' ],
/* 19 */  [ "filter", "(fn(x) => (x>2) -> [1,2,3,5,6])", '["List",[3,5,6]]' ],
/* 20 */  [ "filter", "(fn(x) => (x<0) -> [1,2,3,5,6])", 
	    '["List",[]]' ],
/* 21 */  [ "filter", "(fn(x) => (x === 2) -> (1 :: (2 :: (3:: []))))", 
	    '["List",[2]]' ],
/* 22 */  [ "filter", "((fn(x) => fn (y) => (x > y) 5) -> [1,2,3,5,6])", 
	    '["List",[1,2,3]]' ],
/* 23 */  [ "filter", "(fn(x) => (x < y) -> tl([8,7,6,5,4,3,2,1]))", 
	    '["List",[5,4,3,2,1]]' ],
/* 24 */  [ "filter", "(fn (f,list) => (f -> list) fn (x) => add1(x) [1,2,3])", 
	    'No output [Runtime error]' ],
/* 25 */  [ "filter", "(fn(x) => (x === 1) -> 1)", 
	    'No output [Runtime error]' ]
];

 window.SLang.samples = samples;
})();
