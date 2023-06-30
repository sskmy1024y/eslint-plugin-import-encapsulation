import { TSESLint } from '@typescript-eslint/experimental-utils'
import rule from '../../src/rules/path-enforce'

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('espree'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

describe("enforce absolute path", () => {

  ruleTester.run('distance-absolute', rule, {
    valid: [
      {
        code: "import foo from './foo.js';",
        filename: '/project/src/bar.js'
      },
      {
        code: "import foo from '../foo.js';",
        filename: '/project/src/sub/bar.js'
      },
      {
        code: "import foo from '../../foo.js';",
        filename: '/project/src/sub/sub/bar.js'
      },
      {
        code: "import foo from '/project/foo.js';",
        filename: '/project/src/bar.js'
      }
    ],

    invalid: [
      {
        code: "import foo from '../../../foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from '/project/foo.js';"
      },
      {
        code: "import foo from '../../../../foo.js';",
        filename: '/project/src/sub/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from '/project/foo.js';"
      }
    ]
  })

})

describe("enforce relative path", () => {
  ruleTester.run('proximity-relative', rule, {
    valid: [
      {
        code: "import foo from './foo.js';",
        filename: '/project/src/bar.js'
      },
      {
        code: "import foo from '../foo.js';",
        filename: '/project/src/sub/bar.js'
      },
      {
        code: "import foo from '../../foo.js';",
        filename: '/project/src/sub/sub/bar.js'
      },
      {
        code: "import foo from '/foo.js';",
        filename: '/project/src/sub/sub/bar.js'
      }
    ],

    invalid: [
      {
        code: "import foo from '/project/src/sub/sub/foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from './foo.js';"
      },
      {
        code: "import foo from '/project/src/sub/foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from '../foo.js';"
      },
      {
        code: "import foo from '/project/src/foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from '../../foo.js';"
      }
    ]
  })

})
