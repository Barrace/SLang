/* 
   global SLang : true, parser 
*/

/*
   Code is property of Dr. David Furcy of University of
   Wisconsin - Oshkosh. Additions and features implemented by
   and are property of Alec J. Healy of University of 
   Wisconsin - Oshkosh.
*/

(function () {

"use strict";

function nth(n) {
    switch (n+1) {
    case 1: return "first";
    case 2: return "second";
    case 3: return "third";
    default: return (n+1) + "th";
    }
}
function typeCheckPrimitiveOp(op,args,typeCheckerFunctions) {
    var numArgs = typeCheckerFunctions.length;
    if (args.length !== numArgs) {
        throw "Wrong number of arguments given to '" + op + "'.";
    }
    for( var index = 0; index<numArgs; index++) {
       if ( ! (typeCheckerFunctions[index])(args[index]) ) {
           throw "The " + nth(index) + " argument of '" + op + 
           "' has the wrong type.";
       }
    }
}
    //Modifications start here
function applyFilter(fnP, fnB, env, list) {

    /* AJ's Non-fp.filter() version
    var myFN = SLang.absyn.createFnExp(fnP, fnB);
    var returnList = [];
    var listLen = list.length;
    for (var i=0; i<listLen; i++) {
        var item = list.shift();
        var itemWithTag = ["args", SLang.absyn.createIntExp(item)];
        var myAPP = SLang.absyn.createAppExp(myFN, itemWithTag);
        if ( SLang.env.getBoolValue(evalExp(myAPP, env)) ) {
            returnList.push(item);
        }
    }
    return returnList;
    */

    var myFN = function (arg) {
        var tempFN = SLang.absyn.createFnExp(fnP, fnB);
        var itemWithTag = ["args", SLang.absyn.createIntExp(arg)];
        var myAPP = SLang.absyn.createAppExp(tempFN, itemWithTag);
        return SLang.env.getBoolValue(evalExp(myAPP, env));
    }
    return fp.filter(myFN, list);
}
    //
    
function applyPrimitive(prim,args) {
    switch (prim) {
    case "+":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createNum( SLang.env.getNumValue(args[0]) +
                                    SLang.env.getNumValue(args[1]));
    case "*":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isNum,
                                        SLang.env.isNum]);
        return SLang.env.createNum( SLang.env.getNumValue(args[0]) *
                                    SLang.env.getNumValue(args[1]));
    case "add1":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isNum]);
        return SLang.env.createNum( 1 +
                                    SLang.env.getNumValue(args[0]));
        //Modifications start here
    case "~":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isNum]);
        return SLang.env.createNum(0 -
                                   SLang.env.getNumValue(args[0]));
    case "not":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isBool]);
        return SLang.env.createBool(
                                  !SLang.env.getBoolValue(args[0]));
    case "hd":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isList]);
        return SLang.env.createNum(fp.hd( SLang.env.getListValue(
                                          args[0])));
    case "tl":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isList]);
        return SLang.env.createList(fp.tl(
                                   SLang.env.getListValue(args[0])));
    case "isNull":
        typeCheckPrimitiveOp(prim,args,[SLang.env.isList]);
        return SLang.env.createBool(
                         fp.isNull(SLang.env.getListValue(args[0])));
    case "::":
        typeCheckPrimitiveOp(prim,args,
                                [SLang.env.isNum,SLang.env.isList]);
        SLang.env.getListValue(args[1]).
                            unshift(SLang.env.getNumValue(args[0]));
        return args[1];
    case "-":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createNum( SLang.env.getNumValue(args[0]) -
                                    SLang.env.getNumValue(args[1]));
    case "/":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createNum( SLang.env.getNumValue(args[0]) /
                                    SLang.env.getNumValue(args[1]));
    case "%":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createNum( SLang.env.getNumValue(args[0]) %
                                    SLang.env.getNumValue(args[1]));
    case "<":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createBool( SLang.env.getNumValue(args[0]) <
                                     SLang.env.getNumValue(args[1]));
    case ">":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createBool( SLang.env.getNumValue(args[0]) >
                                     SLang.env.getNumValue(args[1]));
    case "===":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isNum,SLang.env.isNum]);
        return SLang.env.createBool( SLang.env.getNumValue(args[0])
                                 === SLang.env.getNumValue(args[1]));
    case "->":
        typeCheckPrimitiveOp(prim,args,
                            [SLang.env.isClo,SLang.env.isList]);
        return SLang.env.createList( 
                        applyFilter(SLang.env.getCloParams(args[0]),
                        SLang.env.getCloBody(args[0]),
                        SLang.env.getCloEnv(args[0]),
                        SLang.env.getListValue(args[1])));
    }
    //
}
function evalExp(exp,envir) {
    if (SLang.absyn.isIntExp(exp)) {
        return SLang.env.createNum(SLang.absyn.getIntExpValue(exp));
    } else if (SLang.absyn.isVarExp(exp)) {
        return SLang.env.lookup(envir,SLang.absyn.getVarExpId(exp));
    } else if (SLang.absyn.isFnExp(exp)) {
        return SLang.env.createClo(SLang.absyn.getFnExpParams(exp),
                                   SLang.absyn.getFnExpBody(exp),
                                   envir);
    } else if (SLang.absyn.isAppExp(exp)) {
        var f = evalExp(SLang.absyn.getAppExpFn(exp),envir);
        var args = SLang.absyn.getAppExpArgs(exp).map( function(arg)
            { return evalExp(arg,envir); } );
        if (SLang.env.isClo(f)) {
            return evalExp(SLang.env.getCloBody(f),
                           SLang.env.update(SLang.env.getCloEnv(f),
                           SLang.env.getCloParams(f),args));
        } else {
            throw f + " is not a closure and thus cannot be applied.";
        }
        //Modifications start here
    } else if (SLang.absyn.isPrim1AppExp(exp)) {
        return applyPrimitive(SLang.absyn.getPrim1AppExpPrim(exp),
            SLang.absyn.getPrim1AppExpArgs(exp).map( function(arg) {
                return evalExp(arg,envir); } ));
    } else if (SLang.absyn.isPrim2AppExp(exp)) {
        return applyPrimitive(SLang.absyn.getPrim2AppExpPrim(exp),
            SLang.absyn.getPrim2AppExpArgs(exp).map(function (arg) {
                return evalExp(arg, envir); } ));
    } else if (SLang.absyn.isIfExp(exp)) {
        var i = SLang.absyn.getIfExpValue(exp)[0];
        var t = SLang.absyn.getIfExpValue(exp)[1];
        var el = SLang.absyn.getIfExpValue(exp)[2];
        var statement;
        if (SLang.absyn.isVarExp(i)) {
            i = SLang.env.lookup(envir,SLang.absyn.getVarExpId(i));
            statement = SLang.env.getBoolValue(i);
        } else  if (SLang.absyn.isPrim1AppExp(i)) {
            var iPrim = SLang.absyn.getPrim1AppExpPrim(i);
            var iArgs = SLang.absyn.getPrim1AppExpArgs(i).
                        map( function(arg) {
                            return evalExp(arg,envir); } );
            i = applyPrimitive(iPrim,iArgs);
            statement = SLang.env.getBoolValue(i);
        } else if (SLang.absyn.isPrim2AppExp(i)) {
            var iPrim = SLang.absyn.getPrim2AppExpPrim(i);
            var iArgs = SLang.absyn.getPrim2AppExpArgs(i).
                        map(function (arg) {
                            return evalExp(arg, envir); } );
            i = applyPrimitive(iPrim,iArgs);
            statement = SLang.env.getBoolValue(i);
        } else
            statement = SLang.env.getBoolValue(i);
        if (statement) {
            return evalExp(t,envir);
        } else {
            return evalExp(el,envir);
        }
    } else if ( SLang.absyn.isListExp(exp) ) {
            return SLang.env.createList( 
                   SLang.absyn.getListExpValue(exp) );
            //
    } else {
        throw "Error: Attempting to evaluate an invalid expression";
    }
}
function myEval(p) {
    if (SLang.absyn.isProgram(p)) {
        return evalExp(SLang.absyn.getProgramExp(p),
                       SLang.env.initEnv());
    } else {
        window.alert( "The input is not a program.");
    }
}
function interpret(source) {
    var theParser = typeof grammar === 'undefined'? parser : grammar;
    var output='';
    try {
        if (source === '') {
            window.alert('Nothing to interpret: you must provide ' +
                         'some input!');
        } else {
            var ast = theParser.parse(source);
            var value = myEval( ast );
            return JSON.stringify(value);
        }
    } catch (exception) {
        window.alert(exception);
        return "No output [Runtime error]";
    }
    return output;
}

SLang.interpret = interpret; // make the interpreter public

}());
