import { CardsInDeck } from '@/components/Deckbuilder/CardsInDeck'
import { DeckManaCurve } from '@/components/DeckInfograph/DeckManaCurve'
import { OneTimeButton } from '@/components/OneTimeButton'
import { useDeck } from '@/context/useDeck'
import { useDeckcode } from '@/context/useDeckcode'
import type { DeckExpanded } from '@/data/deck'
import { createDeckDiff } from '@/hooks/useDeckDiff'
import cx from 'classnames'
import { noop } from 'lodash'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { FC } from 'react'
import { Fragment, useMemo, useState } from 'react'
import { Aside } from '../Aside'
import { ChangesIcon, CopyIcon, DoneIcon, SaveIcon, TrashIcon } from '../Icons'
import { DeckbuilderAsideFilters } from './DeckbuilderAsideFilters'
import { DeckDiffDialog } from './DeckDiffDialog'
import { DeckTitleInput } from './DeckTitleInput'
import { SaveDeckDialog } from './SaveDeckDialog'

import { MAX_CARDS_PER_DECK, MIN_CARDS_PER_DECK } from '@/utils/config'
import { Tab } from '@headlessui/react'
import { DeckStats } from '../DeckDetails/DeckDetailsAside'

export const DeckbuilderAside: FC<{ baseDeck?: DeckExpanded }> = ({ baseDeck }) => {
  const deck = useDeck()
  const deckDiff = useMemo(
    () => (baseDeck ? createDeckDiff(baseDeck, deck) : null),
    [baseDeck, deck],
  )
  const [, { clear }] = useDeckcode()
  const [activeDialog, setActiveDialog] = useState<'diff' | 'save' | null>(null)
  const authenticated = useSession()?.status === 'authenticated'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(deck.deckcode!)
  }

  return (
    <>
      <Aside filters={<DeckbuilderAsideFilters />}>
        <div className="flex flex-col">
          <Tab.Group>
            <Tab.List className="grid grid-cols-2">
              {['Cards', 'Stats'].map((label, i) => (
                <Tab
                  key={i}
                  className={cx(
                    'py-2',
                    i == 0 && 'border-r border-gray-800',
                    'ui-selected:text-gray-300',
                    'ui-not-selected:bg-alt-1000/50 ui-not-selected:text-gray-400',
                  )}
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels as={Fragment}>
              <Tab.Panel className="flex flex-1 flex-col gap-y-4 overflow-hidden">
                <div className="flex gap-2 p-2">
                  <DeckTitleInput />

                  <button
                    className="flex bg-red-900 px-3 py-2 text-xl hover:bg-red-700"
                    onClick={clear}
                    aria-label="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div className="mx-auto px-2 pb-2">
                  <DeckManaCurve />
                </div>
                <div className="-mb-4 flex flex-1 overflow-y-hidden">
                  <div className="flex-1 overflow-y-scroll pl-4 pr-2">
                    <div className="mb-2 font-mono text-lg">
                      <span className={`text-${deck.faction} inline-block min-w-[1.25rem]`}>
                        {deck.spiritCost}
                      </span>
                      &nbsp;
                      <span>Spirit</span>
                    </div>
                    <CardsInDeck cardType="Minion" />
                    <CardsInDeck cardType="Spell" />
                    <CardsInDeck cardType="Artifact" />
                  </div>
                </div>
                {deckDiff && (
                  <div className="-mb-4 grid grid-cols-2 gap-2 border-t border-alt-700 bg-alt-900 px-2 py-2">
                    <div className={cx(`flex items-end justify-center gap-1 text-lg`)}>
                      <span className={`text-${deck.faction} font-mono font-semibold`}>
                        {deckDiff.changes}
                      </span>
                      <span>changes</span>
                    </div>
                    <button
                      className={cx('btn px-2 py-1')}
                      onClick={() => setActiveDialog('diff')}
                      disabled={deckDiff.changes === 0}
                    >
                      <ChangesIcon size={20} /> Show
                    </button>
                  </div>
                )}
                <div className="-mb-4 grid grid-cols-2 gap-2 border-t border-alt-700 bg-alt-900 px-2 py-2">
                  <div className={cx(`flex justify-center font-mono text-xl font-bold`)}>
                    <span className={`text-${deck.faction}`}>{deck.counts.total}</span>/
                    <span
                      className={cx({
                        'text-red-600': deck.counts.total > MAX_CARDS_PER_DECK,
                        [`text-${deck.faction}`]:
                          deck.counts.total >= MIN_CARDS_PER_DECK &&
                          deck.counts.total <= MAX_CARDS_PER_DECK,
                      })}
                    >
                      40
                    </span>
                  </div>
                  {authenticated ? (
                    <button className={cx('btn px-2 py-1')} onClick={() => setActiveDialog('save')}>
                      <SaveIcon /> Save
                    </button>
                  ) : (
                    <Link
                      href={{ pathname: '/[code]', query: { code: deck.deckcode } }}
                      prefetch={false}
                      className={cx('btn px-2 py-1')}
                    >
                      <SaveIcon /> Save
                    </Link>
                  )}
                </div>
                <div className="flex border-t border-alt-700 bg-alt-1000">
                  <OneTimeButton
                    onClick={handleCopy}
                    timeout={2500}
                    className="shrink-0 border-b-2 border-alt-600 bg-gray-900"
                  >
                    {(copied) => (
                      <>
                        {copied ? <DoneIcon /> : <CopyIcon />}
                        Copy
                      </>
                    )}
                  </OneTimeButton>
                  <input
                    className="page-header-input w-full bg-alt-1000 px-3 text-alt-200"
                    readOnly
                    value={deck.deckcode}
                    onChange={noop}
                    onFocus={(ev) => setTimeout(() => ev.target.select(), 50)}
                    aria-label="Deckcode"
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel className="flex flex-col gap-y-4 overflow-y-auto py-2">
                <DeckStats hideManaCurve />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Aside>
      {deckDiff && (
        <DeckDiffDialog
          open={activeDialog === 'diff'}
          onClose={() => setActiveDialog(null)}
          deckDiff={deckDiff}
        />
      )}
      {authenticated && (
        <SaveDeckDialog
          key={baseDeck?.deckcode}
          open={activeDialog === 'save'}
          onClose={() => setActiveDialog(null)}
          baseDeck={baseDeck}
        />
      )}
    </>
  )
}
