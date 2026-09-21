import sharp from "sharp"
import { readdir, rename, rm } from "node:fs/promises"
import path from "node:path"

// Global near-black chroma key — good for photographic flower cutouts.
async function keyOutGlobal(file, { low = 22, high = 68 } = {}) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const maxc = Math.max(data[o], data[o + 1], data[o + 2])
    let a = (maxc - low) / (high - low)
    a = a < 0 ? 0 : a > 1 ? 1 : a
    out[o + 3] = Math.round(a * (channels === 4 ? data[o + 3] : 255))
  }
  await write(out, width, height, channels, file)
}

// Flood fill the connected black background from the borders only, so that
// interior black cartoon outlines are preserved.
async function keyOutFlood(file, { thresh = 60 } = {}) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  const isDark = (idx) => {
    const o = idx * channels
    return Math.max(data[o], data[o + 1], data[o + 2]) <= thresh
  }
  const visited = new Uint8Array(width * height)
  const stack = []
  for (let x = 0; x < width; x++) {
    stack.push(x, (height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    stack.push(y * width, y * width + width - 1)
  }
  while (stack.length) {
    const idx = stack.pop()
    if (idx < 0 || idx >= width * height || visited[idx]) continue
    visited[idx] = 1
    if (!isDark(idx)) continue
    out[idx * channels + 3] = 0
    const x = idx % width
    const y = (idx - x) / width
    if (x > 0) stack.push(idx - 1)
    if (x < width - 1) stack.push(idx + 1)
    if (y > 0) stack.push(idx - width)
    if (y < height - 1) stack.push(idx + width)
  }
  await write(out, width, height, channels, file)
}

async function write(buf, width, height, channels, file) {
  const dst = file.replace(/\.(jpe?g|png)$/i, ".png")
  await sharp(buf, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 1 })
    .toFile(dst + ".tmp.png")
  await rename(dst + ".tmp.png", dst)
  if (dst !== file) await rm(file, { force: true })
  console.log("cutout ->", path.basename(dst))
}

const dir = "public/flowers"
for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  await keyOutGlobal(path.join(dir, f))
}
await keyOutFlood("public/character/man.png", { thresh: 55 })
