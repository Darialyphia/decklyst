import { Card } from '@/components/Deckbuilder/Card'
import { cardsById } from '@/data/cards'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

//@ts-ignore
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false }) as any

export const CardTooltip = () => {
  const [renderTooltip, setRenderTooltip] = useState(false)

  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  return renderTooltip ? (
    <ReactTooltip
      id="card-tooltip"
      effect="solid"
      offset={{ top: 12, bottom: 12 }}
      getContent={(cardId: any) => <CardTooltipContent cardId={+cardId} />}
    />
  ) : null
}

const CardTooltipContent: FC<{ cardId: number }> = ({ cardId }) => {
  const card = cardsById[cardId]
  return card ? <Card card={card} className={`!border-${card.faction}`} /> : null
}
