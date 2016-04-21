/* description: Grammar for SLang 1 */

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
"+"                   		      { return 'PLUS'; }
"*"                   		      { return 'TIMES'; }
"->"                              { return 'FILTER' }
"-"                   		      { return 'MINUS'; }
"/"                   		      { return 'DIVIDE'; }
"%"                   		      { return 'MOD'; }
"~"                   		      { return 'TILDA'; }
"<"                               { return 'LTHAN'; }
">"                               { return 'GRTHAN'; }
"==="                             { return 'EQUALTO'; }
"not"                             { return 'NOT'; }
"if"                              { return 'IF'; }
"then"                            { return 'THEN'; }
"else"                            { return 'ELSE'; }
"["                               { return 'LBRACKET'; }
"]"                               { return 'RBRACKET'; }
"hd"                              { return 'HEAD'; }
"tl"                              { return 'TAIL'; }
"isNull"                          { return 'ISNULL'; }
"::"                              { return 'CONS'; }
"add1"                            { return 'ADD1'; }
","                   		      { return 'COMMA'; }
"=>"                 		      { return 'THATRETURNS'; }
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
    : var_exp        { $$ = $1; }
    | intlit_exp     { $$ = $1; }
    | fn_exp         { $$ = $1; }
    | app_exp        { $$ = $1; }
    | prim1_app_exp  { $$ = $1; }
    | prim2_app_exp  { $$ = $1; }
    | if_exp         { $$ = $1; }
    | list_exp       { $$ = $1; }
    ;

var_exp
    : VAR  { $$ = SLang.absyn.createVarExp( $1 ); }
    ;

intlit_exp
    : INT  { $$ = SLang.absyn.createIntExp( $1 ); }
    ;

fn_exp
    : FN LPAREN formals RPAREN THATRETURNS exp
        { $$ = SLang.absyn.createFnExp($3,$6); }
    ;

formals
    : /* empty */  { $$ = [ ]; }
    | VAR moreformals 
        { 
            var result;
            if ($2 === [ ])
                result = [ $1 ];
            else {
                $2.unshift($1);
                result = $2;
            }
            $$ = result;
        }
    ;

moreformals
    : /* empty */  { $$ = [ ] }
    | COMMA VAR moreformals 
        { $3.unshift($2); 
          $$ = $3; }
    ;

app_exp
    : LPAREN exp args RPAREN
        { $3.unshift("args");
          $$ = SLang.absyn.createAppExp($2,$3); }
    ;

args
    : /* empty */ { $$ = [ ]; }
    | exp args
        { 
            var result;
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
    : /* empty */  { $$ = [ ]; }
    | exp more_prim_args  { $2.unshift($1);
                             $$ = $2; }
    ;

more_prim_args
    : /* empty */  { $$ = [ ] }
    | COMMA exp more_prim_args  { $3.unshift($2); 
                                  $$ = $3; }
    ;


prim1_app_exp
    : prim1_op LPAREN exp RPAREN
        { $$ = SLang.absyn.createPrim1AppExp($1,$3); }
    ;

prim1_op
    : ADD1    { $$ = $1; }
    | TILDA   { $$ = $1; }
    | NOT     { $$ = $1; }
    | HEAD    { $$ = $1; }
    | TAIL    { $$ = $1; }
    | ISNULL  { $$ = $1; }
    ;

prim2_app_exp
    : LPAREN exp prim2_op exp RPAREN
        { $$ = SLang.absyn.createPrim2AppExp($3,$2,$4); }
    ;

prim2_op
    : PLUS     { $$ = $1; }
    | TIMES    { $$ = $1; }
    | MINUS    { $$ = $1; }
    | DIVIDE   { $$ = $1; }
    | MOD      { $$ = $1; }
    | GRTHAN   { $$ = $1; }
    | LTHAN    { $$ = $1; }
    | EQUALTO  { $$ = $1; }
    | CONS     { $$ = $1; }
    | FILTER   { $$ = $1; }
    ;

if_exp
    : IF exp THEN exp ELSE exp
        { $$ = SLang.absyn.createIfExp($2,$4,$6); }
    ;

list_exp
    : LBRACKET ints RBRACKET
        { $$ = SLang.absyn.createListExp($2); }
    ;

ints
    : /* empty */    { $$ = [ ]; }
    | INT more_ints  { $2.unshift($1); $$ = $2; }
    ;

more_ints
    : /* empty */          { $$ = [ ] }
    | COMMA INT more_ints  { $3.unshift($2); $$ = $3; }
    ;

%%

