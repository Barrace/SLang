/* description: Grammar for Slang 2 */

/*
   Code is property of Dr. David Furcy of University of
   Wisconsin - Oshkosh. Additions and features implemented by
   and are property of Alec J. Healy of University of 
   Wisconsin - Oshkosh.
*/

/* lexical grammar */
%lex

DIGIT		      [0-9]
LETTER		      [a-zA-Z]

%%

\s+                               { /* skip whitespace */ }
"fn"				              { return 'FN'; }
"("                   		      { return 'LPAREN'; }
")"                   		      { return 'RPAREN'; }
"{"                   		      { return 'LCURLY'; }
"}"                   		      { return 'RCURLY'; }
"+"                   		      { return 'PLUS'; }
"*"                   		      { return 'TIMES'; }
"/"                   		      { return 'DIV'; }
"%"                   		      { return 'REM'; }
"-"                   		      { return 'MINUS'; }
"<"                   		      { return 'LT'; }
">"                   		      { return 'GT'; }
"==="                  		      { return 'EQ'; }
"~"                   		      { return 'NEG'; }
"not"                  		      { return 'NOT'; }
"add1"                            { return 'ADD1'; }
"let"                             { return 'LET'; }
"lets"                            { return 'LETS'; }
"letmr"                           { return 'LETMR'; }
"switch"                          { return 'SWITCH'; }
"case"                            { return 'CASE'; }
"break"                           { return 'BREAK'; }
"default"                         { return 'DEFAULT'; }
"in"                              { return 'IN'; }
"end"                             { return 'END'; }
"print"                           { return 'PRINT'; }
"set"                             { return 'SET'; }
";"                   		      { return 'SEMICOLON'; }
":"                   		      { return 'COLON'; }
","                   		      { return 'COMMA'; }
"=>"                   		      { return 'THATRETURNS'; }
"if"                   		      { return 'IF'; }
"then"                   	      { return 'THEN'; }
"else"                   	      { return 'ELSE'; }
"for"                   	      { return 'FOR'; }
"="                               { return 'EQ'; }
'"'                               { return 'DQUOTE'; }
<<EOF>>               		      { return 'EOF'; }
{LETTER}({LETTER}|{DIGIT}|_)*     { return 'VAR'; }
{DIGIT}+                          { return 'INT'; }
.                     		      { return 'INVALID'; }

/lex

%start program

%% /* language grammar */

program
    : exp EOF
        { return SLang.absyn.createProgram($1); }
    ;

exp
    : var_exp       { $$ = $1; }
    | intlit_exp    { $$ = $1; }
    | fn_exp        { $$ = $1; }
    | app_exp       { $$ = $1; }    
    | prim1_app_exp { $$ = $1; }
    | prim2_app_exp { $$ = $1; }
    | if_exp        { $$ = $1; }
    | let_exp       { $$ = $1; }
    | lets_exp      { $$ = $1; }
    | letmr_exp     { $$ = $1; }
    | print_exp     { $$ = $1; }
    | print2_exp    { $$ = $1; }
    | assign_exp    { $$ = $1; }
    | for_exp       { $$ = $1; }
    | switch_exp    { $$ = $1; }
    ;

var_exp
    : VAR  { $$ = SLang.absyn.createVarExp( $1 ); }
    ;

intlit_exp
    : INT  { $$ = SLang.absyn.createIntExp( $1 ); }
    ;


print_exp
    : PRINT exp  { $$ = SLang.absyn.createPrintExp( $2 ); }
    ;

print2_exp
    : PRINT DQUOTE VAR DQUOTE optional 
            { $$ = SLang.absyn.createPrint2Exp( $3, $5 ); }
    ;

optional
    : COLON         { $$ = null; }
    | exp           { $$ = $1; }
    ;
 
assign_exp
    : SET VAR EQ exp  { $$ = SLang.absyn.createAssignExp( $2, $4 ); }
    ;

fn_binding
    : VAR EQ fn_exp  { $$ = SLang.absyn.createAssignExp( $1, $3 ); }
    ;

block
    : exp                  { $$ = [ $1 ]; }
    | exp SEMICOLON block  { $3.unshift( $1 ); $$ = $3; }
    ;

