# Spec
Most of the features are not implemented, but planned to be implemented.

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

## Constant
```go
const TEN = 10
```

```mcfunction
scoreboard objectives add constant dummy
scoreboard players set #TEN const 10
```

## Automatic ~~casting of~~ text components
```go
const TEN = 10
tellraw "Ten is #{TEN}"
tellraw "The player executing this is #{@s}"
```

```mcfunction
tellraw @s ["ten is ",{"score":{"name":"TEN","objective":"constant"}}]
```

