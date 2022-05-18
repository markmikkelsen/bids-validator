import { assertEquals } from '../deps/asserts.ts'
import { readAll, readerFromStreamReader } from '../deps/stream.ts'
import { dirname, basename, join } from '../deps/path.ts'
import { BIDSFileDeno } from './deno.ts'

// Use this file for testing file behavior
const testUrl = import.meta.url
const testPath = testUrl.slice('file://'.length)
const testDir = dirname(testPath)
const testFilename = basename(testPath)

Deno.test('Deno implementation of BIDSFile', async (t) => {
  await t.step('implements basic file properties', async () => {
    const file = new BIDSFileDeno(testDir, testFilename)
    assertEquals(join(testDir, file.path), testPath)
  })
  await t.step('implements correct file size', async () => {
    const { size } = await Deno.stat(testPath)
    const file = new BIDSFileDeno(testDir, testFilename)
    assertEquals(await file.size, size)
  })
  await t.step('can be read as ReadableStream', async () => {
    const file = new BIDSFileDeno(testDir, testFilename)
    const stream = await file.stream
    const streamReader = stream.getReader()
    const denoReader = readerFromStreamReader(streamReader)
    const fileBuffer = await readAll(denoReader)
    assertEquals(await file.size, fileBuffer.length)
  })
})
