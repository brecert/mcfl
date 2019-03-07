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

### Raw
```go
`execute as @a run say hi`
```

## Commands
```go
`tellraw @a "hello world!"`
```

```mcfunction
tellraw @a "hello world!"
```

## Comments
```go
# Comment
`tellraw @a "hello world!"`
```

```mcfunction
tellraw @a "hello world!"
```

## Math
```
1 + 1 # automatically simplifies to two
x + 1 # assigns to temporary variable
x = x + 1 # assigns x to temporary variable
# or
x += 1 # same result
```

## Expressions
### Equality
```
if x != y do
end

if 4 < 7 do
end

if !(x > 2) do
end

if 1 > x + 10 do
end
```

```
# test:setup
scoreboard players set #4 numb 4
scoreboard players set #7 numb 7
scoreboard players set #2 numb 2
scoreboard players set #10 numb 10

# test:main
execute unless score @s x = @s y run function test:if/1

execute if score #4 numb < #7 numb run function test:if/2

execute unless @s x > #2 numb run function test:if/3

scoreboard players operation #0 temp = @s x 
scoreboard players operation #0 temp += #10 numb
execute if #1 numb > #0 temp run function test:if/4
```

## Blocks
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

## SettingAssignment
assign a value to a variable that's used pre-compilation
```go
@namespace: test
```

## Constants
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

