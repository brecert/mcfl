# Todo

Rewrite grammar.

```
Program
  = Call

Def
  = 'def' (methodName '.')? name Selector? Body 'end'
  | 'def' (methodName '.')? name '(' (arg (',' ListOf<arg, ','>)? ')' Selector? Body 'end'

Call
  = (obj '.')? ident '(' ')' Block?
  | (obj '.')? ident '(' arg (',' ListOf<arg, ','>)? ')' block?
  | (obj '.')? ident arg (',' arg )* block?
  | args name arg
  
  
methodName
  = (alnum | "_" | "-" | "+")+ ("?" | "!")?
  
ident
  = (alnum | "_" | "." | "-" | "+")+
```

```
MCFL {
  Program
    = Statement*
    
  withIn =
    
  Body
    = Call
    
  Statement
    = Def
    
  Def
  	= "def" (methodName ".")? methodName "do"? ("as" selector)? Body "end" -- def_without_args
    | "def" (methodName ".")? methodName "(" NonemptyListOf<ArgumentInput<withIn>, ","> ")" "do"? ("as" selector)? Body "end" -- def_with_args
    
  Call
    = (methodName ".")? methodName "(" ")" -- call_without_args
    | (methodName ".")? methodName "(" NonemptyListOf<ArgumentInput<withIn>, ","> ")" -- call_with_args
    | (methodName ".")? methodName NonemptyListOf<ArgumentInput<withIn>, ","> -- call_without_closure
    
  ArgumentInput<guardIn>
    = name
    
  methodName
    = (alnum | "_")+ ("?" | "!")?
    
  callArg (an argument)
    = name
    
  defArg (an argument)
    = name ": " name -- typed_arg
    | name -- arg
    
  defArgName
    = name

  selector (a selector)
    = "@" alnum+ -- quick_selector
    | string -- string_selector

  string (a string)
    = "\"" (~"\"" any)+ "\""
    
  name
    = (alnum | "_")+

  ident (an identifier)
    = (alnum | "_" | ".")+

  number  (a number)
    = digit* "." digit+  -- fract
    | digit+             -- whole
}
```
