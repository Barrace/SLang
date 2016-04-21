# SLang
A Simple Programming Language designed and created by Dr. David Furcy and Alec J. Healy of the University of Wisconsin - Oshkosh. All property rights hold true and belong to those two individuals. Copying and/or use of this code is not permitted.

SLang is split into versions based off of the progress that is made upon it, the latest one in development has a (IN_PROGRESS) tag on it. If it has no (IN_PROGRESS) tag on it, that version is complete. You may open the version of your choice, and run interpreter.html in the browser of your choice. The top text block must be filled with valid, parsable, syntactically correct SLang code pertaining to that version. Clicking interpret will display the return value in the bottom text block. As versions progress, all of the old features are implemented in the new one. 

SYNTAX SEPERATED BY VERSION.

Capitalized words are not keywords, rather should be filled in with expressions of some kind.
Non-capitalized words and symbols are keywords/symbols that must appear as shown.

SLang_v0:

  function:
    fn (PARAMS, SEPERATED_BY_COMMA) => BODY
  function with args:
    (fn (PARAMS, SEPERATED, BY, COMMA) => BODY ARG_FOR_PARAM1 ARG_2 ARG_3 ARG_4)
    **number of parameters must match number of arguments**
  primitive operator expression:
    OPERATOR(OPERAND_1, OPERAND_2, ...)
    Valid operators:
    +
    *
    add1
  numbers
    only integers
  variables
    must not start with a digit


SLang_v1:
  all features from v0, along with..
  
  lists:
    [INT, INT, INT, ...]
  
  booleans:
    true, or false. No nulls.

  primitive operator expressions have been changed to prim1's and prim2's:
    prim1 - 
      OPERATOR(OPERAND)
      **prim1's may only take 1 operand, no more, no less**
    prim1 operator list:
      add1
      ~       //negation operator for ints
      not     //negation operator for booleans
      hd      //returns the first element of a list
      tl      //returns a list that is the input list without the first element
      isNull  //takes a list and returns true if it's empty, false if not
      
    prim2 -
      (OPERAND_1  OPERATOR  OPERAND_2)
      **prim2's may only take 2 operands, no more, no less**
      prim2 operator list:
        +
        *
        -
        /
        %     //remainder, or modulus operator
        >
        <
        ===   //checks equality
        ::    //construct function. Adds a number to the front of a list
        ->    //filter funtion. applies a true/false function to every element of a list and returns
                //the list of elements in which it returned true for.
        
  if statements:
    if BOOL_RETURNING_EXPRESSION then EXECUTE_THIS_IF_TRUE else EXECUTE_THIS_IF_FALSE 

SLang_v2(IN_PROGRESS):
  IN DEVELOPMENT, STAY UPDATED! Thank you for using SLang!
