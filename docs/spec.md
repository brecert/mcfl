# Spec
Most of the features are not implemented, but planned to be implemented.

## Types
### Bool
```go
true
false
```

```
1
0
```

### Text Component
```go
"&[green]hello **world**"
```

### String
```go
'hello world!'
```

### Number
```go
# int
1

# float
1.2

# int
100_000_000
```

### Command (or raw)
```go
`execute as @a run say hi`
```

### 

## Command
```go
`tellraw @a "hello world!"`
```

```mcfunction
tellraw @a "hello world!"
```

## Comment
```go
# Comment
`tellraw @a "hello world!"`
```

```mcfunction
tellraw @a "hello world!"
```

## Block
```go
do as `@e`
  `statements`
end
```

```mcfunction
# test:main
execute as @e run function test:e

# test:e
statements
```

## Variables
```go
# create scoreboard objective name as dummy
let name

# create scoreboard objective health as health
let health : `health`

# creates the scoreboard objective and assigns a default value, by default it's a dummy
let x = 3

# assigns to above
x = 1
```

```mcfunction

```

## Constant
```go
const TEN = 10
```

```mcfunction
scoreboard objectives add constant dummy
scoreboard players set #TEN const 10
```

## Definition
```go
def say_hello do
  `tellraw @a "hello world!"`
end
```

```mcfunction
# test:say_hello
tellraw @a "hello world!"
```

## Conditionals
```go
const TEN = 10
if TEN < 20 do
  tellraw "less than 20"
elif TEN <= 15 do
  tellraw "less than or equal to 15"
else do
  tellraw "20 or above"
end
```

```go
```

## Automatic ~~casting of~~ text components
```go
const TEN = 10
tellraw "Ten is #{TEN}"
tellraw "The player executing this is #{@s}"
```

```mcfunction
tellraw @s ["ten is ",{"score":{"name":"TEN","objective":"constant"}}]
tellraw @s ["The player executing this is",{"selector":"@s"}]
```

## Markup like formatting
> unimplemented
### bold
```go
tellraw "**hi**
```

```mcfunction
tellraw @s [{"text":"hi","bold":true}]
```

### color
```go
tellraw "&[blue] hello &[white] world"
```

```mcfunction
tellraw @s [{"text":"hello ","color":"blue"},{"text":"world","color":"white"}]
```

