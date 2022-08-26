import { CardSprite } from '@/components/CardSprite'
import type { CardEntry } from '@/data/deck'
import cx from 'classnames'
import type { FC } from 'react'

export const IconCardList: FC<{ cards: CardEntry[] }> = ({ cards }) => {
  return (
    <div
      className={cx('bg-slate-800 grid', cards.length && 'h-24 mt-6')}
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <IconCard card={card} key={card.id} />
      ))}
    </div>
  )
}
export const IconCard: FC<{ card: CardEntry }> = ({ card }) => (
  <div className="flex flex-col w-16">
    <div className="flex flex-1 relative">
      <CardSprite card={card} centered className="scale-150 absolute left-1/2 bottom-4" />
    </div>
    <div className="text-center py-0.5 bg-slate-700">{card.count}</div>
  </div>
)
