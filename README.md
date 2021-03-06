# SLang
A Simple Programming Language designed and created by Dr. David Furcy and Alec J. Healy of the University of Wisconsin - Oshkosh. All property rights hold true and belong to those two individuals. Copying and/or use of this code is not permitted.

SLang is split into versions based off of the progress that is made upon it, the latest one in development has a (IN_PROGRESS) tag on it. If it has no (IN_PROGRESS) tag on it, that version is complete. You may open the version of your choice, and run interpreter.html in the browser of your choice. The top text block must be filled with valid, parsable, syntactically correct SLang code pertaining to that version. Clicking interpret will display the return value in the bottom text block. As versions progress, all of the old features are implemented in the new one. 

##SYNTAX SEPERATED BY VERSION.

Capitalized words are not keywords, rather should be filled in with expressions of some kind.
Non-capitalized words and symbols are keywords/symbols that must appear as shown.

###SLang_v0:

  * function:
    * fn (PARAMS, SEPERATED_BY_COMMA) => BODY
  * function with args:
    * (fn (PARAMS, SEPERATED, BY, COMMA) => BODY ARG_FOR_PARAM1 ARG_2 ARG_3 ARG_4)
      * __number of parameters must match number of arguments__
  
  * primitive operator expression:
    * OPERATOR(OPERAND_1, OPERAND_2, ...)
    * Valid operators:
    1. +
    2. *
    3. add1
  * numbers
    * only integers
  * variables
    * must not start with a digit


###SLang_v1:
  all features from v0, along with..
  
  * lists:
    * [INT, INT, INT, ...]
  
  * booleans:
    * true, or false. No nulls.

  * primitive operator expressions have been changed to prim1's and prim2's:
    * prim1 - 
      * OPERATOR(OPERAND)
      * __prim1's may only take 1 operand, no more, no less__
    * prim1 operator list:
      1. add1
      2. ~  
        * negation operator for ints
      3. not     
        * negation operator for booleans
      4. hd      
        * returns the first element of a list
      5. tl      
        * returns a list that is the input list without the first element
      6. isNull  
        * takes a list and returns true if it's empty, false if not
    * prim2 -
      * (OPERAND_1  OPERATOR  OPERAND_2)
      * __prim2's may only take 2 operands, no more, no less__
      * prim2 operator list:
        1. +
        2. *
        3. -
        4. /
        5. %     
          * remainder, or modulus operator
        6. >
        7. <
        8. ===   
          * checks equality
        9. ::    
          * construct function. Adds a number to the front of a list
        10. ->    
          * filter funtion. applies a true/false function to every element of a list and returns the list of elements in which            it returned true for.
    * if statements:
      * if BOOL_RETURNING_EXPRESSION then EXECUTE_THIS_IF_TRUE else EXECUTE_THIS_IF_FALSE 


###SLang_v2
  all features from v1, along with..

  * let block
    * syntactic sugar for an anonymous application expression
    * let BINDINGS in BODY end
  * sequencing
    * semicolons attached to every exp in let body besides the last one
  * references
    * environment now binds vars to references to vals instead of directly to vals
  * assignment expression
    * assigning a variable name to an expression using static binding in the environment
    * set VAR = EXP
  * print expression
    * prints to the console the argument passed in
    * print(EXP)
  * lets block
    * let block, excepts evaluates the bindings in order top down, asynchronously
    * same syntax except "lets" instead of "let"
  * letmr block
    * same as lets block, except MUST take exactly 2 function expressions as bindings, and  accounts for recursion within the functions, or functions referencing eachother.
    * syntax same as let except exactly 2 fn_exps as bindings and "letmr" instead of "let"
  * for loop
    * same as java/javascript for loop syntax, the body takes sequencing syntax, along with the 1 and 3 of: for (1; 2; 3) are optional.
  * switch statement
    * same as java/javascript switch statements, except the variable that the switch depends upon must be a number.


###SLang_v3:
  
  
  SLang_v3 is an Object-Oriented version of SLang. If you are looking for a functional language, try SLang v2. For a fully functional language, try SLang_v1. SLang_v3 is imperative, it has all features of SLang_v2, in an object oriented environment.
  
  For example programs of SLang_v3, please click "show test programs" in the interpreter.html
  

###SLang_v4(IN_PROGRESS):
  IN DEVELOPMENT, STAY UPDATED! Thank you for using SLang!
