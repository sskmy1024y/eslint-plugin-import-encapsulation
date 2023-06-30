import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'

/**
 * Safely replaces the contents of a StringLiteral node with a target string.
 *
 * @param {TSESLint.RuleFixer} fixer - A fixer object from ESLint that applies fixes to code.
 * @param {TSESTree.StringLiteral} source - The StringLiteral node to be replaced.
 * @param {string} target - The string to replace the source with.
 * @returns {TSESLint.RuleFix} Returns the fix object that can be used by ESLint to apply the replacement.
 *
 * It uses RegExp to match the initial quote (either single or double) used in the source string.
 * If a match is found, it uses the matched quote for the replacement; otherwise, it defaults to double quotes.
 * The replacement preserves the original quote style to avoid potential syntax errors.
 */
export const safeReplace = (fixer: TSESLint.RuleFixer, source: TSESTree.StringLiteral, target: string) => {
  const quoteMatch = source.raw.match(/^(['"])/) // Use RegExp to match the first single or double quote
  const originalQuote = quoteMatch ? quoteMatch[1] : '"' // If a match is found, use the matched quote; otherwise, default to double quotes
  return fixer.replaceText(source, `${originalQuote}${target}${originalQuote}`)
}
