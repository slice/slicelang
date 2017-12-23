const { IDENTIFIER } = require('./regex')

module.exports = tokenizer
function tokenizer(input) {
  let current = 0
  let tokens = []

  while (current < input.length) {
    let char = input[current]

    if (char === '[' || char === ']') {
      tokens.push({ type: 'bracket', value: char })
      current++
      continue
    }

    if (char === ',') {
      tokens.push({ type: 'comma' })
      current++
      continue
    }

    if (char === ':') {
      tokens.push({ type: 'colon' })
      current++
      continue
    }

    if (char === '{' || char === '}') {
      tokens.push({ type: 'brace', value: char })
      current++
      continue
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char })
      current++
      continue
    }

    const WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    const NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = ''

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'number', value })
      continue
    }

    if (char === '"') {
      let value = ''

      // skip "
      char = input[++current]

      while (char !== '"') {
        value += char
        char = input[++current]

        if (current >= input.length) {
          throw new Error(
            'Unclosed quotation mark detected. Did you forget to close a string?'
          )
        }
      }

      // skip "
      char = input[++current]

      tokens.push({ type: 'string', value })
      continue
    }

    if (IDENTIFIER.test(char)) {
      let value = ''

      while (IDENTIFIER.test(char)) {
        value += char
        char = input[++current]
        if (!char) break // browser fix
      }

      tokens.push({ type: 'name', value })
      continue
    }

    throw new TypeError(`Unexpected "${char}".`)
  }

  return tokens
}
