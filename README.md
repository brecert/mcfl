# MCFL

Made for making datapacks easier.

### raw literal
contains commands or other non-implemented features
```
`say hello world`
```

### blocks
```
do
	`command`
end

do as `@a`
	`command`
end
```

a working example
```go
namespace: click

def hello do
  `say hello world`
end

do as `@a`
  hello()
  run hello

  print(hello)
  `say hi`
  `say h2`
end
```

a non working theoretical example
```go
namespace: click

macro print(values: raw) do
	`tellraw @s "#{values}"`
end

def on_click do
	print(hello world)
end

do as @a
  if clicked >= 1 do
    run on_click
  end
  
  clicked = 0
end
```