# slicelang

slicelang is a "programming language" that compiles to JavaScript. Its syntax
is similar to Lisp, but the syntaxes are only identical in that it both uses
a heavy amount of parentheses. Actual business logic uses very different syntax
than Lisp.

It is appropriate to call it "JavaScript but kinda like Lisp, and worse."

The reference compiler is written in JavaScript.

## But...why?

For fun. Do not actually use this.

### This is terrible.

:(

## Calling Functions

Nearly everything in slicelang is a function. To call functions, supply the name
of the function, then some arguments wrapped inside some parenthesis, like this:

```
(my_function_name first_argument second_argument)
```

```js
my_function_name(first_argument, second_argument)
```

## Lists (Arrays)

You can indicate lists of values (compiles to arrays) with consecutive values
surrounded by square brackets.

Commas are optional, but can be included if you prefer. The recommended choice
is to omit them unless necessary for readability.

```
[ 1 2 3 ]
```

```js
;[1, 2, 3]
```

## Objects

You can indicate objects with a string, followed by a colon, followed by a
value, all wrapped up in curly braces:

```
{ "a": 2
  "b": 3 }
```

```js
{'a':2,'b':3}
```

Like in lists, commas are optional, but can be included if you prefer. It is
recommended that object literals spanning one line with more than one key-value
pair use commas for enhanced readability, as multiple values in a row without
commas may be difficult to read, especially as you must distinguish between
keys and values in object literals.

```
{ "a": 2, "b": 3 }
```

If you don't want to use commas, try using whitespace instead:

```
{ "a": 2  "b": 3 }
```

## Defining Variables

Use the special `def` function to define variables in the global scope:

```
(def i 5)
```

```js
i = 5
```

## Function Definitions

Use the special `defn` function to define functions in the global scope:

```
(defn my_function [a b]
  (log (add a b))
)
```

```js
function my_function(a, b) {
  log(a + b)
}
```

## Function Expressions (lambdas/arrow functions)

Instead of defining functions, you can use a function as an expression, with the
special `fn` function:

```
(defn factory []
  (ret (fn []
    (log "hello")
  ))
)
```

This compiles to an ES2015 arrow function:

```js
function factory() {
  return () => {
    log('hello')
  }
}
```

### Returning Values

TODO

## Operators

slicelang is terrible and has no concept of operators whatsoever. Almost
everything is a function, including operators.

| JavaScript Operator | SL Function |   Example    | Compiled Output |
| :-----------------: | :---------: | :----------: | :-------------: |
|         `+`         |    `add`    | `(add 1 2)`  |     `1 + 2`     |
|         `-`         |    `sub`    | `(sub 1 2)`  |     `1 - 2`     |
|         `*`         |    `mul`    | `(mul 1 2)`  |     `1 * 2`     |
|         `/`         |    `div`    | `(div 1 2)`  |     `1 / 2`     |
|         `%`         |    `mod`    | `(mod 1 2)`  |     `1 % 2`     |
|        `+=`         |   `adef`    | `(adef n 2)` |    `n += 2`     |
|        `-=`         |   `sdef`    | `(sdef n 2)` |    `n -= 2`     |
|        `===`        |    `eq`     |  `(eq 1 2)`  |    `1 === 2`    |
|        `==`         |    `leq`    | `(leq 1 2)`  |    `1 == 2`     |
|        `!==`        |    `ne`     |  `(ne 1 2)`  |    `1 !== 2`    |
|        `!=`         |    `lne`    | `(lne 1 2)`  |    `1 != 2`     |
|         `<`         |    `lt`     |  `(lt 1 2)`  |     `1 < 2`     |
|         `>`         |    `gt`     |  `(gt 1 2)`  |     `1 > 2`     |
|        `<=`         |    `le`     |  `(le 1 2)`  |    `1 <= 2`     |
|        `>=`         |    `ge`     |  `(ge 1 2)`  |    `1 >= 2`     |
|       `\|\|`        |    `or`     |  `(or 1 2)`  |   `1 \|\| 2`    |
|        `&&`         |    `and`    | `(and 1 2)`  |    `1 && 2`     |

```
(add (add 1 2) 3)
```

```js
1 + 2 + 3
```

## Control Flow

In slicelang, all control flow structures are functions.

### `if`

```
(if (eq (add 1 2) 3)
  (log "1 + 2 = 3!")
  (log "Sanity check!")
)
```

```js
if (1 + 2 === 3) {
  log('1 + 2 = 3!')
  log('Sanity check!')
}
```

`else` or `else if` does not currently exist at this time in slicelang.

### `for`

```
(for (def i 0) (ne i 5) (adef i 1)
  (log (add "Hello! " i))
)
```

```js
for (i = 0; i !== 5; i += 1) {
  log('Hello! ' + i)
}
```

```
Hello! 0
Hello! 1
Hello! 2
Hello! 3
Hello! 4
```

### `for of`/`foreach`

The special `fore` function compiles down to `for (... of ...)`.

```
(def string "Hello, world!")
(fore value string
  (log (add "Character: " value))
)
```

```js
string = 'Hello, world!'
for (let value of string) {
  log('Character: ' + value)
}
```

```
Character: H
Character: e
Character: l
Character: l
Character: o
Character: ,
Character:
Character: w
Character: o
Character: r
Character: l
Character: d
Character: !
```

### `loop`

TODO

### `while`

TODO

### `continue`

TODO

## Executing inline JavaScript

TODO
