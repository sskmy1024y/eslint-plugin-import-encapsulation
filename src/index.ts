import { Linter } from 'eslint'
import pathEnforce from './rules/path-enforce'

const config: Linter.Config = {
  rules: {
    'path-enforce': ['warn', { maxDepth: 3, ignoreTopLevel: 2 }],
  }
}

export default {
  config,
  rules: {
    'path-enforce': pathEnforce
  }
}
