import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import * as path from 'path'
import {getDirectoryLevel} from "../utils/getDirectoryLevel";
import { isProximityRelationship } from '../utils/isProximityRelationship'
import { safeReplace } from '../utils/safeReplace'

const pathEnforce: TSESLint.RuleModule<
  'pathEnforce',
  [
    {
      maxDepth: number,
      ignoreTopLevel: number
    },
  ]
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
    const options = context.options[0] || {}
    const maxDepth = options.maxDepth || 3
    const ignoreTopLevel = options.ignoreTopLevel || 2

    const checkImportPath: TSESLint.RuleFunction<TSESTree.ImportDeclaration> = (node) => {
      const filePath = context.getFilename()
      const sourcePath = node.source.value as string
      const importPath = path.resolve(path.dirname(filePath), sourcePath)
      const isAbsolutePath = path.isAbsolute(sourcePath)
      const outsideIgnoreTopLevel = getDirectoryLevel(sourcePath) > ignoreTopLevel + 1 // NOTE: +1 is the root directory

      // NOTE: If using a relativePath even though they are far apart, make it absolutePath.
      if (!isAbsolutePath && !isProximityRelationship(filePath, importPath, maxDepth)) {
        context.report({
          node: node.source,
          messageId: 'pathEnforce',
          fix(fixer) {
            return safeReplace(fixer, node.source, importPath)
          }
        })
      } else if (isAbsolutePath && isProximityRelationship(filePath, importPath, maxDepth) && outsideIgnoreTopLevel) {
        context.report({
          node: node.source,
          messageId: 'pathEnforce',
          fix(fixer) {
            const newImportPath = path.relative(path.dirname(filePath), importPath)
            return safeReplace(fixer, node.source, newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`)
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
      ignoreTopLevel: 2
    },
  ]
}

export default pathEnforce
