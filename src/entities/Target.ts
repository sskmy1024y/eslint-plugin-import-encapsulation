import path from "path";
import {cwd} from "../utils/cwd";
import { Options } from '../types/Options'
import { TSESLint } from '@typescript-eslint/experimental-utils'

type Context = Readonly<TSESLint.RuleContext<"pathEnforce", [Options]>>

export class Target {
  private readonly _context: Context
  private readonly _importSourcePath: string

  constructor(context: Context, importSourcePath: string) {
    this._context = context
    this._importSourcePath = importSourcePath
  }

  get filePath(): string {
    return this._context.getFilename()
  }

  get importSourcePath(): string {
    return this._importSourcePath
  }

  get importFilePath(): string {
    return this.isRelative ? path.resolve(path.dirname(this.filePath), this.importSourcePath) : path.resolve(this.projectRoot, this.importSourcePath)
  }

  get isRelative(): boolean {
    return this.importSourcePath.startsWith('./') || this.importSourcePath.startsWith('../')
  }

  get isOutsideTopLevel(): boolean {
    return this.importAbsolutePath.split(path.sep).length > this.ignoreTopLevel
  }

  get isProximityRelationship(): boolean {
    const depth = path.relative(path.dirname(this.filePath), this.importFilePath).split(path.sep).length
    return depth <= this.maxDepth
  }

  get importAbsolutePath(): string {
    console.log("absolute", this.projectRoot, this.importFilePath, path.relative(this.projectRoot, this.importFilePath))
    return path.relative(this.projectRoot, this.importFilePath)
  }

  get importRelativePath(): string {
    const relativePath = path.relative(path.dirname(this.filePath), this.importFilePath)
    return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
  }

  get isNodeModule(): boolean {
    try {
      const modulePath = require.resolve(this._importSourcePath)
      return modulePath.includes(path.join('node_modules', this._importSourcePath))
    } catch {
      return false
    }
  }

  // ---------------------------------
  // private
  // ---------------------------------

  private get options(): Options {
    return this._context.options[0] || {
      maxDepth: 3,
      ignoreTopLevel: 2,
      rootDir: '',
      prefix: ''
    }
  }

  private get rootDir(): string {
    return this.options.rootDir || ''
  }

  private get prefix(): string {
    return this.options.prefix || ''
  }

  private get ignoreTopLevel(): number {
    return this.options.ignoreTopLevel || 2
  }

  private get maxDepth(): number {
    return this.options.maxDepth || 3
  }

  private get projectRoot(): string {
    return `${cwd(this._context)}${this.rootDir !== '' ? path.sep + this.rootDir : ''}`
  }
}
