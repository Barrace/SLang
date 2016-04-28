/* global SLang : true, parser, console  */

/*
   Code is property of Dr. David Furcy of University of
   Wisconsin - Oshkosh. Additions and features implemented by
   and are property of Alec J. Healy of University of 
   Wisconsin - Oshkosh.
*/

(function () {

    "use strict";

    var A = SLang.absyn;
    var E = SLang.env;
    var ppm = "byval";   

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
        throw "Wrong number of arguments given to '" + op + "'."; }
    for(var index = 0; index<numArgs; index++) {
        if ( ! (typeCheckerFunctions[index])(args[index]) ) {
            throw "The " + nth(index) + " argument of '" + op + 
                  "' has " + "the wrong type.";
        }
    }
}
function applyPrimitive(prim,args) {
    switch (prim) {
    case "+": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createNum( E.getNumValue(args[0]) + 
                            E.getNumValue(args[1]));
    case "-": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createNum( E.getNumValue(args[0]) - 
                            E.getNumValue(args[1]));
    case "*": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createNum( E.getNumValue(args[0]) * 
                            E.getNumValue(args[1]));
    case "/": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createNum( E.getNumValue(args[0]) / 
                            E.getNumValue(args[1]));
    case "%": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createNum( E.getNumValue(args[0]) % 
                            E.getNumValue(args[1]));
    case "<": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createBool( E.getNumValue(args[0]) < 
                             E.getNumValue(args[1]));
    case ">": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createBool( E.getNumValue(args[0]) > 
                             E.getNumValue(args[1]));
    case "===": 
        typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
        return E.createBool( E.getNumValue(args[0]) ===
                             E.getNumValue(args[1]));
    case "add1": 
        typeCheckPrimitiveOp(prim,args,[E.isNum]);
        return E.createNum( 1 + E.getNumValue(args[0]) );
    case "~": 
        typeCheckPrimitiveOp(prim,args,[E.isNum]);
        return E.createNum( - E.getNumValue(args[0]) );
    case "not": 
        typeCheckPrimitiveOp(prim,args,[E.isBool]);
        return E.createBool( ! E.getBoolValue(args[0]) );
    }
}
function callByValue(exp,envir) {
    var f = evalExp(A.getAppExpFn(exp),envir);
    var args = evalExps(A.getAppExpArgs(exp),envir);
    if (E.isClo(f)) {
        if (E.getCloParams(f).length !== args.length) {		
            throw new Error("Runtime error: wrong number of " +
                        "arguments in a function call (" + 
                        E.getCloParams(f).length + " expected but " +
                        args.length + " given)");
        } else {
            var values = evalExps(E.getCloBody(f),
                                  E.update(E.getCloEnv(f),
                                  E.getCloParams(f),args));
            return values[values.length-1];
        }
    } else {
        throw f + " is not a closure and thus cannot be applied.";
    }    
}

