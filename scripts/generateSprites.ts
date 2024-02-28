import fs from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'
import sharp from 'sharp'
import type { CardJSON } from './generateCardsJson'

const blacklist = [20452]

const trimExtension = (str: string) => str.split('.')[0]

async function main() {
  const existingCardIds = fs
    .readdirSync(path.join(__dirname, '../public/assets/sprites'))
    .map(trimExtension)
  const uniqCardIds = [...new Set(existingCardIds)].map(Number)

  const json = await fetch('https://api.duelyst2.com/cards.json').then(
    (response) => response.json() as Promise<CardJSON[]>,
  )

  const OUTPUT_PATH = path.join(__dirname, '../public/assets/sprites')
  await fs.ensureDir(OUTPUT_PATH)

  const missing = json.filter(({ id }) => !blacklist.includes(id) && !uniqCardIds.includes(id))
  console.log(missing.length)

  const result = await Promise.allSettled(
    missing.map(async (card) => {
      const res = await fetch(`https://api.duelyst2.com/${card.resource.idle}`)
      const buffer = await res.buffer()

      const outputPath = path.join(OUTPUT_PATH, `${card.id}.gif`)
      await fs.writeFile(path.join(OUTPUT_PATH, `${card.id}.gif`), buffer, 'binary')
      console.log(`GIF file for ${card.id} (${card.name}) genertated`)
      await sharp(outputPath)
        .png()
        .trim()
        .toFile(path.join(OUTPUT_PATH, `${card.id}.png`))
      console.log(`PNG file for ${card.id} (${card.name}) genertated`)
    }),
  )
  console.log(result)
  // console.log(uniqCardIds)

  // const jsonFilePath = path.join(__dirname, '../src/data/carddata.json')

  // fs.writeFileSync(jsonFilePath, JSON.stringify(cards))

  // console.log(`Wrote ${cards.length} cards to ${jsonFilePath}`)
}

main().catch(console.error)
