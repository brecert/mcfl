# Todo

- rewrite grammar
- create a way to allow for pre-compilation variables but keeping the syntax clear
  ```
  let @x = "hello"
  tellraw "#{@x} world"
  # => tellraw @s "hello world"
  ```
- also allow for macros
  ```
  macro hi(name: string)
    tellraw "hi {{name}} #{TEN}"
  end
  
  const TEN = 10
  
  hi 'bree'
  # => tellraw "hi bree #{TEN}"
  # => tellraw @s ["hi bree ", {"score":{"name":"TEN","objective":"constant"}}]
  ```
- create a working type system
  ```
  macro say(stuff: string)
    `say {{stuff}}`
  end
  
  say 10
  # => error: stuff accepts string not number
  ```
- allow for js definitons
  ```js
  define.macro('say', {stuff: "string"}, stuff => {
    return raw`say ${stuff}`
  })
  
  // better example
  // bad practice though
  
  define.macro('clear_chat', {}, () => {
    let res = []
    for(let i = 0; i < 10; i ++) {
      res.push(`tellraw ""`)
    }
    return raw`${res.join('\n')}`
  })
  ```
- describe limitations of the language
- create solutions to limitations
- create documentation format
- write and document stdlib
