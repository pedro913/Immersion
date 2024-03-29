const { createMacro } = require('babel-plugin-macros')

// function Introduction() {
//   const f = step => step;
//   return <Slide>
//       <p>
//     	This is {step}.
//       </p>
//       <p>
//         Hello!
//       </p>
//     </Slide>
// }

// function Test() {
//   return <Slide>{(step) => <>
//          <p></p>
//       </>
//   }</Slide>
// }

module.exports = createMacro(myMacro)

function myMacro({ references, state, babel }) {
  // `state` is the second argument you're passed to a visitor in a
  // normal babel plugin. `babel` is the `@babel/core` module.
  // do whatever you like to the AST paths you find in `references`.
  // open up the console to see what's logged and start playing around!

  // references.default refers to the default import (`myMacro` above)
  // references.JSXMacro refers to the named import of `JSXMacro`
  const { default: defaultImport = [] } = references

  defaultImport.forEach((referencePath) => {
    const slide = referencePath.findParent((n) => {
      return (
        n.type == 'JSXElement' && n.node.openingElement.name.name == 'Slide'
      )
    })
    // console.count(slide);
    if (!slide) {
      console.error('Found a reference to step without being in a slide!')
    }

    if (slide.fixedAlready) return

    const t = babel.types
    // {(step) => <> slide.node.children </>}
    const fn = t.JSXExpressionContainer(
      t.arrowFunctionExpression(
        [t.Identifier('step')],
        t.JSXFragment(
          t.JSXOpeningFragment(),
          t.JSXClosingFragment(),
          slide.node.children
        ),
        /* async */ false
      )
    )

    slide.node.children = [fn]
    slide.fixedAlready = true
  })
}
