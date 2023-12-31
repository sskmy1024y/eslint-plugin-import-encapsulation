import { TSESLint } from '@typescript-eslint/experimental-utils'
import rule from '../../src/rules/encapsulation'

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('espree'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

jest.mock('../../src/utils/cwd', () => ({
  cwd: () => '/project' // Project root
}))

describe("enforce absolute path", () => {

  ruleTester.run('distance-absolute', rule, {
    valid: [
      {
        code: "import foo from './foo';",
        filename: '/project/src/bar.js'
      },
      {
        code: "import foo from '../foo';",
        filename: '/project/src/sub/bar.js'
      },
      {
        code: "import foo from '../../foo';",
        filename: '/project/src/sub/sub/bar.js'
      },
      {
        code: "import foo from 'foo';",
        filename: '/project/src/bar.js'
      },
      {
        code: "import foo from 'src/foo';",
        filename: '/project/src/bar.js',
        options: [{
          ignoreTopLevel: 2
        }]
      },
      {
        code: "import foo from 'src/foo';",
        filename: '/project/src/sub/bar.js',
        options: [{
          ignoreTopLevel: 3
        }]
      },
      {
        code: "import foo from 'foo';",
        filename: '/project/src/sub/bar.js',
        options: [{
          ignoreTopLevel: 3,
          rootDir: "src"
        }]
      }
    ],

    invalid: [
      {
        code: "import foo from '../foo.js';",
        filename: '/project/src/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'src/foo.js';",
        options: [{
          maxDepth: 1
        }]
      },
      {
        code: "import foo from '../../foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'src/foo.js';",
        options: [{
          maxDepth: 2
        }]
      },
      {
        code: "import foo from '../../../foo.js';",
        filename: '/project/src/sub/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'src/foo.js';"
      },
      {
        code: "import foo from '../../foo.js';",
        filename: '/project/src/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'foo.js';",
        options: [{
          maxDepth: 2
        }]
      },
      {
        code: "import foo from '../../foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'foo.js';",
        options: [{
          maxDepth: 2,
          rootDir: "src"
        }]
      },
      {
        code: "import foo from '../../../foo.js';",
        filename: '/project/src/modules/moduleA/moduleB/moduleB.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'foo.js';",
        options: [{
          maxDepth: 2,
          rootDir: "src"
        }]
      },
      {
        code: "import foo from './sub/sub/sub/foo.js';",
        filename: '/project/src/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from 'src/sub/sub/sub/sub/foo.js';",
        options: [{
          maxDepth: 1
        }]
      },
    ]
  })

})

describe("enforce relative path", () => {
  ruleTester.run('proximity-relative', rule, {
    valid: [
      {
        code: "import foo from './foo';",
        filename: '/project/src/bar.js'
      },
      {
        code: "import foo from '../foo';",
        filename: '/project/src/sub/bar.js'
      },
      {
        code: "import foo from '../../foo';",
        filename: '/project/src/sub/sub/bar.js'
      },
      {
        code: "import foo from 'foo';",
        filename: '/project/src/sub/sub/bar.js'
      },
      {
        code: "import foo from 'foo';",
        filename: '/project/src/sub/sub/bar.js',
        options: [{
          rootDir: "src"
        }]
      },
    ],

    invalid: [
      {
        code: "import foo from 'src/sub/sub/foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from './foo.js';"
      },
      {
        code: "import foo from 'src/sub/foo.js';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from '../foo.js';"
      },
      {
        code: "import foo from 'src/foo.js';",
        filename: '/project/src/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from '../foo.js';",
        options: [{
          ignoreTopLevel: 1
        }]
      },
      {
        code: "import foo from 'src/foo.js';",
        filename: '/project/src/bar.js',
        errors: [{ messageId: 'pathEnforce' }],
        output: "import foo from './foo.js';",
        options: [{
          ignoreTopLevel: 1
        }]
      },
      {
        code: "import foo from 'sub/foo';",
        filename: '/project/src/sub/sub/bar.js',
        errors: [{messageId: 'pathEnforce'}],
        output: "import foo from '../foo';",
        options: [{
          ignoreTopLevel: 1,
          rootDir: "src"
        }]
      },
    ]
  })

})


ruleTester.run('ignore node_modules', rule, {
  valid: [
    {
      code: "import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'",
      filename: '/project/src/sub/bar.js',
      options: [{
        maxDepth: 1,
        ignoreTopLevel: 1
      }]
    },
    {
      code: "import { RuleModule } from '@typescript-eslint/utils/dist/ts-eslint'",
      filename: '/project/src/sub/bar.js',
      options: [{
        maxDepth: 1
      }]
    },
  ],
  invalid: []
})
