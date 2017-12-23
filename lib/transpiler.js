module.exports = transpiler
function transpiler(node) {
  const identifiers = {
    '\\?': '_$__q',
    '!': '_$__e',
  }

  // operator: simple compile (op lhs rhs) -> lhs op rhs
  function operator(op) {
    return ({ params }) => {
      const [lhs, rhs] = params
      if (params.length !== 2)
        throw new Error(
          `Error! I expect 2 arguments for this operator function here, but I only found ${
            params.length
          } argument(s).`
        )
      return `${transpiler(lhs)}${op}${transpiler(rhs)}`
    }
  }
  // block: optionally some pre arguments, and infinite amount of functionscalls after
  function block(numPre, formatter) {
    return function generatedBlock({ params }) {
      const preArgs = params.slice(0, numPre)
      if (params.length < numPre + 1) {
        throw new Error(
          `Error! I expected at least ${numPre +
            1} argument(s) here (${numPre} pre-arguments and 1 or more body function calls), but I only found ${
            params.length
          } argument(s).`
        )
      }
      const body = params
        .slice(numPre)
        .map(transpiler)
        .join('\n')
      return formatter(...preArgs, body)
    }
  }

  const fns = {
    def: operator('='),
    adef: operator('+='),
    sdef: operator('-='),
    defn: block(2, (name, params, body) => {
      const compiledParams = params.values.map(transpiler).join(',')
      return `function ${name.value}(${compiledParams}){\n${body}\n}\n`
    }),
    add: operator('+'),
    sub: operator('-'),
    mul: operator('*'),
    div: operator('/'),
    eq: operator('==='),
    leq: operator('=='),
    lt: operator('<'),
    gt: operator('>'),
    le: operator('<='),
    ge: operator('>='),
    ne: operator('!=='),
    lne: operator('!='),
    or: operator('||'),
    and: operator('&&'),
    mod: operator('%'),
    loop: block(0, body => `while(true){${body}}`),
    fore: block(
      2,
      (value, iterable, body) =>
        `for(let ${value.value} of ${transpiler(iterable)}){${body}}`
    ),
    while: block(
      1,
      (condition, body) => `while(${transpiler(condition)}){${body}}`
    ),
    for: block(
      3,
      (pre, cond, post, body) =>
        `for(${transpiler(pre)};${transpiler(cond)};${transpiler(
          post
        )}){${body}}`
    ),
    if: block(1, (condition, body) => `if(${transpiler(condition)}){${body}}`),
    js: ({ params: [code] }) => {
      const compiled = transpiler(code)
      return `eval(${compiled})`
    },
    ret: ({ params: [value] }) =>
      `return${value ? `${transpiler(value)} ` : ''};`,
    new: ({ params: [thing, ...constructorArgs] }) => {
      const compiledArgs = constructorArgs.map(transpiler).join(',')
      return `new ${thing.value}(${compiledArgs})`
    },
    next: () => `continue;`,
  }

  switch (node.type) {
    case 'Program':
      return node.body.map(transpiler).join('\n')
    case 'CallExpression':
      if (fns[node.name]) return fns[node.name](node)
      return `${node.name}(${node.params.map(transpiler).join(',')})`
    case 'NumberLiteral':
      return node.value
    case 'ObjectLiteral': {
      const entries = node.entries
        .map(([key, value]) => `"${key}":${transpiler(value)}`)
        .join(',')
      return `{${entries}}`
    }
    case 'ListLiteral': {
      const vals = node.values.map(transpiler).join(',')
      return `[${vals}]`
    }
    case 'Identifier': {
      let value = node.value

      // javascript-compatible identifiers
      for (const [from, to_] of Object.entries(identifiers)) {
        value = value.replace(new RegExp(from, 'g'), to_)
      }

      return value
    }
    case 'StringLiteral':
      return `"${node.value}"`
  }
}
