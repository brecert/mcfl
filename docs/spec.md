# Spec
Most of the features are not implemented, but planned to be implemented.

## How the transpiler works
Each value holds a reference to a minecraft value
```
x = (1 + 1) + x
```
would compile to
```
# test:setup
scoreboard players set #1 int 1

# test:main
scoreboard players operation #0 temp = #1 int
scoreboard players operation #0 temp += #1 int

scoreboard players operation #0 temp = #0 temp
scoreboard players operation #0 temp += @s x

scoreboard players operation @s x = #0 temp
```

the data for that would be seen similar to the following psuedocode

```js
parser.on('op', (l, op, r) => {

  let left = l.ref
  let right = r.ref
  let temp = std.temp.ref

  // returns the temp ref because that's what was being manipulated
  // std.op generates and adds the code to the io
  let eqref = std.op('=', temp, r.ref)

  return std.op(op.value, eqref, r.ref)
})

parser.on('eq', (l, eq, r) => {
  return std.op(eq.value, l.ref, r.ref)
})

// with this in mind
// 1 + 1 => temp
// temp + x => temp
// x = temp
```

Every primitive is composed of or creates a ref (reference),
A ref is data about the code containing the scope, variable name, function name, etc...

every operation should be operating based on refs and not much else

the int `1` is a ref to the scoreboard player and objective `#1 int` which would hold the value `1`

in code you may want to store references for manipulation or other reasons

while everything may be a ref, you can't manipulate or store the ref yourself

to do this references can be stored in reference pointers `@name`

references are static and cannot be manipulated once created

idk why references are useful, they feel important and needed though, internally atleast
```
@x = 1
# @x = @x + 1 # => err already defined
@y = @x + 1

@iz = @y > @x

if @iz do end
```

```
# main
function ref/0_x
function ref/0_y
function ref0_iz
execute if #3 temp matches 1 run function if/0 

# ref/0_x
scoreboard players operate #0 temp = #1 int

# ref/0_y
scoreboard players operate #1 temp = #0 temp
scoreboard players operate #1 temp += #1 int

# ref/0_iz
scoreboard players set #2 temp 0
execute if #1 temp > #0 temp run scoreboard players set #3 temp 1

# if/0
```

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

```
# test:setup
scoreboard players set #1 numb 1

# test:main
scoreboard players operation #0 temp = #1 numb
scoreboard players operation #0 temp += #1 numb

scoreboard players operation #0 temp = @s x
scoreboard players operation #0 temp += #1 numb

scoreboard players operation #0 temp = @s x
scoreboard players operation #0 temp += #1 numb
scoreboard players operation @s x = #0 temp

scoreboard players operation @s x += #1 numb
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

@iz = 1 > 2
if is do 
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

execute test:ref/iz
execute if #0 temp matches 1 run function test:if/5

# test:ref/iz
# result is bool, 0 or 1
scoreboard players set #1 temp 0
execute if #1 numb > #2 numb run scoreboard players set #1 temp 1
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

