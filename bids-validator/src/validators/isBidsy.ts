/**
 * Not sure if we want this yet. Would be to create issues for non standard
 * derivatives to have the lowest common denomenator of bids like file names.
 */
// @ts-nocheck
import { BIDSContext } from '../schema/context.ts'
import { ContextCheckFunction } from '../../types/check.ts'
import { BIDSFile } from '../types/filetree.ts'
import { Schema } from '../types/schema.ts'

export const isBidsyFilename: ContextCheckFunction = (schema, context) => {
  // every '.', '-', '_' followed by an alnum
  // only contains '.', '-', '_' and alnum
}
