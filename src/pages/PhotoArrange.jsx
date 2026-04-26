import { useParams, useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { PHOTO_GRIDS, GRID_LETTERS } from '../utils/photoLayouts'

export default function PhotoArrange() {
  const { id } = useParams()
  const { getEntry, updateEntry } = useDiary()
  const navigate = useNavigate()
  const entry = getEntry(id)

  const [order, setOrder] = useState(() => (entry?.images || []).map((_, i) => i))
  const [selected, setSelected] = useState(null)

  if (!entry) return null

  const images = entry.images || []
  const count = Math.min(images.length, 15)
  const grid = PHOTO_GRIDS[count]

  function handleClick(displayIdx) {
    if (selected === null) {
      setSelected(displayIdx)
    } else if (selected === displayIdx) {
      setSelected(null)
    } else {
      const next = [...order]
      ;[next[selected], next[displayIdx]] = [next[displayIdx], next[selected]]
      setOrder(next)
      setSelected(null)
    }
  }

  function handleDone() {
    const captions = entry.imageCaptions || []
    updateEntry(id, {
      images: order.map(i => images[i]),
      imageCaptions: order.map(i => captions[i] || ''),
    })
    navigate(`/entry/${id}`)
  }

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button className="btn btn-ghost" style={{ display: 'inline-flex' }} onClick={() => navigate(`/entry/${id}`)}>
          <ArrowLeft size={16} /> Skip
        </button>
        <button className="btn btn-primary" onClick={handleDone} style={{ display: 'inline-flex' }}>
          <Check size={15} /> Done
        </button>
      </div>

      <h1 className="page-title" style={{ marginBottom: 4 }}>Arrange photos</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        {selected !== null
          ? 'Tap a second photo to swap positions.'
          : 'Tap a photo to select it, then tap another to swap their positions.'}
      </p>

      {grid && (
        <div
          className="arrange-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: grid.cols,
            gridTemplateRows: grid.rows,
            gridTemplateAreas: grid.areas,
            gap: 4,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          }}
        >
          {order.slice(0, count).map((imgIdx, displayIdx) => (
            <div
              key={displayIdx}
              className={`arrange-cell${selected === displayIdx ? ' arrange-cell--selected' : ''}${selected !== null && selected !== displayIdx ? ' arrange-cell--target' : ''}`}
              style={{ gridArea: GRID_LETTERS[displayIdx] }}
              onClick={() => handleClick(displayIdx)}
            >
              <img src={images[imgIdx]} alt="" />
              {selected === displayIdx && (
                <div className="arrange-cell-overlay">
                  <span className="arrange-cell-hint">Tap to swap</span>
                </div>
              )}
              <span className="arrange-cell-num">{displayIdx + 1}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleDone} style={{ padding: '10px 28px' }}>
          <Check size={15} /> Save order
        </button>
      </div>
    </div>
  )
}
