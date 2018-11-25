# Spec
Most of the features are not implemented, but planned to be implemented.

## Command
```go
`tellraw @a "hello world!"`
```

```
tellraw @a "hello world!"
```

## Comment
```go
-- Comment
`command`
```

```
`command`
```

## Block
```
do as `@e`
  `statements`
end
```

```
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

```
# test:say_hello
tellraw @a "hello world!"
```

## Constant
```go
const TEN = 10
```

```
scoreboard objectives add constant dummy
scoreboard players set #TEN const 10
```

## Automatic ~~casting of~~ text components
```go
const TEN = 10
tellraw "Ten is #{TEN}"
tellraw "The player executing this is #{@s}"
```

```
tellraw @s ["ten is ",{"score":{"name":"TEN","objective":"constant"}}]
```

