loops
while loops are not needed/redundent because main is always looping it may be more consise/clear occasionally
```
del i
let i = 0
while i < 10 do
  tellraw "running"
end
```

```
# test:main
scoreboard objectives remove i
scoreboard objectives add i
scoreboard players set @s i 0
execute if score @s i matches ..10 run function test:while/1

# test:while/1
tellraw @s "running"
```
