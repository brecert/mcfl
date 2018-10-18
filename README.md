# CMD

Made for making datapacks easier.

example

```
namespace: click

def on_click do
  `say on click`
end

do as @a
  if clicked >= 1 do
    on_click()
  end
  
  clicked = 0
end
```

```
config assignment
	name ':' value

definition
	'def' name block

block
	'do' ('as' value)? statements* 'end'

conditional
	'if' value cond value block

assignment
	value '=' value

cond
	('>' | '<')? ('='? '='?)

value
	RawLiteral
	RawNumber
	RawVariable

```