module.exports = parser
function parser(tokens) {
  let current = 0

  function walk() {
    let token = tokens[current]

    function expect(type, msg) {
      const thisToken = tokens[current]
      if (!thisToken) {
        throw new Error(
          `Error! I expected a ${msg} here, but instead found nothing.`
        )
      } else if (thisToken.type !== type && type !== 'anything') {
        throw new Error(
          `Error! I expected a ${type} token here, but instead found a ${
            token.type
          } token.`
        )
      }
    }

    if (token.type === 'number') {
      current++
      return { type: 'NumberLiteral', value: token.value }
    }

    if (token.type === 'string') {
      current++
      return { type: 'StringLiteral', value: token.value }
    }

    if (token.type === 'bracket' && token.value === '[') {
      token = tokens[++current]
      expect('anything', 'list element')

      let node = {
        type: 'ListLiteral',
        values: [],
      }

      while (
        token.type !== 'bracket' ||
        (token.type === 'bracket' && token.value !== ']')
      ) {
        node.values.push(walk())
        expect('anything', 'list element or closing bracket')
        token = tokens[current]

        if (token.type === 'comma') {
          // skip commas in list literals
          token = tokens[++current]
        }
      }

      expect('bracket', 'closing bracket')
      current++

      return node
    }

    if (token.type === 'brace' && token.value === '{') {
      // skip {
      token = tokens[++current] // { -> key

      let node = {
        type: 'ObjectLiteral',
        entries: [],
      }

      while (
        token.type !== 'brace' ||
        (token.type === 'brace' && token.value !== '}')
      ) {
        // object key
        expect('string', 'object key')
        const key = token.value
        token = tokens[++current] // key -> colon

        // colon, next
        expect('colon', 'colon after the key')
        token = tokens[++current] // colon -> val

        expect('anything', 'object value')

        // walk a value into the entry's value
        const value = walk()

        // update current token now that we grabbed a token
        token = tokens[current]

        // add to object node
        node.entries.push([key, value])

        if (token.type === 'comma') {
          // skip this comma
          token = tokens[++current]
        }
      }

      expect('brace', 'closing brace')
      current++

      return node
    }

    if (token.type === 'paren' && token.value === '(') {
      // skip (
      token = tokens[++current]
      expect('name', 'name of the function to call')

      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      }

      // skip callee name
      token = tokens[++current]
      expect('anything', 'function argument or closing paren')

      // keep on going as long as this token isn't a right paren
      while (
        token.type !== 'paren' ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        node.params.push(walk())
        expect('anything', 'function argument or closing paren')
        token = tokens[current]
      }

      // skip )
      expect('paren', 'closing paren')
      current++

      return node
    }

    if (token.type === 'name') {
      current++
      return { type: 'Identifier', value: token.value }
    }

    throw new TypeError(
      `I found a ${token.type} here when I wasn't expecting it.`
    )
  }

  let ast = {
    type: 'Program',
    body: [],
  }

  while (current < tokens.length) {
    ast.body.push(walk())
  }

  return ast
}
