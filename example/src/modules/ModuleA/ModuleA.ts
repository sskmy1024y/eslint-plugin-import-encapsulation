import { createModuleString } from 'utils'
import { ModuleB } from './ModuleB'

export class ModuleA {
  public createModuleB() {
    return new ModuleB()
  }

  public toString() {
    return createModuleString('moduleA')
  }
}
