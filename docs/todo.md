# Todo

- rewrite grammar
- create a way to allow for pre-compilation variables but keeping the syntax clear
  ```
  let @x = "hello"
  tellraw "#{@x} world"
  # => tellraw @s "hello world"
  ```
- create a working type system
- describe limitations of the language
- create solutions to limitations
