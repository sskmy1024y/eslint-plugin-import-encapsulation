import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import {Target} from "../entities/Target";
import {Options} from "../types/options";
import { safeReplace } from '../utils/safeReplace'

const pathEnforce: TSESLint.RuleModule<
  'pathEnforce',
  [Options]
> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce import path rules',
      recommended: 'error'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          maxDepth: {
            type: 'integer',
            minimum: 1
          },
          ignoreTopLevel: {
            type: 'integer',
            minimum: 1
          },
          rootDir: {
            type: 'string',
            default: ''
          },
          prefix: {
            type: 'string',
            default: ''
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      pathEnforce: 'Use relative path for close'
    }
  },

  create(context): TSESLint.RuleListener {
    const checkImportPath: TSESLint.RuleFunction<TSESTree.ImportDeclaration> = (node) => {
      const target = new Target(context, node.source.value)

      if (target.isRelative && !target.isProximityRelationship) {
        context.report({
          node: node.source,
          messageId: 'pathEnforce',
          fix(fixer) {
            return safeReplace(fixer, node.source, target.importAbsolutePath)
          }
        })
      } else if (!target.isRelative && target.isProximityRelationship && target.isOutsideTopLevel) {
        context.report({
          node: node.source,
          messageId: 'pathEnforce',
          fix(fixer) {
            return safeReplace(fixer, node.source, target.importRelativePath)
          }
        })
      }
    }

    return {
      ImportDeclaration: checkImportPath
    }
  },
  defaultOptions: [
    {
      maxDepth: 3,
      ignoreTopLevel: 2,
      rootDir: '',
      prefix: ''
    },
  ]
}

export default pathEnforce
