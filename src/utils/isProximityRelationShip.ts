import * as path from 'path'

/**
 * Determines if there is a proximity relationship up to a specified depth.
 *
 * @param {string} filePath - The base file path.
 * @param {string} importPath - The import path to be checked.
 * @param {number} maxDepth - The maximum depth of the path allowed.
 * @returns {boolean} Returns true if within the specified depth, false if it exceeds.
 *
 * It obtains the relative path between filePath and importPath, and measures its depth.
 * If the measured depth is equal to or less than the maximum allowed depth, it returns true, otherwise it returns false.
 */
export const isProximityRelationship = (filePath: string, importPath: string, maxDepth: number): boolean => {
  const relativePath = path.relative(filePath, importPath)
  const depth = relativePath.split(path.sep).length - 1

  return depth <= maxDepth
}
