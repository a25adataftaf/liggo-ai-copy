import { useState } from 'react'
import {
  pickStoryIdeas,
  STORY_KIND_LABEL,
  type StoryIdea,
} from '../../shared/storyIdeas'
import { BulbIcon, CheckIcon, CopyIcon, ShuffleIcon } from './Icons'

interface StoryIdeasProps {
  onCopy: (text: string) => void
}

export function StoryIdeas({ onCopy }: StoryIdeasProps) {
  const [seed, setSeed] = useState(() => Date.now())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const ideas = pickStoryIdeas(seed, 3)

  const copy = (idea: StoryIdea) => {
    onCopy(`${idea.caption} — ${idea.sticker}`)
    setCopiedId(idea.id)
    window.setTimeout(() => setCopiedId((current) => (current === idea.id ? null : current)), 1800)
  }

  return (
    <section className="card story-ideas" aria-labelledby="story-ideas-title">
      <header className="card__head">
        <span className="card__icon card__icon--pink" aria-hidden="true">
          <BulbIcon size={16} />
        </span>
        <div>
          <h2 id="story-ideas-title">Ideas para tu story</h2>
          <p>Sube algo tú y dale al otro una excusa para escribirte</p>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => {
            setSeed(Date.now())
            setCopiedId(null)
          }}
        >
          <ShuffleIcon size={13} />
          Otras
        </button>
      </header>

      <ul className="idea-list">
        {ideas.map((idea) => (
          <li className="idea" key={idea.id}>
            <div className="idea__top">
              <span className={`idea__kind idea__kind--${idea.kind}`}>{STORY_KIND_LABEL[idea.kind]}</span>
              <span className="idea__title">{idea.title}</span>
              <button
                type="button"
                className={`copy-btn copy-btn--ghost${copiedId === idea.id ? ' is-copied' : ''}`}
                onClick={() => copy(idea)}
                aria-label={`Copiar la idea ${idea.title}`}
              >
                {copiedId === idea.id ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                {copiedId === idea.id ? 'Copiada' : 'Copiar'}
              </button>
            </div>
            <p className="idea__caption">“{idea.caption}”</p>
            <p className="idea__sticker">
              <span aria-hidden="true">✨</span> {idea.sticker}
            </p>
            <p className="idea__why">
              {idea.why} <span className="idea__when">· {idea.when}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
