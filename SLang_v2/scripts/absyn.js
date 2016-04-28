/* global SLang : true */

/*
   Code is property of Dr. David Furcy of University of
   Wisconsin - Oshkosh. Additions and features implemented by
   and are property of Alec J. Healy of University of 
   Wisconsin - Oshkosh.
*/

(function (){

"use strict";

var exports = {};

function createProgram(e) {
    return ["Program", e]; 
}
function isProgram(e) { 
    return e[0] === "Program"; 
}
function getProgramExp(e) { 
    if (isProgram(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
                "The argument of getProgramExp is not a program.");
    }
}				       
function createVarExp(v) { 
    return ["VarExp", v]; 
}
function isVarExp(e) { 
    return e[0] === "VarExp"; 
}
function getVarExpId(e) { 
    if (isVarExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getVarExpId is not a VarExp.");
    }
}
function createIntExp(n) {
    return ["IntExp", parseInt(n)];
}
function isIntExp(e) { 
    return e[0] === "IntExp"; 
}
function getIntExpValue(e) { 
    if (isIntExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
                "The argument of getIntExpValue is not an IntExp.");
    }
}
function createFnExp(params,body) {
    return ["FnExp", params, body];
}
function isFnExp(e) { 
    return e[0] === "FnExp"; 
}
function getFnExpParams(e) { 
    if (isFnExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
                "The argument of getFnExpParams is not an FnExp.");
    }
}
function getFnExpBody(e) { 
    if (isFnExp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
                    "The argument of getFnExpBody is not an FnExp.");
    }
}
function createAppExp(fn,args) {
    return ["AppExp", fn, args];
}
function isAppExp(e) { 
    return e[0] === "AppExp"; 
}
function getAppExpFn(e) { 
    if (isAppExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
                "The argument of getAppExpFn is not an AppExp.");
    }
}
function getAppExpArgs(e) { 
    if (isAppExp(e)) {
        return e[2].slice(1); //eliminate the first element           (i.e., "args")
    } else {
        throw new Error("Interpreter error: "  +
                "The argument of getAppExpArgs is not an AppExp.");
    }
}
function createPrim1AppExp(prim,arg) {
    return ["PrimApp1Exp",prim,arg];
}
function isPrim1AppExp(e) { 
    return e[0] === "PrimApp1Exp"; 
}
function getPrim1AppExpPrim(e) { 
    if (isPrim1AppExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrim1AppExpPrim is not a Prim1AppExp.");
    }
}
function getPrim1AppExpArg(e) { 
    if (isPrim1AppExp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrim1AppExpArg is not a Prim1AppExp.");
    }
}
function createPrim2AppExp(prim,arg1,arg2) {
    return ["Prim2AppExp",prim,arg1,arg2];
}
function isPrim2AppExp(e) { 
    return e[0] === "Prim2AppExp"; 
}
function getPrim2AppExpPrim(e) { 
    if (isPrim2AppExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrim2AppExpPrim is not a Prim2AppExp.");
    }
}
function getPrim2AppExpArg1(e) { 
    if (isPrim2AppExp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrim2AppExpArg is not a Prim2AppExp.");
    }
}
function getPrim2AppExpArg2(e) { 
    if (isPrim2AppExp(e)) {
        return e[3];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrim2AppExpArg is not a Prim2AppExp.");
    }
}
function createPrintExp(e) {
    return ["PrintExp", e];
}
function isPrintExp(e) { 
    return e[0] === "PrintExp"; 
}
function getPrintExpExp(e) { 
    if (isPrintExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getPrintExpExp is not a PrintExp.");
    }
}
function createPrint2Exp(s,e) {
    return ["Print2Exp", s, e];
}
function isPrint2Exp(e) { 
    return e[0] === "Print2Exp"; 
}
function getPrint2ExpString(e) { 
    if (isPrint2Exp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The arg of getPrint2ExpString is not a Print2Exp.");
    }
}
function getPrint2ExpExp(e) { 
    if (isPrint2Exp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getPrint2ExpExp is not a Print2Exp.");
    }
}

