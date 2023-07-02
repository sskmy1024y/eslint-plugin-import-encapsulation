import { Linter } from 'eslint';
import encapsulation from './rules/encapsulation';

const config: Linter.Config = {
  rules: {
    encapsulation: ['warn', { maxDepth: 3, ignoreTopLevel: 2, rootDir: '', prefix: '' }]
  }
};

export default {
  config,
  rules: {
    encapsulation: encapsulation
  }
};
