import fs from 'fs-extra'
import type { CardJSON } from 'generateCardsJson'
import fetch from 'node-fetch'
import path from 'path'

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

  const missing = json.filter(({ id }) => !blacklist.includes(id) && !uniqCardIds.includes(id))
  missing.forEach((card) => {
    // const img =
  })
  // console.log(uniqCardIds)

  // const jsonFilePath = path.join(__dirname, '../src/data/carddata.json')

  // fs.writeFileSync(jsonFilePath, JSON.stringify(cards))

  // console.log(`Wrote ${cards.length} cards to ${jsonFilePath}`)
}

main().catch(console.error)
