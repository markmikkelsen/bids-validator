import { BIDSFile, FileTree } from '../types/filetree.ts'
import { Context } from '../types/context.ts'
import { readEntities } from '../schema/entities.ts'

export function* walkBack(
  source: BIDSFile,
  inherit: boolean = true,
  targetExtensions: string[] = ['.json'],
  targetSuffix?: string,
): Generator<BIDSFile> {
  const sourceParts = readEntities(source.name)

  targetSuffix = targetSuffix || sourceParts.suffix

  let fileTree: FileTree | undefined = source.parent
  while (fileTree) {
    const candidates = fileTree.files.filter((file) => {
      const { suffix, extension, entities } = readEntities(file.name)
      return (
        targetExtensions.includes(extension) &&
        suffix === targetSuffix &&
        Object.keys(entities).every((entity) => entities[entity] === sourceParts.entities[entity])
      )
    })
    if (candidates.length > 1) {
      const exactMatch = candidates.find((file) => {
        const { suffix, extension, entities } = readEntities(file.name)
        return Object.keys(sourceParts.entities).every((entity) =>
          entities[entity] === sourceParts.entities[entity]
        )
      })
      if (exactMatch) {
        yield exactMatch
      } else {
        console.warn(`
Multiple candidates detected for '${source.path}'

${candidates.map((file) => `* ${file.path}`).join('\n')}
`)
      }
    } else if (candidates.length === 1) {
      yield candidates[0]
    }
    if (!inherit) break
    fileTree = fileTree.parent
  }
}
