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
