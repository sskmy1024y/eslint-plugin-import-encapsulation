<div align="center" style="margin: 24px 16px 0px;">
  <h1>eslint-plugin-import-encapsulation</h1>
</div>

<div align="center">
  <span>This plugin provides rules to enforce the best import path for encapsulation.</span>
</div>

## 📦 Installation

```bash
$ npm install --save-dev eslint-plugin-import-encapsulation
```

```bash
$ yarn add -D eslint-plugin-import-encapsulation
```

## 📔 Usage

```json
{
  ...
  "plugins": ["import-encapsulation"],


  ...
}
```

### Usecase

It helps to specify the path for directory-by-directory encapsulation using eslint-plugin-import-access, etc.  
For example, by referring to a file in the encapsulation by a relative path, it is made explicit that the referenced file is an element of the encapsulated module. It is also smart because the references will not be broken if the module is moved to a different directory.  
On the other hand, for files outside the module, we use absolute paths to make it explicit that we are calling an external file.  
In this way, encapsulation can be of high quality.

## 📖 Rules

### encapsulation

This rule checks the proximity between the import path and the current file.



If the proximity is greater than the specified value, it will be an error.

#### Options

*   `maxDepth` (default: `3`): The maximum depth of import path deps.
*   `rootDir` (default: `""`): The root directory of the project. (e.g. `src`)
*   `prefix` (default: `""`): The prefix of the import path. (e.g. `@`)
*   `ignoreTopLevel` (default: `2`): The number of the upper level hierarchy for which absolute import is allowed.

#### Example1

```json
{
  ...
  "rules": [
    "encapsulation-import/encapsulation": ["error", { "maxDepth": 3 }]
  ]
  ...
}
```

```js
// This is a file in src/foo/bar/sub/index.js

// ✅ Good
import { foo } from './foo';
import { bar } from './bar';

// ✅ Good
import { foo } from '../foo';
import { bar } from './foo/bar';

// ✅ Good
import { foo } from '../../foo';
import { bar } from './foo/bar/baz';

// ❌ Bad
import { foo } from '../../../foo';
import { bar } from './foo/bar/baz/bar';

// ❌ Bad
import { foo } from '../../../foo';
import { bar } from '../../../foo/bar';

// ❌ Bad
import { foo } from '../../../foo';
import { bar } from '../../../foo/bar/baz';

// ✅ Good
import { foo } from 'src/foo';
import { bar } from 'src/bar';

// ✅ Good
import { foo } from 'src/foo';
import { bar } from 'src/foo/bar';

// ❌ Bad
import { bar } from 'src/foo/bar/sub/bar';
import { foo } from 'src/foo/bar/sub/foo';


// ❌ Bad
import { bar } from 'src/foo/bar/sub/bar';
import { foo } from 'src/foo/bar/sub/foo/baz';

// ❌ Bad
import { bar } from 'src/foo/bar/sub/bar';
import { foo } from 'src/foo/bar/foo/baz/boo';

```

#### Example2

```json
{
  ...
  "rules": [
    "encapsulation-import/encapsulation": ["error", { "ignoreTopLevel": 1, "rootDir": "src" }]
  ]
  ...
}
```

```js
// This is a file in src/foo/bar/sub/index.js

// ✅ Good
import { foo } from 'foo';
import { bar } from 'bar';

// ❌ Bad
import { bar } from 'foo/bar';
```
