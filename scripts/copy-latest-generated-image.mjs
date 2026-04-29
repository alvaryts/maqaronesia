#!/usr/bin/env node

import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { homedir } from 'node:os'

const destination = process.argv[2]

if (!destination) {
  throw new Error('Usage: node scripts/copy-latest-generated-image.mjs <destination-path>')
}

const generatedImagesDir = resolve(homedir(), '.codex/generated_images')
const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) return walk(fullPath)
      if (!allowedExtensions.has(extname(entry.name).toLowerCase())) return []

      const info = await stat(fullPath)
      return [{ path: fullPath, mtimeMs: info.mtimeMs }]
    })
  )

  return files.flat()
}

const candidates = await walk(generatedImagesDir)

if (candidates.length === 0) {
  throw new Error(`No generated images found in ${generatedImagesDir}`)
}

candidates.sort((a, b) => b.mtimeMs - a.mtimeMs)

const latest = candidates[0]
const targetPath = resolve(destination)

await mkdir(dirname(targetPath), { recursive: true })
await copyFile(latest.path, targetPath)

console.log(latest.path)