function createAssignExp(v,e) {
    return ["AssignExp", v, e];
}
function isAssignExp(e) { 
    return e[0] === "AssignExp"; 
}
function getAssignExpVar(e) { 
    if (isAssignExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getAssignExpVar is not an AssignExp.");
    }
}
function getAssignExpRHS(e) { 
    if (isAssignExp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getAssignExpRHS is not an AssignExp.");
    }
}
function createBlock(list) {
    return ["Block",list];
}
function isBlock(b) { 
    return b[0] === "Block"; 
}
function getBlockList(b) { 
    if (isBlock(b)) {
        return b[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getBlockList is not a Block.");
    }
}
function createIfExp(condExp,thenExp,elseExp) {
    return ["IfExp",condExp,thenExp,elseExp];
}
function isIfExp(e) { 
    return e[0] === "IfExp"; 
}
function getIfExpCond(e) { 
    if (isIfExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getIfExpCond is not an IfExp.");
    }
}
function getIfExpThen(e) { 
    if (isIfExp(e)) {
        return e[2];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getIfExpThen is not an IfExp.");
    }
}
function getIfExpElse(e) { 
    if (isIfExp(e)) {
        return e[3];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getIfExpElse is not an IfExp.");
    }
}
function createLetsExp(b1,b2) {
    return ["LetsExp", [b1,b2]];
}
function isLetsExp(e) {
    return e[0] === "LetsExp";
}
function getLetsExpValue(e) {
    if (isLetsExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getLetsExpValue is not a LetsExp.");
    }
}
function createLetmrExp(f1,f2,b) {
    return ["LetmrExp", [f1,f2,b]];
}
function isLetmrExp(e) {
    return e[0] === "LetmrExp";
}
function getLetmrExpValue(e) {
    if (isLetmrExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getLetmrExpValue is not a LetmrExp.");
    }
}
function createForExp(e1,e2,e3,b) {
    return ["ForExp", [e1,e2,e3,b]];
}
function isForExp(e) {
    return e[0] === "ForExp";
}
function getForExpValue(e) {
    if (isForExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getForExpValue is not a ForExp.");
    }
}
function createSwitchExp(v,cases,defaultCase) {
    return ["SwitchExp", [v,cases,defaultCase]];
}
function isSwitchExp(e) {
    return e[0] === "SwitchExp";
}
function getSwitchExpValue(e) {
    if (isSwitchExp(e)) {
        return e[1];
    } else {
        throw new Error("Interpreter error: "  +
            "The argument of getSwitchExpValue is not a SwitchExp.");
    }
}

exports.createProgram = createProgram;
exports.isProgram = isProgram;
exports.getProgramExp = getProgramExp;
exports.createVarExp = createVarExp;
exports.isVarExp = isVarExp;
exports.getVarExpId = getVarExpId;
exports.createIntExp = createIntExp;
exports.isIntExp = isIntExp;
exports.getIntExpValue = getIntExpValue;
exports.createFnExp = createFnExp;
exports.isFnExp = isFnExp;
exports.getFnExpParams = getFnExpParams;
exports.getFnExpBody = getFnExpBody;
exports.createAppExp = createAppExp;
exports.isAppExp = isAppExp;
exports.getAppExpFn = getAppExpFn;
exports.getAppExpArgs = getAppExpArgs;
exports.createPrintExp = createPrintExp;
exports.isPrintExp = isPrintExp;
exports.getPrintExpExp = getPrintExpExp;
exports.createPrint2Exp = createPrint2Exp;
exports.isPrint2Exp = isPrint2Exp;
exports.getPrint2ExpExp = getPrint2ExpExp;
exports.getPrint2ExpString = getPrint2ExpString;
exports.createAssignExp = createAssignExp;
exports.isAssignExp = isAssignExp;
exports.getAssignExpVar = getAssignExpVar;
exports.getAssignExpRHS = getAssignExpRHS;
exports.createBlock = createBlock;
exports.isBlock = isBlock;
exports.getBlockList = getBlockList;
exports.createPrim1AppExp = createPrim1AppExp;
exports.createPrim2AppExp = createPrim2AppExp;
exports.isPrim1AppExp = isPrim1AppExp;
exports.isPrim2AppExp = isPrim2AppExp;
exports.getPrim1AppExpPrim = getPrim1AppExpPrim;
exports.getPrim2AppExpPrim = getPrim2AppExpPrim;
exports.getPrim1AppExpArg = getPrim1AppExpArg;
exports.getPrim2AppExpArg1 = getPrim2AppExpArg1;
exports.getPrim2AppExpArg2 = getPrim2AppExpArg2;
exports.createIfExp = createIfExp;
exports.isIfExp = isIfExp;
exports.getIfExpCond = getIfExpCond;
exports.getIfExpThen = getIfExpThen;
exports.getIfExpElse = getIfExpElse;
exports.createLetsExp = createLetsExp;
exports.isLetsExp = isLetsExp;
exports.getLetsExpValue = getLetsExpValue;
exports.createLetmrExp = createLetmrExp;
exports.isLetmrExp = isLetmrExp;
exports.getLetmrExpValue = getLetmrExpValue;
exports.createForExp = createForExp;
exports.isForExp = isForExp;
exports.getForExpValue = getForExpValue;
exports.createSwitchExp = createSwitchExp;
exports.isSwitchExp = isSwitchExp;
exports.getSwitchExpValue = getSwitchExpValue;
SLang.absyn = exports;
}());