function evalExp(exp,envir) {
    var body, bindings, values;
    if (A.isIntExp(exp)) {
        return E.createNum(A.getIntExpValue(exp));
    } else if (A.isVarExp(exp)) {
        if (E.lookupReference(envir,A.getVarExpId(exp)).length == 1)
            return E.lookup(envir,A.getVarExpId(exp));
        else
            return E.lookupReference(envir,A.getVarExpId(exp));
    } else if (A.isPrintExp(exp)) {
        console.log( JSON.stringify(
                     evalExp( A.getPrintExpExp(exp), envir )));
    } else if (A.isPrint2Exp(exp)) {
        console.log( A.getPrint2ExpString(exp) +
                   ( A.getPrint2ExpExp(exp) !== null ?
                     " " + JSON.stringify( evalExp( A.getPrint2ExpExp
                     (exp), envir ) )
                     : ""));
    } else if (A.isAssignExp(exp)) {
        var v = evalExp(A.getAssignExpRHS(exp),envir);
        E.lookupReference(
        envir,A.getAssignExpVar(exp))[0] = v;
        return v;
    } else if (A.isFnExp(exp)) {
        return E.createClo(A.getFnExpParams(exp),
               A.getFnExpBody(exp),envir);
    } else if (A.isLetsExp(exp)) {
        var bindings = A.getLetsExpValue(exp)[0];
        var block = A.getLetsExpValue(exp)[1];
        var bindingVars = bindings[0];
        var bindingVals = bindings[1];
        var newEnv = envir;
        for(var i = 0; i < bindingVars.length; i++)
            newEnv = E.updateWithReferences(newEnv, [bindingVars[i]],
                                  [evalExp(bindingVals[i], newEnv)]);
        bindingVals.unshift("args");
        var myFN = A.createFnExp(bindingVars,block);
        var myAPP = A.createAppExp(myFN,bindingVals);
        return evalExp(myAPP, newEnv);
    } else if (A.isLetmrExp(exp)) {
        //TYING THE KNOT, simulating recursive let fns in applicative
        var body = A.getLetmrExpValue(exp)[2];
        var fn1 = A.getLetmrExpValue(exp)[0];
        var fn2 = A.getLetmrExpValue(exp)[1];
        var untakeable1 = A.createVarExp("UNTAKEABLE_VAR_NAME");
        var untakeable2 = A.createVarExp("UNTAKEABLE_VAR_NAME2");
        //create assign_exps using dummy function names
        body.unshift(A.createAssignExp(
                     "UNTAKEABLE_VAR_NAME",
                     A.createVarExp(fn1[1])));
        body.unshift(A.createAssignExp(
                     "UNTAKEABLE_VAR_NAME2",
                     A.createVarExp(fn2[1])));
        //replace recursive function call names to dummys
        deepReplace(fn1[2][2], "" + fn1[1], "UNTAKEABLE_VAR_NAME");
        deepReplace(fn2[2][2], "" + fn2[1], "UNTAKEABLE_VAR_NAME2");
        deepReplace(fn2[2][2], "" + fn1[1], "UNTAKEABLE_VAR_NAME");
        deepReplace(fn1[2][2], "" + fn2[1], "UNTAKEABLE_VAR_NAME2");
        //prep bindings
        var outerLetBindings = [["UNTAKEABLE_VAR_NAME",
                                 "UNTAKEABLE_VAR_NAME2"],
                                 [A.createFnExp("x",
                                 [A.createVarExp("x")]),
                                  A.createFnExp("x",
                                 [A.createVarExp("x")])]
                               ];
        var innerLetBindings = [[fn1[1], fn2[1]], [fn1[2], fn2[2]]];
        //create massive let block with both clo's
        var innerLet = A.createLetsExp(innerLetBindings, body);
        var totalLet = A.createLetsExp(outerLetBindings, [innerLet]);

        return evalExp(totalLet, envir);
    } else if (A.isForExp(exp)) {
        var body = A.getForExpValue(exp)[3];
        var e1 = A.getForExpValue(exp)[0];
        var e2 = A.getForExpValue(exp)[1];
        var e3 = A.getForExpValue(exp)[2];
        //implement for loop with while loop
        if (e1 != null && e1 != "" && e1 != []) {
            evalExp(e1, envir);
        } while ( SLang.env.getBoolValue(evalExp(e2, envir)) ) {
            evalExps(body, envir);
            if (e3 != null && e3 != "" && e3 != []) {
                evalExp(e3, envir);
            }
        }
        return undefined;
    } else if (A.isSwitchExp(exp)) {
        var v = E.getNumValue(E.lookup(envir, A.getVarExpId(
                              A.getSwitchExpValue(exp)[0])));

        var cases = A.getSwitchExpValue(exp)[1];
        var defaultCase = A.getSwitchExpValue(exp)[2];
        if (cases.indexOf(v) == -1) {
            defaultCase.map(function(e){ return evalExp(e,envir); });
            return evalExp(defaultCase[defaultCase.length-1], envir);
        } else {
            var chosenCase = cases[cases.indexOf(v)];
            chosenCase.map(function(e){ return evalExp(e,envir); });
            return evalExp(chosenCase[chosen.length-1], envir);
        }
    } else if (A.isAppExp(exp)) {
         return callByValue(exp,envir);
    } else if (A.isPrim1AppExp(exp)) {
         return applyPrimitive(A.getPrim1AppExpPrim(exp),
                        [evalExp(A.getPrim1AppExpArg(exp),envir)]);
    } else if (A.isPrim2AppExp(exp)) {
         return applyPrimitive(A.getPrim2AppExpPrim(exp),
                  [evalExp(A.getPrim2AppExpArg1(exp),envir),
                   evalExp(A.getPrim2AppExpArg2(exp),envir)]);
    } else if (A.isIfExp(exp)) {
        if (E.getBoolValue(evalExp(A.getIfExpCond(exp),envir))) {
            return evalExp(A.getIfExpThen(exp),envir);
        } else {
            return evalExp(A.getIfExpElse(exp),envir);
        }
    } else {
        throw "Error: Attempting to evaluate an invalid expression";
    }
}
function evalExps(list,envir) {
    return list.map( function(e) { return evalExp(e,envir); } );
}
function myEval(p) {
    if (A.isProgram(p)) {
         return evalExp(A.getProgramExp(p),E.initEnv());
    } else {
         window.alert( "The input is not a program.");
    }
}
function interpret(source,parameter_passing_mechanism) {
    var output='';
    var theParser = typeof grammar==='undefined' ? parser : grammar;
    ppm = parameter_passing_mechanism || "byval";
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

function deepReplace(list,replaceMe,withMe){    
    for(var i = 0; i < list.length; i++){
        if( Array.isArray(list[i]) ){
            deepReplace(list[i],replaceMe,withMe);
        } else {
            if(list[i] === replaceMe){
                 list[i] = withMe;
            } else {
                 continue;
            }
        }
    }
}

SLang.interpret = interpret; // make the interpreter public

}());
