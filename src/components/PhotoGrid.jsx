import { PHOTO_GRIDS, GRID_LETTERS } from '../utils/photoLayouts'

export default function PhotoGrid({ media, captions = [], onLightbox }) {
  const count = Math.min(media.length, 15)
  if (count === 0) return null

  const grid = PHOTO_GRIDS[count]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: grid.cols,
        gridTemplateRows: grid.rows,
        gridTemplateAreas: grid.areas,
        gap: 4,
      }}
    >
      {media.slice(0, count).map((item, i) => (
        <div
          key={i}
          className="pg-item"
          style={{ gridArea: GRID_LETTERS[i] }}
        >
          {item.type === 'image'
            ? <img src={item.src} alt="" className="pg-img" onClick={() => onLightbox?.(item.src)} />
            : <video src={item.src} controls className="pg-img pg-video" />
          }
          {captions[i] && <div className="pg-caption">{captions[i]}</div>}
        </div>
      ))}
    </div>
  )
}
