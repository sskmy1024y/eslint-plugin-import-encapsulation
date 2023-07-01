import {TSESLint} from "@typescript-eslint/experimental-utils";

export const cwd = <TMessageIds extends string, TOptions extends readonly unknown[] = []>(context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>): string => {
  return context.getCwd?.() || process.cwd()
}
