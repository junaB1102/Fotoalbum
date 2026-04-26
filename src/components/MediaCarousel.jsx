import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

export default function MediaCarousel({ images = [], video = null }) {
  const media = [
    ...images.map(src => ({ type: 'image', src })),
    ...(video ? [{ type: 'video', src: video }] : []),
  ]

  const [current, setCurrent] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.pause()
  }, [current])

  if (media.length === 0) return null

  if (media.length === 1) {
    const m = media[0]
    return m.type === 'image'
      ? <img src={m.src} alt="" className="detail-hero" />
      : <video src={m.src} controls className="detail-hero" style={{ maxHeight: 380 }} />
  }

  const prev = () => setCurrent(c => (c - 1 + media.length) % media.length)
  const next = () => setCurrent(c => (c + 1) % media.length)
  const cur = media[current]

  return (
    <div className="carousel">
      <div className="carousel-stage">
        {cur.type === 'image'
          ? <img src={cur.src} alt={`Bild ${current + 1}`} className="carousel-media" />
          : <video ref={videoRef} src={cur.src} controls className="carousel-media" />
        }

        <button className="carousel-btn carousel-btn-prev" onClick={prev} aria-label="Zurück">
          <ChevronLeft size={22} />
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={next} aria-label="Weiter">
          <ChevronRight size={22} />
        </button>

        <div className="carousel-counter">{current + 1} / {media.length}</div>
      </div>

      <div className="carousel-thumbs">
        {media.map((item, i) => (
          <button
            key={i}
            className={'carousel-thumb' + (i === current ? ' active' : '')}
            onClick={() => setCurrent(i)}
          >
            {item.type === 'image'
              ? <img src={item.src} alt="" />
              : <div className="carousel-thumb-video"><Play size={16} /></div>
            }
          </button>
        ))}
      </div>
    </div>
  )
}
