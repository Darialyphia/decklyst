import { createDeckExpanded } from '@/data/deck'
import { createContextInner } from '@/server'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') return res.status(404).json({ message: 'Not found ' })
  const { redirect, code, public: isPublic } = req.body
  if (!code) return res.status(400).json({ message: 'No code provided' })
  if (Array.isArray(code))
    return res.status(400).json({ message: 'Please only provide one deck code.' })

  const { decklyst } = await createContextInner()

  const id = nanoid(6)

  const deck = await decklyst.upsertDeck(id, createDeckExpanded(code), {
    privacy: isPublic ? 'public' : 'unlisted',
  })

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/decks/${deck.sharecode}`
  if (redirect) {
    return res.redirect(302, url)
  } else {
    return res.status(200).json({
      // @ts-expect-error bruh
      url,
    })
  }
}