letmr_exp
    : LETMR fn_binding fn_binding IN block END
            { $$ = SLang.absyn.createLetmrExp($2, $3, $5); }
    ;

lets_exp
    : LETS bindings IN block END
            { $$ = SLang.absyn.createLetsExp($2, $4); }
    ;

let_exp
    : LET bindings IN block END
            { var args = $2[1]; args.unshift( "args" );
              var fnexp = SLang.absyn.createFnExp($2[0],$4);
              var appExp = SLang.absyn.createAppExp(fnexp,args);
              appExp.comesFromLetBlock = true;
              $$ = appExp;
            }
    ;

bindings
    : VAR EQ exp              
           { $$ = [ [ $1 ], [ $3 ] ]; }  
    | VAR EQ exp bindings
            { var vars = $4[0];  vars.unshift($1);
              var vals = $4[1];  vals.unshift($3);
              $$ = [ vars, vals ];
            }  
    ;

fn_exp
    : FN LPAREN formals RPAREN THATRETURNS exp
            { $$ = SLang.absyn.createFnExp($3,[$6]); }
    ;

formals
    : /* empty */  { $$ = [ ]; }
    | VAR moreformals 
            { var result;
              if ($2 === [ ])
                 result = [ $1 ];
              else {
                 $2.unshift($1);
              result = $2;
              } $$ = result;
            }
    ;

moreformals
    : /* empty */ { $$ = [ ] }
    | COMMA VAR moreformals 
            { $3.unshift($2); 
              $$ = $3; }
    ;

app_exp
    : LPAREN exp args RPAREN
            { $3.unshift("args");
              $$ = SLang.absyn.createAppExp($2,$3); }
    ;

prim1_app_exp
    : prim1_op LPAREN exp RPAREN
            { $$ = SLang.absyn.createPrim1AppExp($1,$3); }
    ;

prim2_app_exp
    : LPAREN exp prim2_op exp RPAREN
            { $$ = SLang.absyn.createPrim2AppExp($3,$2,$4); }
    ;

prim1_op
    :  ADD1     { $$ = $1; }
    |  NEG      { $$ = $1; }
    |  NOT      { $$ = $1; }
    ;

prim2_op
    :  PLUS     { $$ = $1; }
    |  MINUS    { $$ = $1; }
    |  TIMES    { $$ = $1; }
    |  DIV      { $$ = $1; }
    |  REM      { $$ = $1; }
    |  LT       { $$ = $1; }
    |  GT       { $$ = $1; }
    |  EQ       { $$ = $1; }
    ;

args
    : /* empty */ { $$ = [ ]; }
    | exp args
        { var result;
          if ($2 === [ ])
         result = [ $1 ];
          else {
             $2.unshift($1);
             result = $2;
          }
          $$ = result;
        }
    ;

prim_args
    :  /* empty */ { $$ = [ ]; }
    |  exp more_prim_args        { $2.unshift($1); $$ = $2; }
    ;

more_prim_args
    : /* empty */ { $$ = [ ] }
    | COMMA exp more_prim_args   { $3.unshift($2); $$ = $3; }
    ;

if_exp
    : IF exp THEN exp ELSE exp 
            { $$ = SLang.absyn.createIfExp($2,$4,$6); }
    ;

for_exp
    : FOR LPAREN opt_exp SEMICOLON exp SEMICOLON opt_exp RPAREN 
      LCURLY block RCURLY
            { $$ = SLang.absyn.createForExp($3, $5, $7, $10); }
    ;
opt_exp
    : exp            { $$ = $1; }
    | /* empty */    { $$ = [ ]; }
    ;

switch_exp
    : SWITCH LPAREN exp RPAREN LCURLY cases default_case RCURLY
            { $$ = SLang.absyn.createSwitchExp($3, $6, $7); }
    ;

cases
    : case          { $$ = $1; }
    | case cases    { $2.unshift($1); $$ = $2; }
    ;

case
    : CASE INT COLON block BREAK SEMICOLON
                    { $$ = $4; }
    ;

default_case
    : DEFAULT COLON block BREAK SEMICOLON
                    { $$ = $3; }
    ;
%%

