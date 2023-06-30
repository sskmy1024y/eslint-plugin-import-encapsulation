import path from "path";

/**
 * Get the directory level of the specified path.
 *
 * @param directoryPath
 */
export const getDirectoryLevel = (directoryPath: string) => {
  return path.normalize(directoryPath).split(path.sep).length;
}
